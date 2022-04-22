import React, {MouseEvent} from 'react';
import Filters from "../Filters";
import {Month} from "../../util/interfaces";

import styles from './styles.module.css';

type ActionBoxProps = {
  years: Array<number>,
  months: Array<Month>,
  initialYear: number,
  initialMonth: number,
  handleSearch?: any,
  handleSubmit?: any,
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
        initialYear={props.initialYear}
        initialMonth={props.initialMonth}
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
