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

  const handleClassSelection = (id: string) => {
    selectActiveClass(id);
  };

  return (
    <>
    {classes.length > 0 ? (
      <ul className={styles.classListContainer}>
        {classes.map((classItem) => (
          <li 
            onClick={() => handleClassSelection(classItem.id)}
            className={`${styles.classListItem} ${classItem.id === selectedClass ? styles.classListItemSelected : ''}`}
            key={classItem.id}>
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