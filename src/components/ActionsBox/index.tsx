import React, {MouseEvent} from 'react';
import Filters from "../Filters";
import {Month} from "../../interfaces/index";

import styles from './styles.module.css';

type ActionBoxProps = {
  years: Array<number>,
  months: Array<Month>,
  year: number,
  month: number,
  handleChangeYearOrMonth: any,
  handleSearch: any,
  handleSubmit: any,
  isLoadingSearch: boolean,
  isLoadingSubmit: boolean,
}

const ActionsBox = (props: ActionBoxProps) => {
  const handleOnClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    props.handleSubmit();
  }

  return (
    <div className={styles.container}>
      <Filters
        years={props.years}
        months={props.months}
        year={props.year}
        month={props.month}
        handleChangeYearOrMonth={props.handleChangeYearOrMonth}
        handleSearch={props.handleSearch}
        isLoadingSearch={props.isLoadingSearch}
      />
      <button
        className={`button is-primary ${props.isLoadingSubmit ? 'is-loading' : ''}`}
        onClick={handleOnClick}
      >
        Guardar
      </button>
    </div>
  );
}

export default ActionsBox;
