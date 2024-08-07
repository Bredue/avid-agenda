import React, { FC, useState, ChangeEvent } from "react";
import styles from '../../styles/App.module.css';
import closeSvg from '../../assets/close.svg';
import toast from "react-hot-toast";
import uniqid from 'uniqid';

interface AddClassFormProps {
  changeAddClassFromStatus: () => void,
  addClass: (newClass: string) => void,
}

const AddClassForm:FC<AddClassFormProps> = (props) => {

  const { changeAddClassFromStatus, addClass } = props;

  const identifyUserOffClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id === 'add-class-form-background') changeAddClassFromStatus();
  };

  const [className, setClassName] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setClassName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Class Name Submitted: ${className}`, {'id': 'new-class'});
    saveClassToStorage();
    addClass(className);
    changeAddClassFromStatus();
  };

  const saveClassToStorage = () => {
    localStorage.setItem(`class-${uniqid()}`, `${className}`);
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
        <label 
          htmlFor="className"
          className={styles.addClassFormLabel}>
            Class Name:
        </label>
        <input
          type="text"
          id="className"
          className={styles.addClassFormInput}
          value={className}
          onChange={handleChange}
          required
        />
        <button 
          onClick={(e) => handleSubmit(e)} 
          type="submit"
          className={styles.addClassFormSubmitButton}>
            Submit
        </button>
      </form>
    </div>
  )
};

export default AddClassForm;