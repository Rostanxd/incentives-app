import React, {useState, useEffect} from 'react';
import moment from "moment";

import ActionsBox from "./components/ActionsBox";
import Table from "./components/Table";
import IncentivesAPI from "./services/IncentivesAPI";
import {Constants} from "./utils/index";
import {
  LibretasMetasData,
  SdtLibretaMetasLocal,
  TableFooter,
  TableHeaderWeeklyGoal,
  TableRow
} from "./interfaces/index";

import 'bulma/css/bulma.css';

import {Functions} from "./utils/index";

interface AppState {
  year: number,
  month: number,
  tableHeadersWeeklyGoals: Array<TableHeaderWeeklyGoal>,
  tableRows: Array<TableRow>,
  tableFooter: TableFooter,
  storesData: Array<SdtLibretaMetasLocal>,
  isLoadingSearch: boolean,
  isLoadingSubmit: boolean,
  errorMessage: string,
}

const APP_INITIAL_STATE: AppState = {
  year: moment().year(),
  month: moment().month() + 1,
  tableHeadersWeeklyGoals: [],
  tableRows: [],
  tableFooter: {
    goalOne: 0,
    goalTwo: 0,
    weeklyGoals: []
  },
  storesData: [],
  isLoadingSearch: false,
  isLoadingSubmit: false,
  errorMessage: "",
}

