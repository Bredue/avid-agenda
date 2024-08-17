import React, { FC, useState, ChangeEvent, useEffect } from "react";
import styles from '../../styles/App.module.css';
import closeSvg from '../../assets/close.svg';
import toast from "react-hot-toast";
import Class from "../../models/class";

interface AddClassFormProps {
  changeAddClassFromStatus: () => void,
  addClass: (newClass: Class) => void,
  classEditRequest: {
    request: boolean,
    id: string,
  },
  editClass: (editedClass: Class) => void,
}

const AddClassForm:FC<AddClassFormProps> = (props) => {

  const { 
    changeAddClassFromStatus, 
    addClass,
    classEditRequest,
    editClass,
  } = props;

  const [formData, setFormData] = useState({
    className: '',
    classPeriod: '',
  });

  useEffect(() => {
    if (classEditRequest.request === true) {
      const cls = localStorage.getItem(`class-${classEditRequest.id}`);      
      if (cls) {
        const parsedData = JSON.parse(cls);
        const convertedData = Class.fromPlainObject(parsedData);
        setFormData({
          className: convertedData.name,
          classPeriod: convertedData.period,
        });
      };
    };
  }, [classEditRequest.request]);

  const identifyUserOffClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id === 'add-class-form-background') changeAddClassFromStatus();
  };

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

  const saveClassToStorage = (newClass: Class) => {
    const serializedData = JSON.stringify(newClass.toPlainObject());
    localStorage.setItem(`class-${newClass.id}`, serializedData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (classEditRequest.request === true) {
      handleEditSubmit();
      return;
    };

    toast.success(`Class Submitted: ${formData.className}, ${formData.classPeriod}`, {'id': 'new-class'});
    const newClass = new Class([], [], formData.className, formData.classPeriod);
    saveClassToStorage(newClass);
    addClass(newClass);
    changeAddClassFromStatus();
  };

  const handleEditSubmit = () => {
    toast.success(`Class Edited: ${formData.className}, ${formData.classPeriod}`, {'id': 'edited-class'});
    
    if (classEditRequest.request === true) {
      const cls = localStorage.getItem(`class-${classEditRequest.id}`);      
      if (cls) {
        const parsedData = JSON.parse(cls);
        const convertedData = Class.fromPlainObject(parsedData);
        convertedData.name = formData.className,
        convertedData.period = formData.classPeriod,
        saveClassToStorage(convertedData);
        editClass(convertedData);
        changeAddClassFromStatus();
      };
    };
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
            {classEditRequest.request === true ? 'Edit Name:' : 'Class Name:'}
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
            {classEditRequest.request === true ? 'Edit Period:' : 'Class Period:'}
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