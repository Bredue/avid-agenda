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

  return (
    sidebarStatus === false ? (
      <></>
    ) : (
      <div 
        onClick={() => changeSidebarStatus()}
        className={styles.sidebarContainerBackground}
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