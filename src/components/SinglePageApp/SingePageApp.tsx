import React, { FC } from 'react';
import styles from '../../styles/App.module.css';
import Class from '../../models/class';
import AgendaPresentation from './AgendaPresentation';

interface SingePageAppProps {
  cls: Class | undefined,
  handleAgendaViewingStatus: (status: boolean) => void,
  viewingAgenda: boolean,
}

const SingePageApp: FC<SingePageAppProps> = (props) => {

  const { 
    cls,
    handleAgendaViewingStatus,
    viewingAgenda,
  } = props;

  return (
    <main className={styles.appContainer}>
      {cls !== undefined ? (
        <AgendaPresentation 
          agendas={cls.agendas}
          handleAgendaViewingStatus={handleAgendaViewingStatus}
          viewingAgenda={viewingAgenda}
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