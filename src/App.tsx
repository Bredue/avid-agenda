import './styles/App.module.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import SingePageApp from './components/SinglePageApp/SingePageApp';
import Class from './models/class';
import Event from './models/event';

function App() {

  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    mountClasses();
    verifyNewUser();
  }, []);

  const mountClasses = () => {
    const keys = Object.keys(localStorage);
    const classes = iterateLocalStorage(keys);
    setClasses(classes);
  };

  const iterateLocalStorage = (keys: string[]) => {
    const results: any[] = [];

    keys.forEach((key: string) => {
      if (key.split('-')[0] === 'class') {
        const value = localStorage.getItem(key)
        if (value && value.length > 0) {
          const parsedData = JSON.parse(value);
          const convertToObject = handleObjectRecreation(parsedData);
          results.push(convertToObject);
        };
      };
    });

    return results;
  };

  const handleObjectRecreation = (parsedData: any) => {
    return Class.fromPlainObject(parsedData);
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

  const selectActiveClass = (id: string) => {
    if (classes.length > 0) {
      classes.forEach((cls: Class) => {
        if (cls.getId() === id) {
          if (cls.getId() === selectedClass) {
            setSelectedClass('');
            return;
          };
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
        selectedClass={selectedClass}
        classes={classes}
      />
      <Footer />
    </>
  )
}

export default App
