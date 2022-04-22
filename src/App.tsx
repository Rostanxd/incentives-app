import React, {useState, useEffect} from 'react';
import moment from "moment";

import ActionsBox from "./components/ActionsBox";
import Table from "./components/Table";
import IncentivesAPI from "./services/IncentivesAPI";
import {MONTHS} from "./util/constants";
import {StoreData, TableHeaderWeeklyGoal, TableRow} from "./util/interfaces";

import 'bulma/css/bulma.css';

interface AppState {
  year: number,
  month: number,
  tableHeadersWeeklyGoals: Array<TableHeaderWeeklyGoal>,
  tableRows: Array<TableRow>,
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
              const rangesDates = [];

              for (let i = 0; i < data.length; i++) {
                const storeData = data[i];
                const weeklyGoals = storeData.metas_semanales;

                //  Logic to get the ranges of dates
                for (let x = 0; x < weeklyGoals.length; x++) {
                  const weeklyGoal = weeklyGoals[x];
                  const dateFrom = moment(weeklyGoal.desde, "YYYY/MM/DD");
                  const endFrom = moment(weeklyGoal.hasta, "YYYY/MM/DD");
                  const rangeDate = `${dateFrom.format('DD')} - ${endFrom.format('DD')}`;
                  weeklyGoal[rangeDate] = weeklyGoal.meta;

                  if (rangesDates.length === 0 || rangesDates.filter((range) => range.title === rangeDate).length === 0) {
                    rangesDates.push({
                      title: rangeDate,
                    });
                  }
                }
              }

              //  Sorting
              rangesDates.sort((a, b) => {
                if (a.title > b.title) {
                  return 1;
                } else if (a.title < b.title) {
                  return -1;
                } else {
                  return 0;
                }
              });

              for (let i = 0; i < data.length; i++) {
                const storeData = data[i];
                const weeklyGoals = storeData.metas_semanales;

                //  Adding data for the table
                tableRows.push({
                  storeId: storeData.localId,
                  storeName: storeData.local,
                  goalOne: storeData.meta_uno,
                  goalTwo: storeData.meta_dos,
                  status: storeData.estado,
                  weeklyGoals: rangesDates.map((range) => {
                    const filter = weeklyGoals.filter((weeklyGoal) => !!weeklyGoal[range.title])?.[0];
                    return !!filter ?
                      {
                        name: range.title,
                        value: filter.meta,
                        dateFrom: filter.desde,
                        dateEnd: filter.hasta,
                      } : {
                        name: range.title,
                        value: 0,
                        dateFrom: "",
                        dateEnd: "",
                      };
                  })
                });
              }

              setState({
                ...state,
                tableHeadersWeeklyGoals: rangesDates,
                tableRows: tableRows,
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
      }, 3000);
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

  const handleChangeGoals = (goal: string, storeId: string, value: number) => {
    const storesData: Array<TableRow> = state.tableRows;
    for (let i = 0; i < storesData.length; i++) {
      const storeData = storesData[i];
      if (storeData.storeId === storeId) {
        storeData[`${goal === "one" ? 'goalOne' : 'goalTwo'}`] = value;
        break;
      }
    }

    setState({
      ...state,
      tableRows: storesData,
    });
  }

  const handleChangeWeeklyGoals = (range: string, storeId: string, value: number) => {
    const storesData: Array<TableRow> = state.tableRows;
    for (let i = 0; i < storesData.length; i++) {
      const storeData = storesData[i];
      let updated = false;

      if (storeData.storeId === storeId) {
        for (let x = 0; x < storeData.weeklyGoals.length; x++) {
          const weeklyGoal = storeData.weeklyGoals[x];
          if (weeklyGoal.name === range) {
            weeklyGoal.value = value;
            updated = true;
            break;
          }
        }
        if (updated) {
          break;
        }
      }
    }

    setState({
      ...state,
      tableRows: storesData,
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
          handleChangeGoal={handleChangeGoals}
          handleChangeWeeklyGoals={handleChangeWeeklyGoals}
        />
      }
    </div>
  );
}

export default App;
