import React, { FC, useEffect, useState } from "react";
import styles from '../../styles/App.module.css';
import Agenda from "../../models/agenda";

interface AgendaProps {
  agendas: Agenda[];
  handleAgendaViewingStatus: (status: boolean) => void,
  viewingAgenda: boolean,
  removeAgenda: (agendaId: string) => void,
  handleAgendaEditRequest: (agendaId: string, classes: string[]) => void,
}

interface simpleDateObject {
  date: Date,
  agendaId: string,
  classes: string[],
}

interface formattedDateObject {
  date: string,
  agendaId: string,
  classes: string[],
}

const AgendaPresentation:FC<AgendaProps> = (props) => {

  const { 
    agendas,
    handleAgendaViewingStatus,
    viewingAgenda,
    removeAgenda,
    handleAgendaEditRequest,
  } = props;

  const [selectedAgenda, setSelectedAgenda] = useState<Agenda | object>({});
  const [hoveredAgendaId, setHoveredAgendaId] = useState<string | null>(null);

  useEffect(() => {
    if (viewingAgenda === false) {
      setSelectedAgenda({});
    };
  }, [viewingAgenda]);

  useEffect(() => {
    if (Object.keys(selectedAgenda).length > 0) {
      handleAgendaViewingStatus(true);
    } else {
      handleAgendaViewingStatus(false);
    }
  }, [selectedAgenda]);

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
        classes: agenda.assignedClasses,
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
        classes: filteredDate.classes,
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

  const handleAgendaEdit = (id: string, classes: string[]) => {
    handleAgendaEditRequest(id, classes);
  };

  const handleAgendaDelete = (id: string) => {
    removeAgenda(id);
  };

  if (Object.keys(selectedAgenda).length === 0 && agendas.length === 0) {
    return (
      <div className={styles.agendaOptionsContainer}>
        <p className={styles.agendaOptionsHeaderText}>You have no agendas, create one in the agendas menu</p>
      </div>
    );
  } else if (Object.keys(selectedAgenda).length === 0) {
    return (
      <div className={styles.agendaOptionsContainer}>
        <h2 className={styles.agendaOptionsHeaderText}>Select an agenda</h2>
        {getAgendaDates().map((agenda) => (
          <p 
            className={styles.agendaOptionText}
            key={agenda.agendaId}
            onClick={() => handleAgendaSelection(agenda.agendaId)}
            onMouseOver={() => setHoveredAgendaId(agenda.agendaId)}
            onMouseOut={() => setHoveredAgendaId(null)}
          >
            <span>
              {agenda.date}
            </span>
            {hoveredAgendaId === agenda.agendaId && (
              <div className={styles.AgendaOptionsContainer}>
                <button onClick={(e) => { e.stopPropagation(); handleAgendaEdit(agenda.agendaId, agenda.classes); }}>Edit</button>
                <button onClick={(e) => { e.stopPropagation(); handleAgendaDelete(agenda.agendaId); }}>Delete</button>
              </div>
            )}
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