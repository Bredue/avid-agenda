import { FC } from "react";
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

  // const [hoveredClassId, setHoveredClassId] = useState<string | null>(null);

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

  const handleClassSort = () => {
    return classes.sort((a, b) => {
      const extractParts = (str: any) => {
          const match = str.match(/^(\d+)([A-Z]?)$/);
          return match ? [Number(match[1]), match[2]] : [Infinity, ''];
      };
  
      const [aNumber, aLetter] = extractParts(a.period);
      const [bNumber, bLetter] = extractParts(b.period);
  
      if (aNumber === bNumber) {
          return aLetter.localeCompare(bLetter);
      } else {
          return aNumber - bNumber;
      }
    });
  };

  return (
    <>
    {classes.length > 0 ? (
      <ul className={styles.classListContainer}>
        {handleClassSort().map((classItem) => (
          <li 
            onClick={() => handleClassSelection(classItem.id)}
            className={`${styles.classListItem} ${classItem.id === selectedClass ? styles.classListItemSelected : ''}`}
            key={classItem.id}>
              <span className={styles.classInfo}>
                {classItem.period}{classItem.period.length > 0 ? ' - ' : ''}{classItem.name}
              </span>
              {selectedClass === classItem.id && (
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