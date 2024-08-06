import React, { FC } from "react";
import styles from '../../styles/App.module.css';
import closeSvg from '../../assets/close.svg';

interface AddClassFormProps {
  changeAddClassFromStatus: () => void,
}

const AddClassForm:FC<AddClassFormProps> = (props) => {

  const { changeAddClassFromStatus } = props;

  const identifyUserOffClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id === 'add-class-form-background') changeAddClassFromStatus();
  };

  return (
    <div 
      onClick={(e) => identifyUserOffClick(e)}
      className={styles.addClassFormBackground}
      id="add-class-form-background"
    >
      <form 
        className={styles.addClassFormContainer}
        id="add-class-form"
      >
        <img 
          onClick={() => changeAddClassFromStatus()}
          className={styles.closeAddClassFormSvg} 
          alt="close icon" 
          src={closeSvg}>
        </img>
      </form>
    </div>
  )
};

export default AddClassForm;