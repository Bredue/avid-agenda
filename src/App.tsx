import './styles/App.module.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Agenda from './components/Agenda/Agenda';
import Footer from './components/Footer/Footer';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

function App() {

  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [classes, setClasses] = useState<string[]>([]);

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
