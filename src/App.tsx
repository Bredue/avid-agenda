import './styles/App.module.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import SingePageApp from './components/SinglePageApp/SingePageApp';
import Class from './models/class';
import Agenda from './models/agenda';

function App() {

  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState<Class[]>([]);
  const [viewingAgenda, setViewingAgenda] = useState(false);
  const [agendaEditRequest, setAgendaEditRequest] = useState<{status: boolean, id: string, classes: string[]}>({
    status: false,
    id: '',
    classes: [],
  });

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

  const addAgenda = (newAgenda: Agenda) => {
    const classesUpdated: Class[] = [];
    classes.forEach((cls) => {
      if (newAgenda.assignedClasses.includes(cls.id)) {
        cls.agendas.push(newAgenda);
      };
      classesUpdated.push(cls);
    });
    setClasses(classesUpdated);
  };

  const editAgenda = (newAgenda: Agenda) => {
    mountClasses(); // workaround, will fix later
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
    handleAgendaViewingStatus(false);
  };

  const handleAgendaViewingStatus = (status: boolean) => {
    setViewingAgenda(status);
  }

  const removeClass = (id: string) => {
    setClasses((prevClasses) => {
      return prevClasses.filter(cls => cls.id !== id);
    });
  };

  const editClass = (editedClass: Class) => {
    const updatedClass = classes.map((cls => cls.id === editedClass.id ? editedClass : cls));
    setClasses(updatedClass);
  };

  const removeAgenda = (agendaId: string) => {
    const updatedClasses: any = classes.map((cls) => {
      return {
        ...cls,
        agendas: cls.agendas.filter((agenda) => agenda.id !== agendaId),
      };
    });
  
    setClasses(updatedClasses);
  };

  const handleAgendaEditRequest = (agendaId: string, classes: string[]) => {
    setSidebarStatus(true);
    setAgendaEditRequest({
      status: true,
      id: agendaId,
      classes: classes,
    });
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
        addAgenda={addAgenda}
        viewingAgenda={viewingAgenda}
        handleAgendaViewingStatus={handleAgendaViewingStatus}
        removeClass={removeClass}
        editClass={editClass}
        agendaEditRequest={agendaEditRequest}
        editAgenda={editAgenda}
      /> 
      <SingePageApp 
        cls={classes.find((cls) => cls.id === selectedClass)}
        handleAgendaViewingStatus={handleAgendaViewingStatus}
        viewingAgenda={viewingAgenda}
        removeAgenda={removeAgenda}
        handleAgendaEditRequest={handleAgendaEditRequest}
      />
      <Footer />
    </>
  )
}

export default App
