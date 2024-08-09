import React, { FC, useState } from "react";
import styles from '../../styles/App.module.css';
import ClassList from "./ClassList";
import ClassAddButton from "./ClassAddButton";
import AddClassForm from "./AddClassForm";
import SidebarMenu from "./SidebarMenu";
import Class from "../../models/class";
import Agendas from "./class-menus/Agendas";
import Events from "./class-menus/Events";

interface SidebarProps {
  changeSidebarStatus: () => void,
  sidebarStatus: boolean,
  classes: Class[],
  addClass: (newClass: Class) => void,
  selectActiveClass: (selectedClass: string) => void,
  selectedClass: string,
};

const Sidebar:FC<SidebarProps> = (props) => {

  const { 
    changeSidebarStatus, 
    sidebarStatus,
    classes,
    addClass,
    selectActiveClass,
    selectedClass,
  } = props;

  const [addClassFormStatus, setAddClassFormStatus] = useState(false);
  const [sidebarMenuStatus, setSidebarMenuStatus] = useState('classes');

  const changeAddClassFromStatus = () => {
    setAddClassFormStatus(!addClassFormStatus);
  };

  const verifyUserOffClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id === 'sidebar-container-background') changeSidebarStatus();
  };

  const changeSidebarMenuStatus = (requestedMenu: string) => {
    setSidebarMenuStatus(requestedMenu);
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
            <SidebarMenu 
              sidebarMenuStatus={sidebarMenuStatus}
              changeSidebarMenuStatus={changeSidebarMenuStatus}
            />
          ) : (
            <p className={styles.sidebarSelectAClassText}>Select a class to add agenda items and events</p>
          )}
          {sidebarMenuStatus === 'classes' ? (
            <>
              <ClassList 
                classes={classes}
                selectActiveClass={selectActiveClass}
                selectedClass={selectedClass}
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