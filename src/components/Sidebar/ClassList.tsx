import React, { FC, useEffect } from "react";
import uniqid from "uniqid";
import styles from '../../styles/App.module.css';
import Class from "../../models/class";

interface ClassListProps {
  classes: Class[],
  selectActiveClass: (selectedClass: string) => void,
  selectedClass: string,
}

const ClassList:FC<ClassListProps> = (props) => {

  const { 
    classes,
    selectActiveClass,
    selectedClass,
  } = props;

  const handleClassSelection = (e: any) => {
    const value = e.target.textContent;
    selectActiveClass(value);
  };

  return (
    <>
    {classes.length > 0 ? (
      <ul className={styles.classListContainer}>
        {classes.map((classItem) => (
          <li 
            onClick={(e) => handleClassSelection(e)}
            className={`${styles.classListItem} ${classItem.id === selectedClass ? styles.classListItemSelected : ''}`}
            key={uniqid()}>
              {classItem.name}
          </li>
        ))}
      </ul>
    ) : (
      <p>No classes available, create one using the button below</p>
    )}
  </>
  )
};

export default ClassList;