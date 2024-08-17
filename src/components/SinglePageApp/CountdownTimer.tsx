import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import styles from '../../styles/App.module.css';
import { FC, useEffect, useState } from 'react';
import playSvg from '../../assets/play.svg';
import pauseSvg from '../../assets/pause.svg';
import restartSvg from '../../assets/restart.svg';
import closSvg from '../../assets/close.svg';
import editSvg from '../../assets/edit.svg';
import EditTimerForm from './EditTimerForm';

interface CountdownTimerProps {
    task: {} | {
        id: string,
        task: string, 
        duration: string,
    },
    closeCountdownTimer: () => void,
};

interface Task { 
    id: string,
    task: string, 
    duration: string,
  }

const CountdownTimer:FC<CountdownTimerProps> = (props) => {

    const { 
        task,
        closeCountdownTimer,
    } = props;

    const convertDurationToNumber = () => {
        const minutes = (task as Task).duration.split('min')[0];
        const minutesToNumber = Number(minutes);
        const minutesNumberToSeconds = minutesToNumber * 60;
        return minutesNumberToSeconds;
    };

    const [timerColorTime, setTimerColorTime] = useState({
        totalTime: 0,
        firstChange: 0,
        secondChange: 0,
    });
    const [timerDuration, setTimerDuration] = useState(convertDurationToNumber());
    const [timerPlay, setTimerPlay] = useState(true);
    const [timerResetKey, setTimerResetKey] = useState(0);
    const [optionSvgSelected, setOptionSvgSelected] = useState('play');
    const [editTimerForm, setEditTimerForm] = useState(false);

    useEffect(() => {
        convertDurationToColorsTime();
    }, [task]);

    const convertDurationToColorsTime = () => {
        const minutes = (task as Task).duration.split('min')[0];
        const minutesToNumber = Number(minutes);
        const minutesNumberToSeconds = minutesToNumber * 60;

        const fiftyPercent = minutesNumberToSeconds * (50 / 100);
        const twentyFivePercent = minutesNumberToSeconds * (25 / 100);

        setTimerColorTime({
            totalTime: minutesNumberToSeconds,
            firstChange: fiftyPercent,
            secondChange: twentyFivePercent,
        });
    };

    const convertEditTimerChangeToColors = (newDuration: number) => {
        const fiftyPercent = newDuration * (50 / 100);
        const twentyFivePercent = newDuration * (25 / 100);

        setTimerColorTime({
            totalTime: newDuration,
            firstChange: fiftyPercent,
            secondChange: twentyFivePercent,
        });
    };

    const timeFormat = (time: any) => {
        const minutes = Math.floor(time / 60)
        let seconds = time % 60;
      
        if (time === 0) {
            return 0;
        } else {
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        };
    }

    const handleTimerStopAndPlay = (status: boolean) => {
        if (status === true) {
            setOptionSvgSelected('play');
        } else {
            setOptionSvgSelected('pause');
        };

        setTimerPlay(status);
    };

    const handleTimerRestart = () => {
        setOptionSvgSelected('')
        let newKey = timerResetKey;
        setTimerResetKey(newKey += 1);
    };

    const handleCountdownTimerClose = () => {
        closeCountdownTimer();
    };

    const handleOpenEditTimerForm = () => {
        setEditTimerForm(true);
    };

    const closeEditTimerForm = () => {
        setEditTimerForm(false);
    };

    const handleTimerTimeEditRequest = (newDuration: number) => {
        let newKey = timerResetKey;
        setTimerDuration(newDuration);
        convertEditTimerChangeToColors(newDuration);
        setTimerResetKey(newKey += 1);
    };

    if (Object.keys(task).length > 0) {
        return (
            <div 
                id='countdown-timer-background'
                className={styles.countdownTimerBackground}
            >

                <img 
                    onClick={() => handleCountdownTimerClose()}
                    src={closSvg} 
                    alt='close icon' 
                    className={styles.countdownTimerCloseSvg}>
                </img>

                <img 
                    onClick={() => handleOpenEditTimerForm()}
                    src={editSvg} 
                    alt='edit icon' 
                    className={styles.countdownTimerEditSvg}>
                </img>

                {editTimerForm === true ? (
                    <EditTimerForm 
                        closeEditTimerForm={closeEditTimerForm}
                        handleTimerTimeEditRequest={handleTimerTimeEditRequest}
                    />
                ) : (
                    <></>
                )}

                <div className={styles.countdownTimerContainer}>
                    <h2 className={styles.countdownTimerTaskNameHeader}>
                        {(task as Task).task}
                    </h2>
                    <CountdownCircleTimer
                        isPlaying={timerPlay}
                        duration={timerDuration}
                        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                        colorsTime={[timerColorTime.totalTime, timerColorTime.firstChange, timerColorTime.secondChange, 0]}
                        key={timerResetKey}
                        size={360}
                        strokeWidth={15}
                    >
                        {({ remainingTime }) => (
                            <span className={styles.countdownTimerTimeText}>
                                {timeFormat(remainingTime)}
                            </span>
                        )}
                    </CountdownCircleTimer>

                    <div className={styles.countdownTimerOptionsContainer}>
                        <img 
                            onClick={() => handleTimerStopAndPlay(false)}
                            alt='pause button' 
                            src={pauseSvg} 
                            className={`${styles.countdownTimerOptionSvg} ${optionSvgSelected === 'pause' ? styles.countdownTimerOptionSelected : ''}`}>
                        </img>
                        <img 
                            onClick={() => handleTimerStopAndPlay(true)}
                            alt='play button' 
                            src={playSvg} 
                            className={`${styles.countdownTimerOptionSvg} ${optionSvgSelected === 'play' ? styles.countdownTimerOptionSelected : ''}`}>
                        </img>
                        <img 
                            onClick={() => handleTimerRestart()}
                            alt='restart button' 
                            src={restartSvg} 
                            className={styles.countdownTimerOptionSvg}>
                        </img>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <p>Something went wrong</p>
        );
    };
};

export default CountdownTimer;