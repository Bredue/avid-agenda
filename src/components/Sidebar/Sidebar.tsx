import React, { FC, useState } from "react";
import styles from '../../styles/App.module.css';
import ClassList from "./ClassList";
import ClassAddButton from "./ClassAddButton";
import AddClassForm from "./AddClassForm";

interface SidebarProps {
  changeSidebarStatus: () => void,
  sidebarStatus: boolean,
};

const Sidebar:FC<SidebarProps> = (props) => {

  const { changeSidebarStatus, sidebarStatus } = props;

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
          <ClassList />
          <ClassAddButton
            changeAddClassFromStatus={changeAddClassFromStatus}
          />
          {addClassFormStatus === true ? (
            <AddClassForm 
              changeAddClassFromStatus={changeAddClassFromStatus}
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