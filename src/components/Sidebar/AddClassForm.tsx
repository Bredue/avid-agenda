import React, { FC, useState, ChangeEvent } from "react";
import styles from '../../styles/App.module.css';
import closeSvg from '../../assets/close.svg';
import toast from "react-hot-toast";
import uniqid from 'uniqid';
import Class from "../../models/class";

interface AddClassFormProps {
  changeAddClassFromStatus: () => void,
  addClass: (newClass: Class) => void,
}

const AddClassForm:FC<AddClassFormProps> = (props) => {

  const { changeAddClassFromStatus, addClass } = props;

  const identifyUserOffClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id === 'add-class-form-background') changeAddClassFromStatus();
  };

  const [formData, setFormData] = useState({
    className: '',
    classPeriod: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === 'className') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        className: e.target.value,
      }));
    }
    if (e.target.id === 'classPeriod') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        classPeriod: e.target.value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Class Submitted: ${formData.className}, ${formData.classPeriod}`, {'id': 'new-class'});
    const newClass = new Class(formData.className, formData.classPeriod);
    saveClassToStorage(newClass);
    addClass(newClass);
    changeAddClassFromStatus();
  };

  const saveClassToStorage = (newClass: Class) => {
    const serializedData = JSON.stringify(newClass.toPlainObject());
    localStorage.setItem(`class-${newClass.id}`, serializedData);
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
          value={formData.className}
          onChange={handleChange}
          required
        />
        <label 
          htmlFor="classPeriod"
          className={styles.addClassFormLabel}>
            Class Period:
        </label>
        <input
          type="text"
          id="classPeriod"
          className={styles.addClassFormInput}
          value={formData.classPeriod}
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