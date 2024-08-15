import React, { FC, useState } from "react";
import styles from '../../styles/App.module.css';
import ClassList from "./ClassList";
import ClassAddButton from "./ClassAddButton";
import AddClassForm from "./AddClassForm";
import SidebarMenu from "./SidebarMenu";
import Class from "../../models/class";
import Agendas from "./class-menus/Agendas";
import Events from "./class-menus/Events";
import Agenda from "../../models/agenda";

interface SidebarProps {
  changeSidebarStatus: () => void,
  sidebarStatus: boolean,
  classes: Class[],
  addClass: (newClass: Class) => void,
  selectActiveClass: (selectedClass: string) => void,
  selectedClass: string,
  addAgenda: (newAgenda: Agenda) => void,
  viewingAgenda: boolean,
  handleAgendaViewingStatus: (status: boolean) => void,
  removeClass: (id: string) => void,
  editClass: (editedClass: Class) => void,
};

const Sidebar:FC<SidebarProps> = (props) => {

  const { 
    changeSidebarStatus, 
    sidebarStatus,
    classes,
    addClass,
    selectActiveClass,
    selectedClass,
    addAgenda,
    viewingAgenda,
    handleAgendaViewingStatus,
    removeClass,
    editClass,
  } = props;

  const [addClassFormStatus, setAddClassFormStatus] = useState(false);
  const [sidebarMenuStatus, setSidebarMenuStatus] = useState('classes');
  const [classEditRequest, setClassEditRequest] = useState({
    request: false,
    id: '',
  });

  const changeAddClassFromStatus = () => {
    setAddClassFormStatus(!addClassFormStatus);
  };

  const verifyUserOffClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id === 'sidebar-container-background') {
      changeSidebarStatus();
      changeSidebarMenuStatus('classes');
    }
  };

  const changeSidebarMenuStatus = (requestedMenu: string) => {
    setSidebarMenuStatus(requestedMenu);
  };

  const handleCloseOpenAgenda = () => {
    handleAgendaViewingStatus(false);
  };

  const openEditClassForm = (id: string) => {
    setClassEditRequest({
      request: true,
      id: id,
    });
    setAddClassFormStatus(true);
  };

  return (
    sidebarStatus === false ? (
      <></>
    ) : (
      <div 
        onClick={(e) => verifyUserOffClick(e)}
        className={styles.sidebarContainerBackground}
        id="sidebar-container-background"
      >
        <div className={styles.sidebarContainer}>
          {classes.length > 0 && selectedClass.length > 0 ? (
            <>
              <SidebarMenu 
                sidebarMenuStatus={sidebarMenuStatus}
                changeSidebarMenuStatus={changeSidebarMenuStatus}
              />
              {viewingAgenda === true && sidebarMenuStatus === 'classes' ? (
                <button
                  onClick={handleCloseOpenAgenda}
                  style={{
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    position: 'absolute',
                    top: '8vh',
                    width: '80%',
                    height: '5vh',
                  }}
                >
                  Close Current Agenda
                </button>
              ) : null}
            </>
          ) : (
            <p className={styles.sidebarSelectAClassText}>Select a class to add agenda items and events</p>
          )}
          {sidebarMenuStatus === 'classes' ? (
            <>
              <ClassList 
                classes={classes}
                selectActiveClass={selectActiveClass}
                selectedClass={selectedClass}
                removeClass={removeClass}
                openEditClassForm={openEditClassForm}
              />
              <ClassAddButton
                changeAddClassFromStatus={changeAddClassFromStatus}
              />
            </>
          ) : (
            <></>
          )}
          {sidebarMenuStatus === 'agendas' ? (
            <>
              <Agendas 
                classes={classes}
                selectedClass={selectedClass}
                addAgenda={addAgenda}
              />
            </>
          ) : (
            <></>
          )}
          {sidebarMenuStatus === 'events' ? (
            <>
              <Events />
            </>
          ) : (
            <></>
          )}
          {addClassFormStatus === true ? (
            <AddClassForm 
              changeAddClassFromStatus={changeAddClassFromStatus}
              addClass={addClass}
              classEditRequest={classEditRequest}
              editClass={editClass}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    )
  );
};

export default Sidebar;