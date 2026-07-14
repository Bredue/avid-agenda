import { FC } from "react";
import Date from "./Date";
import Time from "./Time";
import SidebarButton from "./SidebarButton";
import styles from '../../styles/App.module.css';

interface HeaderProps {
  sidebarStatus: boolean,
  changeSidebarStatus: () => void,
}

const Header: FC<HeaderProps> = (props) => {

  const { sidebarStatus, changeSidebarStatus } = props;

  return (
    <div className={styles.headerContainer}>
      <SidebarButton
        sidebarStatus={sidebarStatus}
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