import React, { FC, useState } from "react";
import styles from '../../styles/App.module.css';
import ClassList from "./ClassList";
import ClassAddButton from "./ClassAddButton";
import AddClassForm from "./AddClassForm";

interface SidebarProps {
  changeSidebarStatus: () => void,
  sidebarStatus: boolean,
  classes: string[],
  addClass: (newClass: string) => void,
};

const Sidebar:FC<SidebarProps> = (props) => {

  const { 
    changeSidebarStatus, 
    sidebarStatus,
    classes,
    addClass,
  } = props;

  const [addClassFormStatus, setAddClassFormStatus] = useState(false);

  const changeAddClassFromStatus = () => {
    setAddClassFormStatus(!addClassFormStatus);
  };

  const verifyUserOffClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id === 'sidebar-container-background') changeSidebarStatus();
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
          <ClassList 
            classes={classes}
          />
          <ClassAddButton
            changeAddClassFromStatus={changeAddClassFromStatus}
          />
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