import React, {useState, useEffect} from 'react';

type ModalMessagesProps = {
  title: string,
  text: string,
  isOpen: boolean,
  okButtonDisplayed?: boolean,
  okButtonText?: string,
  okButtonCallback?: any,
  okButtonClassNames?: string,
  cancelButtonDisplayed?: boolean,
  cancelButtonText?: string,
  cancelButtonClassNames?: string,
  handleOnCloseModal?: any,
}

interface ModalMessagesState {
  isOpen: false,
}

const INITIAL_STATE: ModalMessagesState = {
  isOpen: false,
}

const ModalMessages = (props: ModalMessagesProps) => {
  const [state, setState] = useState({...INITIAL_STATE, ...{isOpen: props.isOpen}});

  const handleOnClickOkButton = (event: any) => {
    event.preventDefault();
    if (!!props.okButtonCallback) {
      props.okButtonCallback();
    }
    closeModal();
  }

  const handleOnClickCloseButton = (event: any) => {
    event.preventDefault();
    closeModal();
    props.handleOnCloseModal();
  }

  const closeModal = () => {
    setState({
      ...state,
      isOpen: false
    });
  }

  // To handle open / close modal from parent component
  useEffect(() => {
    setState({
      ...state,
      isOpen: props.isOpen,
    });
  }, [props.isOpen]);

  return (
    <div id="custom-modal" className={`modal ${state.isOpen ? 'is-active' : ''}`}>
      <div className="modal-background"/>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{props.title}</p>
          <button className="delete" aria-label="close" onClick={handleOnClickCloseButton}/>
        </header>
        <section className="modal-card-body">
          <span>{props.text}</span>
        </section>
        <footer className="modal-card-foot">
          {
            props.okButtonDisplayed &&
            <button
              className={`button ${props.okButtonClassNames ?? "is-success"}`}
              onClick={handleOnClickOkButton}
            >
              {props.okButtonText ?? 'Continuar'}
            </button>
          }
          {
            props.cancelButtonDisplayed &&
            <button
              className={`button ${props.cancelButtonClassNames ?? ""}`}
              onClick={handleOnClickCloseButton}
            >
              {props.cancelButtonText ?? 'Cancelar'}
            </button>
          }
        </footer>
      </div>
    </div>
  );
}

export default ModalMessages;
