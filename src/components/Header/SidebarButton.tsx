import { FC } from "react";
import sidebarButton from '../../assets/menu.svg';
import styles from '../../styles/App.module.css';

interface SidebarButtonProps {
  sidebarStatus: boolean,
  changeSidebarStatus: () => void,
}

const SidebarButton: FC<SidebarButtonProps> = (props) => {

  const { sidebarStatus, changeSidebarStatus } = props; 

  return (
    <img 
      onClick={() => changeSidebarStatus()}
      className={`${styles.sidebarSvg} ${
        sidebarStatus ? styles.sidebarSvgOpen : ""
      }`}
      alt="menu icon" 
      src={sidebarButton}>
    </img>
  )
};

export default SidebarButton;