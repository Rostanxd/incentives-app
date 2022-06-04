import React from 'react';
import DatePicker from "react-datepicker";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faAdd } from '@fortawesome/free-solid-svg-icons'

import {Constants, Functions} from "../../utils/index";
import {TableFooter, TableHeaderWeeklyGoal, TableRow} from "../../interfaces/index";

import "react-datepicker/dist/react-datepicker.css";
import './styles.css'
import styles from './styles.module.css';

type TableProps = {
  rangeDates: Array<TableHeaderWeeklyGoal>,
  rows: Array<TableRow>,
  footer: TableFooter,
  isLoadingSubmit: boolean,
  handleChangeWeekDates: any,
  handleChangeGoal: any,
  handleChangeWeeklyGoals: any,
  handleNewWeekDates: any,
  handleDeleteWeekDates: any,
}

const Table = (props: TableProps) => {
  const handleOnClickHeaderWeeklyGoals = (alias: string, dateType: 'from' | 'end', date: Date) => {
    props.handleChangeWeekDates(alias, dateType, moment(date).format(Constants.DATE_STRING_FORMAT));
  }

  const handleOnChangeGoal = (goal: string, storeId: string, event: any) => {
    const reg = Constants.REGEX_NUMBER;
    const value = event.target.value.replace(',', '');
    if (reg.test(value) || value === "") {
      props.handleChangeGoal(goal, storeId, +value);
    }
  }

  const handleOnChangeWeeklyGoal = (alias: string, storeId: string, event: any) => {
    const reg = Constants.REGEX_NUMBER;
    const value = event.target.value.replace(',', '');
    if (reg.test(value) || value === "") {
      props.handleChangeWeeklyGoals(alias, storeId, +value);
    }
  }

  const handleNewColumn = (event: any) => {
    event.preventDefault();
    props.handleNewWeekDates();
  }

  const handleOnDeleteColumn = (alias: string, event: any) => {
    event.preventDefault();
    props.handleDeleteWeekDates(alias);
  }

  return (
    <div className={styles.wrapper}>
      <table className="table is-hoverable">
        <thead>
        <tr>
          <th className={styles.tableColFrozen}>
            <abbr title="Local">Local</abbr>
          </th>
          {/*<th><abbr title="Estado">Estado</abbr></th>*/}
          <th><abbr title="Meta #2">Meta #2</abbr></th>
          <th><abbr title="Meta #1">Meta #1</abbr></th>
          {
            props.rangeDates.map((range, index) => {
              return (
                <th key={index}>
                  {/*<p>{range.alias}</p>*/}
                  <div className={styles.thWeeksContainer}>
                    <div className={styles.thDates}>
                      <DatePicker
                        disabled={props.isLoadingSubmit}
                        selected={!!range.dateFrom ? moment(range.dateFrom, Constants.DATE_STRING_FORMAT).toDate() : null}
                        onChange={(date: Date) => handleOnClickHeaderWeeklyGoals(range.alias, 'from', date)}
                        className={`calendar-input ${range.error ? 'column-error' : ''}`}
                      />
                      <br/>
                      <DatePicker
                        disabled={props.isLoadingSubmit}
                        selected={!!range.dateEnd ? moment(range.dateEnd, Constants.DATE_STRING_FORMAT).toDate() : null}
                        onChange={(date: Date) => handleOnClickHeaderWeeklyGoals(range.alias, 'end', date)}
                        className={`calendar-input ${range.error ? 'column-error' : ''}`}
                      />
                      <br/>
                    </div>
                    <div className={styles.thButton}>
                      <button
                        className="button is-danger is-outlined is-small"
                        onClick={(event) => handleOnDeleteColumn(range.alias, event)}
                      >
                        <span className="icon is-small">
                          <FontAwesomeIcon icon={faTrash}/>
                        </span>
                      </button>
                    </div>
                  </div>
                </th>
              );
            })
          }
          <th>
            <button
              className="button is-primary is-small"
              onClick={handleNewColumn}
            >
              <span className="icon is-small"><FontAwesomeIcon icon={faAdd}/></span>
            </button>
          </th>
        </tr>
        </thead>
        <tfoot>
        <tr>
          <th className={styles.tableColFrozen}>Totales</th>
          {/*<th>-</th>*/}
          <th>{Functions.numberWithThousandsSeparator(props.footer.goalTwo)}</th>
          <th>{Functions.numberWithThousandsSeparator(props.footer.goalOne)}</th>
          {
            props.footer.weeklyGoals.map((goal) => {
              return <th key={goal.alias}>
                {Functions.numberWithThousandsSeparator(goal.value)}
                {/*<p>{goal.alias}</p>*/}
              </th>;
            })
          }
        </tr>
        </tfoot>
        <tbody>
        {
          props.rows.map((row) => {
            return (
              <tr key={`store-row-${row.storeId}`}>
                <th className={styles.tableColFrozen}
                    style={{color: `${row.error ? 'darkred' : ''}`}}>{row.storeName}</th>
                {/*<td>{row.status}</td>*/}
                <td>
                  <input
                    disabled={props.isLoadingSubmit}
                    type="text"
                    value={Functions.numberWithThousandsSeparator(row.goalTwo)}
                    onChange={(event) => handleOnChangeGoal("two", row.storeId, event)}
                  />
                </td>
                <td>
                  <input
                    disabled={props.isLoadingSubmit}
                    type="text"
                    value={Functions.numberWithThousandsSeparator(row.goalOne)}
                    onChange={(event) => handleOnChangeGoal("one", row.storeId, event)}
                  />
                </td>
                {
                  row.weeklyGoals.map((weeklyGoal, index) => {
                    return (
                      <td key={`range-date-${index}`}>
                        <input
                          className={row.error ? styles.rowError : ''}
                          disabled={props.isLoadingSubmit}
                          type="text"
                          value={Functions.numberWithThousandsSeparator(weeklyGoal.value)}
                          onChange={(event) => handleOnChangeWeeklyGoal(weeklyGoal.alias, row.storeId, event)}
                        />
                        {/*<p>{weeklyGoal.alias}</p>*/}
                        {/*<p>{weeklyGoal.dateFrom}</p>*/}
                        {/*<p>{weeklyGoal.dateEnd}</p>*/}
                      </td>
                    );
                  })
                }
              </tr>
            );
          })
        }
        </tbody>
      </table>
    </div>
  );
}

export default Table;
