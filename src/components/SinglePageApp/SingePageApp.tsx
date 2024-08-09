import React, { FC } from 'react';
import styles from '../../styles/App.module.css';
import Class from '../../models/class';

interface SingePageAppProps {
  classes: Class[],
  tasks: string[],
  events: string[],
}

const SingePageApp: FC<SingePageAppProps> = (props) => {

  const { 
    classes,
    tasks,
    events,
  } = props;

  return (
    <main className={styles.appContainer}>
      {classes.length > 0 ? (
        <p>Single Page App</p>
      ) : (
        <p>
          No Classes Added, create one to start your agenda
        </p>
      )}
    </main>
  )
};

export default SingePageApp;