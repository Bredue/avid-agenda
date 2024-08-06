import './styles/App.module.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Agenda from './components/Agenda/Agenda';
import Footer from './components/Footer/Footer';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

function App() {

  const [sidebarStatus, setSidebarStatus] = useState(false);

  const changeSidebarStatus = () => {
    setSidebarStatus(!sidebarStatus);
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
      /> 
      <Agenda />
      <Footer />
    </>
  )
}

export default App
