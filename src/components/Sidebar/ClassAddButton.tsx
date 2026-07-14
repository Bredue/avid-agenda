import { FC } from "react";
import styles from '../../styles/App.module.css';
import plusSvg from '../../assets/plus.svg';

interface ClassAddButtonProps {
  addClassFormStatus: boolean,
  changeAddClassFromStatus: () => void,
}

const ClassAddButton:FC<ClassAddButtonProps> = (props) => {

  const { addClassFormStatus, changeAddClassFromStatus } = props;

  console.log(addClassFormStatus)

  return (
    <img 
      onClick={() => changeAddClassFromStatus()}
      className={
        `${styles.classAddButton} ${addClassFormStatus ? styles.classButtonSpin : ""}`
      } 
      alt="plus icon" 
      src={plusSvg}>
    </img>
  )
};

export default ClassAddButton;