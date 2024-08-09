import React, { FC } from 'react';
import styles from '../../styles/App.module.css';
import Class from '../../models/class';

interface SingePageAppProps {
  selectedClass: string,
  classes: Class[],
}

const SingePageApp: FC<SingePageAppProps> = (props) => {

  const { 
    selectedClass,
    classes,
  } = props;

  return (
    <main className={styles.appContainer}>
      {classes.length > 0 && selectedClass.length > 0 ? (
        <p>Single Page App</p>
      ) : (
        <p>
          No classes selected or agendas present, please create one
        </p>
      )}
    </main>
  )
};

export default SingePageApp;