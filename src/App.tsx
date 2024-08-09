import './styles/App.module.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Agenda from './components/SinglePageApp/SingePageApp';
import Footer from './components/Footer/Footer';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import SingePageApp from './components/SinglePageApp/SingePageApp';
import Class from './models/class';
import Task from './models/task';
import Event from './models/event';

function App() {

  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState<Class[]>([]);
  const [tasks, setTasks] = useState<string[]>([]);
  const [events, setEvents] = useState<string[]>([]);

  // mount classes and tasks to app
  useEffect(() => {
    mountClasses();
    mountTasks();
    mountEvents();
    verifyNewUser();
  }, []);

  const mountClasses = () => {
    const keys = Object.keys(localStorage);
    const classes = iterateLocalStorage('class', keys);
    setClasses(classes);
  };

  const mountTasks = () => {
    const keys = Object.keys(localStorage);
    const tasks = iterateLocalStorage('task', keys);
    setTasks(tasks);
  };

  const mountEvents = () => {
    const keys = Object.keys(localStorage);
    const events = iterateLocalStorage('event', keys);
    setEvents(events);
  };

  const iterateLocalStorage = (searchParam: string, keys: string[]) => {
    const results: any[] = [];

    keys.forEach((key: string) => {
      if (key.split('-')[0] === searchParam) {
        const value = localStorage.getItem(key)
        if (value && value.length > 0) {
          const parsedData = JSON.parse(value);
          const convertToObject = handleObjectRecreation(parsedData, searchParam);
          results.push(convertToObject);
        };
      };
    });

    return results;
  };

  const handleObjectRecreation = (parsedData: any, searchParam: string) => {
    if (searchParam === 'class') {
      return Class.fromPlainObject(parsedData);
    };

    if (searchParam === 'event') {
      return Event.fromPlainObject(parsedData);
    };

    if (searchParam === 'task') {
      return Task.fromPlainObject(parsedData);
    };
  };

  const changeSidebarStatus = () => {
    setSidebarStatus(!sidebarStatus);
  };
  
  const addClass = (newClass: Class) => {
    setClasses([...classes, newClass]);
  };

  const verifyNewUser = () => {
    if (classes.length === 0) {
      setTimeout(() => {
        setSidebarStatus(true);
      }, 1000);
    };
  };

  const selectActiveClass = (selectedClass: string) => {
    if (classes.length > 0) {
      classes.forEach((cls: Class) => {
        if (cls.getClassName() === selectedClass) {
          setSelectedClass(cls.id);
        }
      });
    };
  };

  return (
    <>
      <Toaster />
      <Header 
        changeSidebarStatus={changeSidebarStatus} 
      />
      <Sidebar 
        changeSidebarStatus={changeSidebarStatus}
        sidebarStatus={sidebarStatus} 
        classes={classes}
        addClass={addClass}
        selectActiveClass={selectActiveClass}
        selectedClass={selectedClass}
      /> 
      <SingePageApp 
        classes={classes}
        tasks={tasks}
        events={events}
      />
      <Footer />
    </>
  )
}

export default App
