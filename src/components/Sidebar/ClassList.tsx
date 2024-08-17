import { FC, useState } from "react";
import styles from '../../styles/App.module.css';
import Class from "../../models/class";

interface ClassListProps {
  classes: Class[],
  selectActiveClass: (selectedClass: string) => void,
  selectedClass: string,
  removeClass: (id: string) => void,
  openEditClassForm: (id: string) => void,
}

const ClassList:FC<ClassListProps> = (props) => {

  const { 
    classes,
    selectActiveClass,
    selectedClass,
    removeClass,
    openEditClassForm,
  } = props;

  const [hoveredClassId, setHoveredClassId] = useState<string | null>(null);

  const handleClassSelection = (id: string) => {
    selectActiveClass(id);
  };

  const handleClassEdit = (id: string) => {
    openEditClassForm(id);
  };

  const handleClassDelete = (id: string) => {
    localStorage.removeItem(`class-${id}`);
    removeClass(id);
  };

  return (
    <>
    {classes.length > 0 ? (
      <ul className={styles.classListContainer}>
        {classes.sort((a, b) => Number(a.period) - Number(b.period)).map((classItem) => (
          <li 
            onClick={() => handleClassSelection(classItem.id)}
            onMouseOver={() => setHoveredClassId(classItem.id)}
            onMouseOut={() => setHoveredClassId(null)}
            className={`${styles.classListItem} ${classItem.id === selectedClass ? styles.classListItemSelected : ''}`}
            key={classItem.id}>
              <span className={styles.classInfo}>
                {classItem.period}{classItem.period.length > 0 ? ' - ' : ''}{classItem.name}
              </span>
              {hoveredClassId === classItem.id && (
                <div className={styles.classItemOptionsContainer}>
                  <button onClick={(e) => { e.stopPropagation(); handleClassEdit(classItem.id); }}>Edit</button>
                  <button onClick={(e) => { e.stopPropagation(); handleClassDelete(classItem.id); }}>Delete</button>
                </div>
              )}
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