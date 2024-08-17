import { FC } from "react";
import sidebarButton from '../../assets/menu.svg';
import styles from '../../styles/App.module.css';

interface SidebarButtonProps {
  changeSidebarStatus: () => void,
}

const SidebarButton: FC<SidebarButtonProps> = (props) => {

  const { changeSidebarStatus } = props; 

  return (
    <img 
      onClick={() => changeSidebarStatus()}
      className={styles.sidebarSvg}
      alt="menu icon" 
      src={sidebarButton}>
    </img>
  )
};

export default SidebarButton;