import React, {MouseEvent, useState, useEffect} from 'react';
import {Month} from "../../interfaces/index";

import styles from './styles.module.css';

type FiltersProps = {
  years: Array<number>,
  months: Array<Month>,
  year: number,
  month: number,
  handleChangeYearOrMonth: any,
  handleSearch: any,
  isLoadingSearch: boolean,
}

const FILTERS_INITIAL_STATE = {
  year: 0,
  month: 0
}

const Filters = (props: FiltersProps) => {
  const [state, setState] = useState(FILTERS_INITIAL_STATE);

  useEffect(() => {
    setState({
      year: props.year,
      month: props.month,
    })
  }, []);

  const handleOnClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    props.handleSearch();
  }

  const handleChangeSelect = (event: any) => {
    const name = event.target.name;
    const value = +event.target.value;
    setState({
      ...state,
      [name]: value,
    });

    props.handleChangeYearOrMonth(event);
  }

  return (
    <div className={styles.container}>
      <div className="field">
        <div className="select">
          <select
            value={state.year}
            onChange={handleChangeSelect}
            name={'year'}
          >
            <option>Año</option>
            {
              props.years.map((year) => {
                return <option key={year} value={year}>{year}</option>
              })
            }
          </select>
        </div>
      </div>
      <div className="field">
        <div className="select">
          <select
            value={state.month}
            onChange={handleChangeSelect}
            name={'month'}
          >
            <option>Mes</option>
            {
              props.months.map((month) => {
                return <option key={month.value} value={month.value}>{month.name}</option>
              })
            }
          </select>
        </div>
      </div>
      <div>
        <button
          className={`button ${props.isLoadingSearch ? 'is-loading' : ''}`}
          onClick={handleOnClick}
        >
          Buscar
        </button>
      </div>
    </div>
  );
}

export default Filters;
