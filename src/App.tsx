import React, {useState, useEffect} from 'react';
import moment from "moment";

import ActionsBox from "./components/ActionsBox";
import Table from "./components/Table";
import IncentivesAPI from "./services/IncentivesAPI";
import {MONTHS} from "./util/constants";
import {StoreData, TableFooter, TableHeaderWeeklyGoal, TableRow} from "./util/interfaces";

import 'bulma/css/bulma.css';
import {dateStringToAlias} from "./util/functions";

interface AppState {
  year: number,
  month: number,
  tableHeadersWeeklyGoals: Array<TableHeaderWeeklyGoal>,
  tableRows: Array<TableRow>,
  tableFooter: TableFooter,
  storeData: Array<StoreData>,
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
  storeData: [],
  isLoadingSearch: false,
  isLoadingSubmit: false,
  errorMessage: "",
}

function App() {
  //  Getting values from the URL
  const queryParams = new URLSearchParams(window.location.search);
  const queryYear = queryParams.get('anio');
  const queryMonth = queryParams.get('mes');
  const year = !!queryYear ? +queryYear : APP_INITIAL_STATE.year;
  const month = !!queryMonth ? +queryMonth : APP_INITIAL_STATE.month;
  const [state, setState] = useState<AppState>({...APP_INITIAL_STATE, year: year, month: month});

  useEffect(() => {
    getIncentivesByYearAndMonth(state.year, state.month);
  }, []);

  const getIncentivesByYearAndMonth = (year: number, month: number) => {
    if (!!year && !!month) {
      setState({
        ...state,
        isLoadingSearch: true,
        errorMessage: "",
      })

      setTimeout(() => {
        IncentivesAPI.getIncentives(year, month)
          .then((response) => {
            if (response.status === 200) {
              const data: Array<StoreData> = response.data;
              const tableRows = [];
              const tableFooter: TableFooter = {
                goalOne: 0,
                goalTwo: 0,
                weeklyGoals: [],
              };
              const rangesDates: Array<TableHeaderWeeklyGoal> = [];

              for (let i = 0; i < data.length; i++) {
                const storeData = data[i];
                const weeklyGoals = storeData.metas_semanales;

                //  Logic to get the ranges of dates
                for (let x = 0; x < weeklyGoals.length; x++) {
                  const weeklyGoal = weeklyGoals[x];
                  const rangeDate = `${dateStringToAlias(weeklyGoal.desde)} - ${dateStringToAlias(weeklyGoal.hasta)}`;
                  weeklyGoal[rangeDate] = weeklyGoal.meta;
                  if (
                    rangesDates.length === 0 ||
                    rangesDates.filter((range) => range.alias === rangeDate).length === 0
                  ) {
                    rangesDates.push({
                      dateFrom: weeklyGoal.desde,
                      dateEnd: weeklyGoal.hasta,
                      alias: rangeDate,
                    });

                    tableFooter.weeklyGoals.push({
                      dateFrom: weeklyGoal.desde,
                      dateEnd: weeklyGoal.hasta,
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

              for (let i = 0; i < data.length; i++) {
                const storeData = data[i];
                const weeklyGoals = storeData.metas_semanales;
                tableFooter.goalOne += storeData.meta_uno;
                tableFooter.goalTwo += storeData.meta_dos;

                //  Adding data for the table
                tableRows.push({
                  storeId: storeData.localId,
                  storeName: storeData.local,
                  goalOne: storeData.meta_uno,
                  goalTwo: storeData.meta_dos,
                  status: storeData.estado,
                  weeklyGoals: rangesDates.map((range) => {
                    const filter = weeklyGoals.filter((weeklyGoal) => !!weeklyGoal[range.alias])?.[0];
                    return !!filter ?
                      {
                        alias: range.alias,
                        value: filter.meta,
                        dateFrom: filter.desde,
                        dateEnd: filter.hasta,
                      } : {
                        alias: range.alias,
                        value: 0,
                        dateFrom: "",
                        dateEnd: "",
                      };
                  })
                });

                // Footers
                if (tableFooter.weeklyGoals.length > 0) {
                  for (let i = 0; i < tableFooter.weeklyGoals.length; i++) {
                    const footer = tableFooter.weeklyGoals[i];
                    footer.value += weeklyGoals.filter((goal) => !!goal[footer.alias])?.[0].meta ?? 0;
                  }
                }
              }

              setState({
                ...state,
                tableHeadersWeeklyGoals: rangesDates,
                tableRows: tableRows,
                tableFooter: tableFooter,
                storeData: data,
                isLoadingSearch: false,
                errorMessage: "",
              });
            } else if (response.status === 404) {
              setState({
                ...state,
                tableHeadersWeeklyGoals: [],
                tableRows: [],
                storeData: [],
                isLoadingSearch: false,
                errorMessage: "No existe registro con este año y mes."
              });
            } else {
              setState({
                ...state,
                tableHeadersWeeklyGoals: [],
                tableRows: [],
                storeData: [],
                isLoadingSearch: false,
                errorMessage: "Error inesperado!"
              });
            }
          })
          .catch((error) => {
            if (error.response.status === 404) {
              setState({
                ...state,
                tableHeadersWeeklyGoals: [],
                tableRows: [],
                storeData: [],
                isLoadingSearch: false,
                errorMessage: "Recurso no encontrado!"
              });
            } else {
              setState({
                ...state,
                tableHeadersWeeklyGoals: [],
                tableRows: [],
                storeData: [],
                isLoadingSearch: false,
                errorMessage: "Error inesperado!"
              });
            }
          });
      }, 1000);
    } else {
      setState({
        ...state,
        isLoadingSearch: false,
        errorMessage: "No has seleccionado año o mes",
      })
    }
  }

  const handleSearch = (year: number, month: number) => {
    getIncentivesByYearAndMonth(year, month);
  }

  const handleSubmit = () => {
    setState({
      ...state,
      isLoadingSubmit: true,
      errorMessage: "",
    })

    const tableRows = state.tableRows;
    const payload: Array<StoreData> = [];

    for (let i = 0; i < tableRows.length; i++) {
      const row = tableRows[i];
      const weeklyGoals = row.weeklyGoals;
      const data = {
        localId: row.storeId,
        meta_uno: row.goalOne,
        meta_dos: row.goalTwo,
        metas_semanales: weeklyGoals.map((weeklyGoal) => {
          return {
            desde: weeklyGoal.dateFrom,
            hasta: weeklyGoal.dateEnd,
            meta: weeklyGoal.value,
          }
        }),
      }
      payload.push(data);
    }

    // TODO: calling the real submit API
    alert(JSON.stringify(payload));
    setState({
      ...state,
      isLoadingSubmit: false,
      errorMessage: "",
    })
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
      const newAlias = `${dateStringToAlias(tableHeaderWeeklyGoal.dateFrom)} - ${dateStringToAlias(tableHeaderWeeklyGoal.dateEnd)}`;
      tableHeaderWeeklyGoal.alias = newAlias;
      tableFooterWeeklyGoal.alias = newAlias;
      // Updating rows
      for (let i = 0; i < tableRows.length; i++) {
        const row = tableRows[i];
        for (let x = 0; x < row.weeklyGoals.length; x++) {
          const goal = row.weeklyGoals[x];
          if (goal.alias === alias) {
            goal.alias = newAlias;
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
        years={[2022]}
        months={MONTHS}
        initialYear={state.year}
        initialMonth={state.month}
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
        state.storeData.length > 0 &&
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
