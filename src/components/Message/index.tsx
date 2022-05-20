import React from 'react';

import styles from './styles.module.css';

type MessageProps = {
  isError: boolean,
  text: string,
}

const Message = (props: MessageProps) => {
  return (
    <div className={styles.messageContainer}>
      <span className={props.isError ? styles.errorMessage : styles.successMessage}>
        {props.text}
      </span>
    </div>
  );
}

export default Message;
