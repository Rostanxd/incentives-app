import React from 'react';
import {TableHeaderWeeklyGoal, TableRow} from "../../util/interfaces";

type TableProps = {
  rangeDates: Array<TableHeaderWeeklyGoal>,
  rows: Array<TableRow>,
  handleChangeGoal: any,
  handleChangeWeeklyGoals: any,
}

const Table = (props: TableProps) => {

  const handleOnChangeGoal = (goal: string, storeId: string, event: any) => {
    props.handleChangeGoal(goal, storeId, +event.target.value);
  }

  const handleOnChangeWeeklyGoal = (range: string, storeId: string, event: any) => {
    props.handleChangeWeeklyGoals(range, storeId, +event.target.value);
  }

  return (
    <table className="table">
      <thead>
      <tr>
        <th><abbr title="Local">Local</abbr></th>
        <th><abbr title="Estado">Estado</abbr></th>
        <th><abbr title="Meta #1">Meta #1</abbr></th>
        <th><abbr title="Meta #2">Meta #2</abbr></th>
        {
          props.rangeDates.map((range, index) => {
            return <th key={index}>{range.title}</th>;
          })
        }
      </tr>
      </thead>
      <tfoot>
      <tr>
        <th><abbr title="Local">Local</abbr></th>
        <th><abbr title="Estado">Estado</abbr></th>
        <th><abbr title="Meta #1">Meta #1</abbr></th>
        <th><abbr title="Meta #2">Meta #2</abbr></th>
        {
          props.rangeDates.map((range, index) => {
            return <th key={index}>{range.title}</th>;
          })
        }
      </tr>
      </tfoot>
      <tbody>
      {
        props.rows.map((row) => {
          return (
            <tr key={`store-row-${row.storeId}`}>
              <th>{row.storeName}</th>
              <td>{row.status}</td>
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
                        onChange={(event) => handleOnChangeWeeklyGoal(weeklyGoal.name, row.storeId, event)}
                      />
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
  );
}

export default Table;
