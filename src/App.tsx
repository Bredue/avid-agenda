import './styles/App.module.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Agenda from './components/Agenda/Agenda';
import Footer from './components/Footer/Footer';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

function App() {

  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [classes, setClasses] = useState<string[]>([]);
  const [tasks, setTasks] = useState<string[]>([]);
  const [events, setEvents] = useState<string[]>([]);

  // mount classes and tasks to app
  useEffect(() => {
    mountClasses();
    mountTasks();
    mountEvents();
    console.log(classes, tasks, events);
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
    const results: string[] = [];

    keys.forEach((key: string) => {
      if (key.split('-')[0] === searchParam) {
        const value = localStorage.getItem(key)
        if (value && value.length > 0) {
          results.push(value);
        };
      };
    });

    return results;
  };

  const changeSidebarStatus = () => {
    setSidebarStatus(!sidebarStatus);
  };
  
  const addClass = (newClass: string) => {
    setClasses([...classes, newClass]);
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
      /> 
      <Agenda />
      <Footer />
    </>
  )
}

export default App
