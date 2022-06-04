import React, {useState, useEffect} from 'react';
import {TableHeaderWeeklyGoal, WeeklyPercentageGoal} from "../../interfaces";
import {Constants} from "../../utils";

type ModalPercentagesProps = {
  isOpen: boolean,
  weeklyGoals: Array<TableHeaderWeeklyGoal>,
  okButtonCallback?: any,
  handleOnCloseModal?: any,
}

interface ModelPercentagesState {
  isOpen: false,
  weeklyPercentageGoals: Array<WeeklyPercentageGoal>,
  errorMessage: string,
}

const INITIAL_STATE: ModelPercentagesState = {
  isOpen: false,
  weeklyPercentageGoals: [],
  errorMessage: "",
}

const ModalPercentages = (props: ModalPercentagesProps) => {
  const [state, setState] = useState({...INITIAL_STATE, ...{isOpen: props.isOpen}});

  const handleOnClickOkButton = (event: any) => {
    event.preventDefault();

    // Checking that the value of the percentages does not exceed the 100%
    const sum = state.weeklyPercentageGoals.reduce(function (prevVal, goal) {
      return prevVal + goal.percentage;
    }, 0);

    if (sum !== 100) {
      setState({
        ...state,
        errorMessage: `Sumatoria de porcentajes inválida: ${sum}%.`,
      });
      return;
    }

    if (!!props.okButtonCallback) {
      props.okButtonCallback(state.weeklyPercentageGoals);
    }

    closeModal();
  }

  const handleOnClickCloseButton = (event: any) => {
    event.preventDefault();
    closeModal();
    if (typeof props.handleOnCloseModal !== "undefined") {
      props.handleOnCloseModal();
    }
  }

  const closeModal = () => {
    setState({
      ...state,
      isOpen: false,
      errorMessage: "",
    });
  }

  const handleUpdateAliasPercentage = (alias: string, event: any) => {
    event.preventDefault();
    const weeklyPercentageGoals = [... state.weeklyPercentageGoals];
    weeklyPercentageGoals.forEach((goal) => {
      if (goal.weekAlias === alias) {
        const reg = Constants.REGEX_NUMBER;
        const value = event.target.value.replace(',', '');
        if (reg.test(value) || value === "") {
          goal.percentage = +value;
        }
      }
    });
    setState({
      ...state,
      weeklyPercentageGoals,
    })
  }

  // To handle open / close modal from parent component
  useEffect(() => {
    const weeklyPercentageGoals = props.weeklyGoals.map((goal) => {
      return {
        weekAlias: goal.alias,
        percentage: 0,
      };
    });

    setState({
      ...state,
      isOpen: props.isOpen,
      weeklyPercentageGoals: weeklyPercentageGoals
    });
  }, [props.isOpen]);

  return (
    <div id="custom-modal" className={`modal ${state.isOpen ? 'is-active' : ''}`}>
      <div className="modal-background"/>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Calcular metas en base a porcentajes</p>
          <button className="delete" aria-label="close" onClick={handleOnClickCloseButton}/>
        </header>
        <section className="modal-card-body">
          <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
            <thead>
            <tr>
              <th>Semana</th>
              <th>Porcentage %</th>
            </tr>
            </thead>
            <tbody>
            {
              state.weeklyPercentageGoals.map((goal, index) => {
                return (
                  <tr
                    key={index}
                  >
                    <th>{goal.weekAlias}</th>
                    <td>
                      <input
                        type="text"
                        value={goal.percentage}
                        onChange={(event) => {handleUpdateAliasPercentage(goal.weekAlias, event)}}
                      />
                    </td>
                  </tr>
                );
              })
            }
            </tbody>
          </table>
        </section>
        <footer className="modal-card-foot">
          <button
            className="button is-success"
            onClick={handleOnClickOkButton}
          >
            Continuar
          </button>
          <button
            className="button"
            onClick={handleOnClickCloseButton}
          >
            Cancelar
          </button>
          <div>
            {
              !!state.errorMessage &&
              <span style={{color: "darkred"}}>{state.errorMessage}</span>
            }
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ModalPercentages;
