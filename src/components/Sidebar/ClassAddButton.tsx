import React, { FC } from "react";
import styles from '../../styles/App.module.css';
import plusSvg from '../../assets/plus.svg';

interface ClassAddButtonProps {
  changeAddClassFromStatus: () => void,
}

const ClassAddButton:FC<ClassAddButtonProps> = (props) => {

  const { changeAddClassFromStatus } = props;

  return (
    <img 
      onClick={() => changeAddClassFromStatus()}
      className={styles.classAddButton} 
      alt="plus icon" 
      src={plusSvg}>
    </img>
  )
};

export default ClassAddButton;