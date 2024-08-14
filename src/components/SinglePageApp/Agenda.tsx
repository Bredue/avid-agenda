import React, { FC, useState } from "react";
import styles from '../../styles/App.module.css';
import Agenda from "../../models/agenda";

interface AgendaProps {
  agendas: Agenda[];
}

interface simpleDateObject {
  date: Date,
  agendaId: string,
}

interface formattedDateObject {
  date: string,
  agendaId: string,
}

const AgendaPresentation:FC<AgendaProps> = (props) => {

  const { agendas } = props;

  const [selectedAgenda, setSelectedAgenda] = useState<Agenda | object>({});

  const getAgendaDates = () => {
    const justDates: simpleDateObject[] = [];

    agendas.forEach((agenda) => {
      const date = new Date(agenda.date);
      date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const simpleDateObject: simpleDateObject = {
        date: date,
        agendaId: agenda.id,
      }
      justDates.push(simpleDateObject);
    });

    return handleDateSort(justDates);
  };

  const handleDateSort = (justDates: simpleDateObject[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredDates = justDates
      .filter(date => date.date >= today) // Filter out dates before today
      .sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort dates with the earliest first

    const reformatedDates: formattedDateObject[] = [];

    filteredDates.forEach((filteredDate) => {
      const formatDate = {
        date: filteredDate.date.toDateString(),
        agendaId: filteredDate.agendaId,
      };
      reformatedDates.push(formatDate);
    });

    return reformatedDates;
  };

  const handleAgendaSelection = (agendaId: string) => {
    const selectedAgenda = agendas.find((agenda) => agenda.id === agendaId);

    if (selectedAgenda === undefined) {
      return;
    } else {
      setSelectedAgenda(selectedAgenda);
    };
  };

  if (Object.keys(selectedAgenda).length === 0) {
    return (
      <div className={styles.agendaOptionsContainer}>
        <h2 className={styles.agendaOptionsHeaderText}>Select an agenda</h2>
        {getAgendaDates().map((agenda) => (
          <p 
            className={styles.agendaOptionText}
            key={agenda.agendaId}
            onClick={() => handleAgendaSelection(agenda.agendaId)}
          >
            {agenda.date}
          </p>
        ))}
      </div>
    );
  } else if (Object.keys(selectedAgenda).length > 0) {
    return (
      <div className={styles.agendaPresentation}>

        <div className={styles.agendaImportInfoContainer}>
          <header className={styles.agendaPresentationHeader}>
            <h2 className={styles.agendaPresentationEssentialQuestion}>EQ: {(selectedAgenda as Agenda).essentialQuestion}</h2>
            <h2 className={styles.agendaPresentationHomework}>HW: {(selectedAgenda as Agenda).homework}</h2>
            <p className={styles.agendaPresentationWhy}><strong>Why:</strong> {(selectedAgenda as Agenda).why}</p>
          </header>
          <div className={styles.agendaPresentationSvgContainer}>
            <h2 className={styles.agendaPresentationHeaderText}>Required Items</h2>
            <div className={styles.agendaPresentationSvgIcons}>
              {(selectedAgenda as Agenda).selectedSvgs.map((svg) => (
                <img
                  key={svg.id}
                  src={svg.svg}
                  alt={svg.alt}
                  className={styles.agendaPresentationSvgIcon}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.agendaPresentationTasks}>
          <h3 className={styles.agendaPresentationTasksHeader}>Agenda:</h3>
          <ul className={styles.agendaPresentationTasksList}>
            {(selectedAgenda as Agenda).tasks.map((task, index) => (
              <li key={index} className={styles.agendaPresentationTaskItem}>
                <p>{task.task}</p>
                <p>{task.duration}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <p>Something went terribly wrong</p>
    )
  }
};

export default AgendaPresentation;