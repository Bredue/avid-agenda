import React, { FC } from "react";
import Date from "./Date";
import Time from "./Time";
import SidebarButton from "./SidebarButton";
import styles from '../../styles/App.module.css';

interface HeaderProps {
  changeSidebarStatus: () => void,
}

const Header: FC<HeaderProps> = (props) => {

  const { changeSidebarStatus } = props;

  return (
    <div className={styles.headerContainer}>
      <SidebarButton 
        changeSidebarStatus={changeSidebarStatus}
      />
      <div className={styles.dateAndTimeContainer}>
        <Date />
        <Time />
      </div>
    </div>
  )
};

export default Header;