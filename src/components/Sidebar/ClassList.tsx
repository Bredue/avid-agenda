import { FC } from "react";
import styles from '../../styles/App.module.css';
import ClassModel from '../../models/class';
import { handleClassSort } from "../../helpers/sortClasses";

interface ClassListProps {
  classes: ClassModel[],
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
        {handleClassSort(classes).map((classItem) => (
          <li 
            onClick={() => handleClassSelection(classItem.id)}
            className={`${styles.classListItem} ${classItem.id === selectedClass ? styles.classListItemSelected : ''}`}
            key={classItem.id}>
              <span className={styles.classInfo}>
                {classItem.period}{classItem.period.length > 0 ? ' - ' : ''}{classItem.name}
              </span>
              {selectedClass === classItem.id && (
                <div className={styles.classItemOptionsContainer}>
                  <button 
                      className={styles.classListEditButton}
                      onClick={(e) => { e.stopPropagation(); handleClassEdit(classItem.id); }}
                    >Edit
                  </button>
                  <button 
                    className={styles.classListDeleteButton}
                    onClick={(e) => { e.stopPropagation(); handleClassDelete(classItem.id); }}
                      >Delete
                  </button>
                </div>
              )}
          </li>
        ))}
      </ul>
    ) : (
      <p className={styles.sidebarText}>No classes available, create one using the button below</p>
    )}
  </>
  )
};

export default ClassList;