function App() {
  const [state, setState] = useState<AppState>(APP_INITIAL_STATE);

  // This useEffect is called whenever the year or month is updated.
  useEffect(() => {
    getIncentivesByYearAndMonth(state.year, state.month);
  }, [state.year, state.month]);

  const getIncentivesByYearAndMonth = (year: number, month: number) => {
    if (!!year && !!month) {
      setState({
        ...state,
        isLoadingSearch: true,
        errorMessage: "",
      });

      IncentivesAPI.getIncentives(year, month)
        .then((response) => {
          if (response.status === 200) {
            const data: LibretasMetasData = response.data;
            const incentives = data.SdtLibretaMetas;
            const storesData = incentives.locales;

            const tableRows = [];
            const tableFooter: TableFooter = {
              goalOne: 0,
              goalTwo: 0,
              weeklyGoals: [],
            };
            const rangesDates: Array<TableHeaderWeeklyGoal> = [];

            for (let i = 0; i < storesData.length; i++) {
              const storeData = storesData[i];
              const weeklyGoals = storeData.semanas;

              //  Logic to get the ranges of dates
              for (let x = 0; x < weeklyGoals.length; x++) {
                const weeklyGoal = weeklyGoals[x];
                const rangeDate = `${Functions.dateStringToAlias(weeklyGoal.fecha_desde)} - ${Functions.dateStringToAlias(weeklyGoal.fecha_hasta)}`;
                weeklyGoal[rangeDate] = weeklyGoal.meta;
                if (
                  rangesDates.length === 0 ||
                  rangesDates.filter((range) => range.alias === rangeDate).length === 0
                ) {
                  rangesDates.push({
                    dateFrom: weeklyGoal.fecha_desde,
                    dateEnd: weeklyGoal.fecha_hasta,
                    alias: rangeDate,
                  });

                  tableFooter.weeklyGoals.push({
                    dateFrom: weeklyGoal.fecha_desde,
                    dateEnd: weeklyGoal.fecha_hasta,
                    alias: rangeDate,
                    value: 0
                  });
                }
              }
            }

            //  Sorting
            rangesDates.sort((a, b) => {
              if (a.alias > b.alias) {
                return 1;
              } else if (a.alias < b.alias) {
                return -1;
              } else {
                return 0;
              }
            });

            for (let i = 0; i < storesData.length; i++) {
              const storeData = storesData[i];
              const weeklyGoals = storeData.semanas;
              tableFooter.goalOne += storeData.meta_mensual_uno;
              tableFooter.goalTwo += storeData.meta_mensual_dos;

              //  Adding data for the table
              tableRows.push({
                storeId: storeData.local_id,
                storeName: storeData.local_nombre,
                goalOne: storeData.meta_mensual_uno,
                goalTwo: storeData.meta_mensual_dos,
                status: storeData.estado,
                weeklyGoals: rangesDates.map((range) => {
                  if (!!weeklyGoals && weeklyGoals.length > 0) {
                    const filter = weeklyGoals.filter((weeklyGoal) => !!weeklyGoal[range.alias])?.[0];
                    return !!filter ?
                      {
                        alias: range.alias,
                        value: filter.meta,
                        dateFrom: filter.fecha_desde,
                        dateEnd: filter.fecha_hasta,
                      } : {
                        alias: range.alias,
                        value: 0,
                        dateFrom: "",
                        dateEnd: "",
                      };
                  } else {
                    return {
                      alias: range.alias,
                      value: 0,
                      dateFrom: range.dateFrom,
                      dateEnd: range.dateEnd,
                    }
                  }
                })
              });

              // Footers
              if (tableFooter.weeklyGoals.length > 0) {
                for (let i = 0; i < tableFooter.weeklyGoals.length; i++) {
                  const footer = tableFooter.weeklyGoals[i];
                  footer.value += weeklyGoals.filter((goal) => !!goal[footer.alias])?.[0]?.meta ?? 0;
                }
              }
            }

            setState({
              ...state,
              tableHeadersWeeklyGoals: rangesDates,
              tableRows: tableRows,
              tableFooter: tableFooter,
              storesData: storesData,
              isLoadingSearch: false,
              errorMessage: "",
            });
          } else if (response.status === 404) {
            setState({
              ...state,
              tableHeadersWeeklyGoals: [],
              tableRows: [],
              storesData: [],
              isLoadingSearch: false,
              errorMessage: "No existe registro con este año y mes."
            });
          } else {
            setState({
              ...state,
              tableHeadersWeeklyGoals: [],
              tableRows: [],
              storesData: [],
              isLoadingSearch: false,
              errorMessage: "Error inesperado!"
            });
          }
        })
        .catch((error) => {
          console.error(error);
          if (error.response.status === 404) {
            setState({
              ...state,
              tableHeadersWeeklyGoals: [],
              tableRows: [],
              storesData: [],
              isLoadingSearch: false,
              errorMessage: "Recurso no encontrado!"
            });
          } else {
            setState({
              ...state,
              tableHeadersWeeklyGoals: [],
              tableRows: [],
              storesData: [],
              isLoadingSearch: false,
              errorMessage: "Error inesperado!"
            });
          }
        });
    } else {
      setState({
        ...state,
        isLoadingSearch: false,
        errorMessage: "No has seleccionado año o mes",
      })
    }
  }

  const handleSearch = () => {
    getIncentivesByYearAndMonth(state.year, state.month);
  }

  const handleSubmit = () => {
    setState({
      ...state,
      isLoadingSubmit: true,
      errorMessage: "",
    })

    const tableRows = state.tableRows;
    const payload: LibretasMetasData = {
      SdtLibretaMetas: {
        anio: state.year,
        mes: state.month,
        locales: []
      }
    };

    for (let i = 0; i < tableRows.length; i++) {
      const row = tableRows[i];
      const weeklyGoals = row.weeklyGoals;
      const data = {
        local_id: row.storeId,
        meta_mensual_uno: row.goalOne,
        meta_mensual_dos: row.goalTwo,
        semanas: weeklyGoals.map((weeklyGoal, index) => {
          return {
            linea: index + 1,
            fecha_desde: weeklyGoal.dateFrom,
            fecha_hasta: weeklyGoal.dateEnd,
            meta: weeklyGoal.value,
          }
        }),
      }
      payload.SdtLibretaMetas.locales.push(data);
    }

    setState({
      ...state,
      isLoadingSubmit: true,
      errorMessage: "",
    });

    IncentivesAPI.postIncentives(state.year, state.month, payload)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setState({
          ...state,
          isLoadingSubmit: false,
          errorMessage: "",
        });
      });
  }

  const handleChangeYearOrMonth = (event: any) => {
    const name = event.target.name;
    const value = +event.target.value;
    setState({
      ...state,
      [name]: value,
    });
  }

  const handleChangeWeekDates = (alias: string, dateType: string, newDate: string) => {
    const tableHeadersWeeklyGoals = [...state.tableHeadersWeeklyGoals];
    const tableRows = [...state.tableRows];
    const tableFooter = {...state.tableFooter};
    const tableHeaderWeeklyGoal = tableHeadersWeeklyGoals
      .filter((goal) => goal.alias === alias)?.[0];
    const tableFooterWeeklyGoal = tableFooter.weeklyGoals
      .filter((goal) => goal.alias === alias)?.[0];

    if (!!tableHeaderWeeklyGoal && !!tableFooterWeeklyGoal) {
      // Updating headers
      if (dateType === 'from') {
        tableHeaderWeeklyGoal.dateFrom = newDate;
        tableFooterWeeklyGoal.dateFrom = newDate;
      } else {
        tableHeaderWeeklyGoal.dateEnd = newDate;
        tableFooterWeeklyGoal.dateEnd = newDate;
      }

      // Alias
      const newAlias = `${Functions.dateStringToAlias(tableHeaderWeeklyGoal.dateFrom)} - ${Functions.dateStringToAlias(tableHeaderWeeklyGoal.dateEnd)}`;
      tableHeaderWeeklyGoal.alias = newAlias;
      tableFooterWeeklyGoal.alias = newAlias;

      // Updating rows
      for (let i = 0; i < tableRows.length; i++) {
        const row = tableRows[i];
        for (let x = 0; x < row.weeklyGoals.length; x++) {
          const goal = row.weeklyGoals[x];
          if (goal.alias === alias) {
            goal.alias = newAlias;
            if (dateType === 'from') {
              goal.dateFrom = newDate;
            } else {
              goal.dateEnd = newDate;
            }
            break;
          }
        }
      }
    }

    setState({
      ...state,
      tableHeadersWeeklyGoals: tableHeadersWeeklyGoals,
      tableRows: tableRows,
    })
  }

  const handleChangeGoals = (goal: 'one' | 'two', storeId: string, value: number) => {
    const tableRows: Array<TableRow> = state.tableRows;
    let sumGoalOne = 0;
    let sumGoalTwo = 0;

    for (let i = 0; i < tableRows.length; i++) {
      const row = tableRows[i];
      if (row.storeId === storeId) {
        row[`${goal === "one" ? 'goalOne' : 'goalTwo'}`] = value;
      }

      sumGoalOne += row.goalOne;
      sumGoalTwo += row.goalTwo;
    }

    setState({
      ...state,
      tableRows: tableRows,
      tableFooter: {
        ...state.tableFooter,
        goalOne: sumGoalOne,
        goalTwo: sumGoalTwo,
      }
    });
  }

  const handleChangeWeeklyGoals = (alias: string, storeId: string, value: number) => {
    const tableRows: Array<TableRow> = state.tableRows;
    const tableFooter: TableFooter = {...state.tableFooter};
    let aliasTotal = 0;

    for (let i = 0; i < tableRows.length; i++) {
      const row = tableRows[i];

      for (let x = 0; x < row.weeklyGoals.length; x++) {
        const weeklyGoal = row.weeklyGoals[x];
        if (row.storeId === storeId && weeklyGoal.alias === alias) {
          weeklyGoal.value = value;
        }

        if (weeklyGoal.alias === alias) {
          aliasTotal += weeklyGoal.value;
        }
      }
    }

    for (let i = 0; i < tableFooter.weeklyGoals.length; i++) {
      const goal = tableFooter.weeklyGoals[i];
      if (goal.alias === alias) {
        goal.value = aliasTotal;
        break;
      }
    }

    setState({
      ...state,
      tableRows: tableRows,
      tableFooter: tableFooter
    })
  }

  const handleNewWeekDates = () => {
    let tableHeadersWeeklyGoals = [...state.tableHeadersWeeklyGoals];
    let tableRows = [...state.tableRows];
    let tableFooter = {...state.tableFooter};

    const newAlias = tableHeadersWeeklyGoals.length;

    // Adding new dates to header
    tableHeadersWeeklyGoals.push({
      alias: `${newAlias}`,
      dateFrom: "",
      dateEnd: ""
    });

    // Adding new dates to rows
    for (let i = 0; i < tableRows.length; i++) {
      const row = tableRows[i];
      row.weeklyGoals.push({
        alias: `${newAlias}`,
        dateFrom: "",
        dateEnd: "",
        value: 0,
      });
    }

    // Adding new dates to footer
    tableFooter.weeklyGoals.push({
      alias: `${newAlias}`,
      dateFrom: "",
      dateEnd: "",
      value: 0,
    });

    setState({
      ...state,
      tableHeadersWeeklyGoals: tableHeadersWeeklyGoals,
      tableRows: tableRows,
    })
  }

  const handleDeleteWeekDates = (alias: string) => {
    let tableHeadersWeeklyGoals = [...state.tableHeadersWeeklyGoals];
    let tableRows = [...state.tableRows];
    let tableFooter = {...state.tableFooter};

    // Filtering headers
    tableHeadersWeeklyGoals = tableHeadersWeeklyGoals.filter((header) => header.alias !== alias);

    // Filtering rows
    for (let i = 0; i < tableRows.length; i++) {
      const row = tableRows[i];
      row.weeklyGoals = row.weeklyGoals.filter((goal) => goal.alias !== alias);
    }

    // Filtering footer
    tableFooter.weeklyGoals = tableFooter.weeklyGoals.filter((goal) => goal.alias !== alias);

    setState({
      ...state,
      tableHeadersWeeklyGoals: tableHeadersWeeklyGoals,
      tableRows: tableRows,
      tableFooter: tableFooter
    })
  }

  return (
    <div className={"section"}>
      <ActionsBox
        years={Constants.YEARS}
        months={Constants.MONTHS}
        year={state.year}
        month={state.month}
        handleChangeYearOrMonth={handleChangeYearOrMonth}
        handleSearch={handleSearch}
        handleSubmit={handleSubmit}
        isLoadingSearch={state.isLoadingSearch}
        isLoadingSubmit={state.isLoadingSubmit}
      />
      {state.isLoadingSearch && <div>Cargando...</div>}
      {!!state.errorMessage && <div>{state.errorMessage}</div>}
      {
        !state.isLoadingSearch &&
        !state.errorMessage &&
        state.storesData.length > 0 &&
        <Table
          rangeDates={state.tableHeadersWeeklyGoals}
          rows={state.tableRows}
          footer={state.tableFooter}
          handleChangeWeekDates={handleChangeWeekDates}
          handleChangeGoal={handleChangeGoals}
          handleChangeWeeklyGoals={handleChangeWeeklyGoals}
          handleNewWeekDates={handleNewWeekDates}
          handleDeleteWeekDates={handleDeleteWeekDates}
        />
      }
    </div>
  );
}

export default App;
