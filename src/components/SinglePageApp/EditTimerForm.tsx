import { FC, useState } from "react";
import styles from '../../styles/App.module.css';

interface EditTimerProps {
    closeEditTimerForm: () => void,
    handleTimerTimeEditRequest: (newDuration: number) => void,
}

const EditTimerForm:FC<EditTimerProps> = (props) => {

    const { closeEditTimerForm, handleTimerTimeEditRequest } = props;

    const [minutes, setMinutes] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMinutes(Number(e.target.value));
    };

    const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSeconds(Number(e.target.value));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const totalSeconds = (minutes * 60) + seconds;
        handleTimerTimeEditRequest(totalSeconds);
        closeEditTimerForm();
    };

    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeEditTimerForm();
        }
    };

    return (
        <div className={styles.editTimerBackground} onClick={handleBackgroundClick}>
            <div className={styles.editTimerForm}>
                <button className={styles.editTimerCloseButton} onClick={closeEditTimerForm}>×</button>
                <form onSubmit={handleSubmit} className={styles.editTimerFormContent}>
                    <div className={styles.editTimerField}>
                        <label htmlFor="minutes">Minutes:</label>
                        <input 
                            type="number" 
                            id="minutes" 
                            value={minutes} 
                            onChange={handleMinutesChange} 
                            min="0" 
                        />
                    </div>
                    <div className={styles.editTimerField}>
                        <label htmlFor="seconds">Seconds:</label>
                        <input 
                            type="number" 
                            id="seconds" 
                            value={seconds} 
                            onChange={handleSecondsChange} 
                            min="0" 
                            max="59"
                        />
                    </div>
                    <button type="submit" className={styles.editTimerSubmitButton}>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default EditTimerForm;