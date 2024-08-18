import React, { FC, useEffect, useState } from "react";
import Class from "../../../models/class";
import uniqid from 'uniqid';
import styles from '../../../styles/App.module.css';
import closeSvg from '../../../assets/close.svg';
import Agenda from "../../../models/agenda";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import toast from "react-hot-toast";
import clipboardSvg from '../../../assets/supplies/clipboard-outline.svg';
import headphonesSvg from '../../../assets/supplies/headphones.svg';
import laptopSvg from '../../../assets/supplies/laptop.svg';
import markerSvg from '../../../assets/supplies/marker.svg';
import notebookSvg from '../../../assets/supplies/notebook.svg';
import notesSvg from '../../../assets/supplies/notes.svg';
import penSvg from '../../../assets/supplies/pen.svg';
import pencilSvg from '../../../assets/supplies/pencil.svg';
import scissorsSvg from '../../../assets/supplies/scissors.svg';

interface AgendasProps {
    classes: Class[],
    addAgenda: (newAgenda: Agenda) => void,
    agendaEditRequest: {
        status: boolean,
        id: string,
        classes: string[],
    },
    editAgenda: () => void,
};

interface SVGOption {
    id: string;
    svg: string;
    alt: string;
  }

const Agendas: FC<AgendasProps> = (props) => {

    const { 
        classes, 
        addAgenda,
        agendaEditRequest,
        editAgenda,
    } = props;

    const svgOptions: SVGOption[] = [
        { id: 'clipboard', svg: clipboardSvg, alt: 'Clipboard' },
        { id: 'headphones', svg: headphonesSvg, alt: 'Headphones' },
        { id: 'laptop', svg: laptopSvg, alt: 'Laptop' },
        { id: 'marker', svg: markerSvg, alt: 'Marker' },
        { id: 'notebook', svg: notebookSvg, alt: 'Notebook' },
        { id: 'notes', svg: notesSvg, alt: 'Notes' },
        { id: 'pen', svg: penSvg, alt: 'Pen' },
        { id: 'pencil', svg: pencilSvg, alt: 'Pencil' },
        { id: 'scissors', svg: scissorsSvg, alt: 'Scissors' },
    ];

    const [assignedClasses, setAssignedClasses] = useState<string[]>([]);
    const [date, setDate] = useState<Date | undefined>();
    const [tasks, setTasks] = useState<{ id: string; task: string; duration: string }[]>([]);
    const [durations, setDurations] = useState<string[]>([]);
    const [why, setWhy] = useState('');
    const [essentialQuestion, setEssentialQuestion] = useState('');
    const [homework, setHomework] = useState('');
    const [selectedSvgs, setSelectedSvgs] = useState<string[]>([]);

    useEffect(() => {
        compileTaskDurations();
    }, []);

    useEffect(() => {
        if (agendaEditRequest.status === true) {
            loadAgendaDataForEdit();
        };
    }, [agendaEditRequest]);

    const compileTaskDurations = () => {
        const durations: string[] = [];
        durations.push('-');
        for (let i = 1; i <= 60; i += 1) {
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

    const handleSvgChange = (e: React.MouseEvent<HTMLSelectElement>) => {
        const selectedOption = (e.target as any).value;

        setSelectedSvgs((prevState) => {
            const index = prevState.indexOf(selectedOption);
            if (index !== -1) {
                return [...prevState.slice(0, index), ...prevState.slice(index + 1)];
            } else {
                return [...prevState, selectedOption];
            }
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        removeEmptyTasks();

        if (assignedClasses.length === 0) {
            toast.error('You must have an assigned class to submit an agenda', {'id': 'agenda-submit'});
            return;
        }

        if (agendaEditRequest.status === true) {
            handleAgendaEditSubmit();
            return;
        };

        saveAgendaToLocalStorage();
    };

    const removeEmptyTasks = () => {
        setTasks((prevTasks) => {
            return prevTasks.filter(task => task.task.length !== 0);
        });
    };

    const compileSvgData = () => {
        const compiledSvgs: SVGOption[] = [];

        selectedSvgs.forEach((svg) => {
            const matchStatus = svgOptions.find((option => option.id === svg.toLowerCase()));
            if (matchStatus !== undefined) {
                compiledSvgs.push(matchStatus);
            };
        });

        return compiledSvgs;
    };

    const saveAgendaToLocalStorage = () => {
        if (date === undefined) return;

        const agenda = new Agenda(
            assignedClasses, 
            date.toString(), 
            tasks.filter(task => task.task.length !== 0), // remove empty tasks before storing in case state update lags
            why,
            essentialQuestion,
            homework,
            compileSvgData(),
        );

        assignedClasses.forEach((assignedClass) => {
            const cls = localStorage.getItem(`class-${assignedClass}`);
            if (cls) {
                const parsedData = JSON.parse(cls);
                const convertedObject = Class.fromPlainObject(parsedData);
                convertedObject.agendas.push(agenda);
                const serializedData = JSON.stringify(convertedObject.toPlainObject());
                localStorage.setItem(`class-${assignedClass}`, serializedData);
            };
        });

        toast.success('Agenda Created!', {'id': 'new-agenda'});
        addAgenda(agenda);
    };

    const handleAgendaEditSubmit = () => {
        if (date === undefined) return;

        const agenda = new Agenda(
            assignedClasses, 
            date.toString(), 
            tasks.filter(task => task.task.length !== 0), // remove empty tasks before storing in case state update lags
            why,
            essentialQuestion,
            homework,
            compileSvgData(),
        );

        assignedClasses.forEach((assignedClass) => {
            const cls = localStorage.getItem(`class-${assignedClass}`);
            if (cls) {
                const parsedData = JSON.parse(cls);
                const convertedObject = Class.fromPlainObject(parsedData);
                
                convertedObject.agendas = convertedObject.agendas.map(oldAgenda =>
                    oldAgenda.id !== agendaEditRequest.id ? oldAgenda : agenda
                );

                const serializedData = JSON.stringify(convertedObject.toPlainObject());
                localStorage.setItem(`class-${assignedClass}`, serializedData);
            };
        });

        toast.success('Agenda Edited!', {'id': 'edited-agenda'});
        editAgenda();
    };

    const loadAgendaDataForEdit = () => {
        if (agendaEditRequest.classes.length === 0) return;
        const cls = localStorage.getItem(`class-${agendaEditRequest.classes[0]}`);
        if (cls) {
            const parsedData = JSON.parse(cls);
            const convertedData = Class.fromPlainObject(parsedData);
            const agenda = convertedData.agendas.find((agenda => agenda.id === agendaEditRequest.id));
            if (agenda) {
                setAssignedClasses(agenda.assignedClasses);
                setDate(new Date(agenda.date));
                setEssentialQuestion(agenda.essentialQuestion);
                setHomework(agenda.homework)
                setTasks(agenda.tasks);
                setWhy(agenda.why);

                const selectedSvgs: string[] = [];
                agenda.selectedSvgs.forEach((svg) => {
                    selectedSvgs.push(svg.id);
                });
                setSelectedSvgs(selectedSvgs);
            };
        };
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
                    className={styles.agendaFormCalendarDatePicker}
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

            <div className={styles.agendaFormRequiredItemsFormGroup}>
                <label 
                    htmlFor="necessaryItems"
                    className={styles.agendaFormLabel}
                >
                    What items are required?
                </label>
                <select 
                    id="necessaryItems" 
                    multiple 
                    onChange={() => {return}}
                    onClick={(e) => handleSvgChange(e)}
                    value={selectedSvgs}
                    className={styles.agendaFormSelectContainer}
                >
                    {svgOptions.map(option => (
                    <option 
                        key={option.id} 
                        value={option.id}
                        className={styles.agendaFormSelectOption}
                    >
                        {option.alt}
                    </option>
                    ))}
                </select>
                <div className={styles.selectedSvgContainer}>
                    {svgOptions
                        .filter(option => selectedSvgs.includes(option.id))
                        .map(option => (
                            <img
                                key={option.id}
                                src={option.svg}
                                alt={option.alt}
                                className={styles.agendaFormSelectedSvg}
                            />
                    ))}
                </div>
            </div>

            <button 
                className={styles.agendaFormSubmitButton} 
                type="submit">
                    {agendaEditRequest.status === true ? 'Submit Edit' : 'Submit'}
            </button>
        </form>
    );
};

export default Agendas;
