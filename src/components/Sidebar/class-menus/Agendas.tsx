import React, { FC, useEffect, useState } from "react";
import Class from "../../../models/class";
import uniqid from 'uniqid';
import styles from '../../../styles/App.module.css';
import closeSvg from '../../../assets/close.svg';
import Agenda from "../../../models/agenda";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import toast from "react-hot-toast";

interface AgendasProps {
    classes: Class[],
    selectedClass: string,
    addAgenda: (newAgenda: Agenda) => void,
};

const Agendas: FC<AgendasProps> = (props) => {

    const { classes, selectedClass, addAgenda } = props;

    const [assignedClasses, setAssignedClasses] = useState<string[]>([]);
    const [date, setDate] = useState(new Date);
    const [tasks, setTasks] = useState<{ id: string; task: string; duration: string }[]>([]);
    const [durations, setDurations] = useState<string[]>([]);
    const [why, setWhy] = useState('');
    const [essentialQuestion, setEssentialQuestion] = useState('');
    const [homework, setHomework] = useState('');

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

    const handleDateSelect = (date: Date | null) => {
        if (date !== null) {
            setDate(date);
        }
    };

    const doesDateAlreadyHaveAgenda = (date: Date) => {
        const agendaDates: Date[] = [];

        classes.forEach((cls: Class) => {
            cls.agendas.forEach((agenda: Agenda) => {
                const dateConversion = new Date(agenda.date);
                agendaDates.push(dateConversion);
            });
        });

        return agendaDates.some(agendaDate =>
            date.getDate() === agendaDate.getDate() &&
            date.getMonth() === agendaDate.getMonth() &&
            date.getFullYear() === agendaDate.getFullYear()
          );
    };

    const handleWhyChange = (value: string) => {
        setWhy(value);
    };

    const handleEQChange = (value: string) => {
        setEssentialQuestion(value);
    };

    const handleHomeworkChange = (value: string) => {
        setHomework(value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (assignedClasses.length === 0) {
            toast.error('You must have an assigned class to submit an agenda', {'id': 'agenda-submit'});
            return;
        }
        saveAgendaToLocalStorage();
    };

    const saveAgendaToLocalStorage = () => {
        const agenda = new Agenda(assignedClasses, date.toString(), tasks);

        assignedClasses.forEach((assignedClass) => {
            const cls = localStorage.getItem(`class-${assignedClass}`);
            if (cls) {
                const parsedData = JSON.parse(cls);
                const convertedObject = Class.fromPlainObject(parsedData);
                convertedObject.agendas.push(agenda);
                const serializedData = JSON.stringify(convertedObject.toPlainObject());
                localStorage.setItem(`class-${assignedClass}`, serializedData);
                toast.success('Agenda Created!', {'id': 'new-agenda'});
            };
        });

        addAgenda(agenda);
    };

    return (
        <form className={styles.agendaForm} onSubmit={handleSubmit}>
            <div className={styles.agendaFormGroup}>
                <label 
                    className={styles.agendaFormLabel}
                    htmlFor="classes"
                >
                    *Assigned Classes
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
                <DatePicker
                    selected={date}
                    onChange={(date) => handleDateSelect(date)}
                    filterDate={(date) => !doesDateAlreadyHaveAgenda(date)}
                    placeholderText="Select a date"
                />
            </div>

            <div className={styles.agendaFormGroup}>
                <label 
                    className={styles.agendaFormLabel} 
                    htmlFor="EQ"
                >
                    Essential Question
                </label>
                <input 
                    className={styles.agendaFormTaskInput} 
                    type="text" 
                    value={essentialQuestion} 
                    onChange={(e) => handleEQChange(e.target.value)}>
                </input>
            </div>

            <div className={styles.agendaFormGroup}>
                <label 
                    className={styles.agendaFormLabel} 
                    htmlFor="HW"
                >
                    Homework
                </label>
                <input 
                    className={styles.agendaFormTaskInput} 
                    type="text" 
                    value={homework} 
                    onChange={(e) => handleHomeworkChange(e.target.value)}>
                </input>
            </div>

            <div className={styles.agendaFormGroup}>
                <label 
                    className={styles.agendaFormLabel} 
                    htmlFor="why"
                >
                    The Why
                </label>
                <input 
                    className={styles.agendaFormTaskInput} 
                    type="text" 
                    value={why} 
                    onChange={(e) => handleWhyChange(e.target.value)}>
                </input>
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
