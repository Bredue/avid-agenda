import React, { FC } from 'react';
import styles from '../../styles/App.module.css';
import Class from '../../models/class';
import AgendaPresentation from './Agenda';

interface SingePageAppProps {
  cls: Class | undefined,
}

const SingePageApp: FC<SingePageAppProps> = (props) => {

  const { 
    cls
  } = props;

  return (
    <main className={styles.appContainer}>
      {cls !== undefined ? (
        <AgendaPresentation 
          agendas={cls.agendas}
        />
      ) : (
        <p>
          No classes selected or agendas present, please create one
        </p>
      )}
    </main>
  )
};

export default SingePageApp;