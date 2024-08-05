import React from "react";
import Date from "./Date";
import Time from "./Time";
import SidebarButton from "./SidebarButton";
import styles from '../../styles/App.module.css';

const Header = () => {
  return (
    <div className={styles.headerContainer}>
      <SidebarButton />
      <div className={styles.dateAndTimeContainer}>
        <Date />
        <Time />
      </div>
    </div>
  )
};

export default Header;