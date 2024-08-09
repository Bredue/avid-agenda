import React, { FC, useState } from "react";
import styles from '../../styles/App.module.css';
import ClassList from "./ClassList";
import ClassAddButton from "./ClassAddButton";
import AddClassForm from "./AddClassForm";
import SidebarMenu from "./SidebarMenu";
import Class from "../../models/class";

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
  } = props;

  const [addClassFormStatus, setAddClassFormStatus] = useState(false);
  const [sidebarMenuStatus, setSidebarMenuStatus] = useState('class');
  const [selectedClass, setSelectedClass] = useState('');

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
            <SidebarMenu />
          ) : (
            <></>
          )}
          {sidebarMenuStatus === 'class' ? (
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
          {sidebarMenuStatus === 'task' ? (
            <>
              
            </>
          ) : (
            <></>
          )}
          {sidebarMenuStatus === 'event' ? (
            <>
             
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