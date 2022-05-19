import React from 'react';
import DatePicker from "react-datepicker";
import moment from "moment";

import {Constants}  from "../../utils/index";
import {TableFooter, TableHeaderWeeklyGoal, TableRow} from "../../interfaces/index";

import "react-datepicker/dist/react-datepicker.css";
import './styles.css'
import styles from './styles.module.css';

type TableProps = {
  rangeDates: Array<TableHeaderWeeklyGoal>,
  rows: Array<TableRow>,
  footer: TableFooter,
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
    const reg = /^\d+$/;
    const value = event.target.value;
    if (reg.test(value) || value === "") {
      props.handleChangeGoal(goal, storeId, +value);
    }
  }

  const handleOnChangeWeeklyGoal = (alias: string, storeId: string, event: any) => {
    const reg = /^\d+$/;
    const value = event.target.value;
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
          <th><abbr title="Meta #1">Meta #1</abbr></th>
          <th><abbr title="Meta #2">Meta #2</abbr></th>
          {
            props.rangeDates.map((range, index) => {
              return (
                <th key={index}>
                  {/*<p>{range.alias}</p>*/}
                  <DatePicker
                    selected={!!range.dateFrom ? moment(range.dateFrom, Constants.DATE_STRING_FORMAT).toDate() : null}
                    onChange={(date: Date) => handleOnClickHeaderWeeklyGoals(range.alias, 'from', date)}
                    className={'calendar-input'}
                  />
                  <br/>
                  <DatePicker
                    selected={!!range.dateEnd ? moment(range.dateEnd, Constants.DATE_STRING_FORMAT).toDate() : null}
                    onChange={(date: Date) => handleOnClickHeaderWeeklyGoals(range.alias, 'end', date)}
                    className={'calendar-input'}
                  />
                  <br/>
                  <a onClick={(event) => handleOnDeleteColumn(range.alias, event)}>Elminar -</a>
                </th>
              );
            })
          }
          <th><a onClick={handleNewColumn}>Agregar +</a></th>
        </tr>
        </thead>
        <tfoot>
        <tr>
          <th className={styles.tableColFrozen}>Totales</th>
          {/*<th>-</th>*/}
          <th>{props.footer.goalOne}</th>
          <th>{props.footer.goalTwo}</th>
          {
            props.footer.weeklyGoals.map((goal) => {
              return <th key={goal.alias}>
                {goal.value}
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
                <th className={styles.tableColFrozen}>{row.storeName}</th>
                {/*<td>{row.status}</td>*/}
                <td>
                  <input
                    type="text"
                    value={row.goalOne}
                    onChange={(event) => handleOnChangeGoal("one", row.storeId, event)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.goalTwo}
                    onChange={(event) => handleOnChangeGoal("two", row.storeId, event)}
                  />
                </td>
                {
                  row.weeklyGoals.map((weeklyGoal, index) => {
                    return (
                      <td key={`range-date-${index}`}>
                        <input
                          type="text"
                          value={weeklyGoal.value}
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
