import React, { FC } from "react";
import uniqid from "uniqid";
import styles from '../../styles/App.module.css';

interface ClassListProps {
  classes: string[],
}

const ClassList:FC<ClassListProps> = (props) => {

  const { classes } = props;

  return (
    <>
    {classes.length > 0 ? (
      <ul className={styles.classListContainer}>
        {classes.map((classItem) => (
          <li 
            className={styles.classListItem}
            key={uniqid()}>
              {classItem}
          </li>
        ))}
      </ul>
    ) : (
      <p>No classes available</p>
    )}
  </>
  )
};

export default ClassList;