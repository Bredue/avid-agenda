import React, { FC, useEffect, useState } from "react";
import Class from "../../../models/class";
import uniqid from 'uniqid';
import styles from '../../../styles/App.module.css';
import closeSvg from '../../../assets/close.svg';
import Agenda from "../../../models/agenda";

interface AgendasProps {
    classes: Class[],
};

const Agendas: FC<AgendasProps> = (props) => {

    const { classes } = props;

    const [assignedClasses, setAssignedClasses] = useState<string[]>([]);
    const [date, setDate] = useState('');
    const [tasks, setTasks] = useState<{ id: string; task: string; duration: string }[]>([]);
    const [durations, setDurations] = useState<string[]>([]);

    useEffect(() => {
        compileTaskDurations();
    }, []);

    const compileTaskDurations = () => {
        const durations: string[] = [];
        durations.push('-');
        for (let i = 5; i <= 60; i += 5) {
            durations.push(`${i}min`);
        }
        durations.push('1 Hour +');
        setDurations(durations);
    };

    const handleAddTask = () => {
        setTasks([...tasks, { id: uniqid(), task: '', duration: '5min' }]);
    };

    const handleTaskChange = (id: string, field: string, value: string) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, [field]: value } : task
        ));
    };

    const handleClassToggle = (id: string) => {
        setAssignedClasses(prev =>
            prev.includes(id)
                ? prev.filter(classId => classId !== id)
                : [...prev, id]
        );
    };

    const handleRemoveTaskItem = (taskId: string) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        saveAgendaToLocalStorage();
        console.log({ assignedClasses, date, tasks });
    };

    const saveAgendaToLocalStorage = () => {
        const agenda = new Agenda(assignedClasses, date, tasks);
        
    };

    return (
        <form className={styles.agendaForm} onSubmit={handleSubmit}>
            <div className={styles.agendaFormGroup}>
                <label 
                    className={styles.agendaFormLabel}
                    htmlFor="classes"
                >
                    Assigned Classes
                </label>
                <div className={styles.classList}>
                    {classes.map(cls => (
                        <div
                            key={cls.id}
                            className={`${styles.agendaFormClassItem} ${assignedClasses.includes(cls.id) ? styles.agendaFormClassItemSelected : ''}`}
                            onClick={() => handleClassToggle(cls.id)}
                        >
                            {cls.name}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.agendaFormGroup}>
                <label 
                    className={styles.agendaFormLabel}
                    htmlFor="date"
                >
                    Date
                </label>
                <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div className={styles.agendaFormGroup}>
                <label 
                    className={styles.agendaFormLabel}
                    htmlFor="tasks"
                >
                    Tasks
                </label>
                {tasks.map(task => (
                    <div key={task.id} className={styles.agendaFormTaskRow}>
                        <input
                            className={styles.agendaFormTaskInput}
                            type="text"
                            value={task.task}
                            onChange={(e) => handleTaskChange(task.id, 'task', e.target.value)}
                            placeholder="Task"
                        />
                        <select
                            className={styles.agendaFormSelectDuration}
                            value={task.duration}
                            onChange={(e) => handleTaskChange(task.id, 'duration', e.target.value)}
                        >
                            {durations.map(duration => (
                                <option key={duration} value={duration}>{duration}</option>
                            ))}
                        </select>
                        <img 
                            onClick={() => handleRemoveTaskItem(task.id)}
                            alt="close icon" 
                            src={closeSvg} 
                            className={styles.agendaFormCloseIcon}>
                        </img>
                    </div>
                ))}
                <button 
                    className={styles.agendaFormButton}
                    type="button" 
                    onClick={handleAddTask}
                >
                    +
                </button>
            </div>

            <button className={styles.agendaFormSubmitButton} type="submit">Submit</button>
        </form>
    );
};

export default Agendas;
