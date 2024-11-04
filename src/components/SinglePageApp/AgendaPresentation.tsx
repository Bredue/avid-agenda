import React, { FC, useEffect, useState } from "react";
import styles from '../../styles/App.module.css';
import Agenda from "../../models/agenda";
import playSvg from '../../assets/play.svg';
import CountdownTimer from "./CountdownTimer";
import toast from "react-hot-toast";

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

interface Task { 
  id: string,
  task: string, 
  duration: string,
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
  const [taskHovered, setTaskHovered] = useState('');
  const [taskSelected, setTaskSelected] = useState('');
  const [countdownTimer, setCountdownTimer] = useState<{status: boolean, taskId: string, task: {} | Task}>({
    status: false,
    taskId: '',
    task: {},
  });

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
    const filteredDates = justDates.sort((a, b) => b.date.getTime() - a.date.getTime()); // sort by most recent date first (descending)
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

  const handleMouseEnterTask = (taskId: string) => {
    setTaskHovered(taskId);
  };

  const handleMouseLeaveTask = () => {
    setTaskHovered('');
  };

  const handleTaskSelect = (e: React.MouseEvent, taskId: string) => {
    if ((e.target as any).id === 'play-icon') {
      handleOpenTaskTimer(taskId);
      return;
    };

    if (taskSelected === taskId) {
      setTaskSelected('');
    } else {
      setTaskSelected(taskId);
    };
  };

  const handleOpenTaskTimer = (taskId: string) => {
    let taskToTime: {} | Task = {};

    agendas.forEach((agenda) => {
      agenda.tasks.forEach((task) => {
        if (task.id === taskId) {
          taskToTime = task;
        };
      });
    });

    if (Object.keys(taskToTime).length > 0) {
      if ((taskToTime as Task).duration === '1 Hour +' || (taskToTime as Task).duration === '-') {
        toast.error('cannot start timer with "1 Hour +" or "-" duration on task', {'id': 'open-timer-error'});
        return;
      };
  
      if (taskToTime) {
        setCountdownTimer({
          status: true,
          taskId: taskId,
          task: taskToTime,
        });
      };
    }
  };

  const closeCountdownTimer = () => {
    setCountdownTimer({
      status: false,
      taskId: '',
      task: [],
    });
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
              <li 
                key={index} 
                className={`${styles.agendaPresentationTaskItem} ${taskSelected === task.id ? styles.agendaPresentationTaskItemSelected : ''} ${taskHovered === task.id ? styles.agendaPresentationTaskItemHover : ''}`}
                onMouseEnter={() => handleMouseEnterTask(task.id)}
                onMouseLeave={() => handleMouseLeaveTask()}
                onClick={(e) => handleTaskSelect(e, task.id)}
              >
                <p>{task.task}</p>
                {taskSelected === task.id ? (
                  <img 
                    id="play-icon"
                    src={playSvg} 
                    alt="play icon" 
                    className={styles.agendaPresentationPlaySvg}>
                  </img>
                ) : (
                  <></>
                )}
                <p>{task.duration}</p>
              </li>
            ))}
          </ul>

          {countdownTimer.status === true ? (
            <CountdownTimer 
              task={countdownTimer.task}
              closeCountdownTimer={closeCountdownTimer}
            />
          ) : (
            <></>
          )}

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