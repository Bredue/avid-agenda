import { FC } from 'react';
import styles from '../../styles/App.module.css';
import Class from '../../models/class';
import AgendaPresentation from './AgendaPresentation';

interface SingePageAppProps {
  cls: Class | undefined,
  handleAgendaViewingStatus: (status: boolean) => void,
  viewingAgenda: boolean,
  removeAgenda: (agendaId: string) => void,
  handleAgendaEditRequest: (agendaId: string, classes: string[]) => void,
}

const SingePageApp: FC<SingePageAppProps> = (props) => {

  const { 
    cls,
    handleAgendaViewingStatus,
    viewingAgenda,
    removeAgenda,
    handleAgendaEditRequest,
  } = props;

  return (
    <main className={styles.appContainer}>
      {cls !== undefined ? (
        <AgendaPresentation 
          agendas={cls.agendas}
          handleAgendaViewingStatus={handleAgendaViewingStatus}
          viewingAgenda={viewingAgenda}
          removeAgenda={removeAgenda}
          handleAgendaEditRequest={handleAgendaEditRequest}
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