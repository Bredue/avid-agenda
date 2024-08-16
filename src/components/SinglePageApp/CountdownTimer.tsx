import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import styles from '../../styles/App.module.css';
import { FC, useEffect, useState } from 'react';

interface CountdownTimerProps {
    task: {} | {
        id: string,
        task: string, 
        duration: string,
    },
};

interface Task { 
    id: string,
    task: string, 
    duration: string,
  }

const CountdownTimer:FC<CountdownTimerProps> = (props) => {

    const { task } = props;

    const minuteSeconds = 60;
    const hourSeconds = 3600;

    const [timerColorTime, setTimerColorTime] = useState({
        totalTime: 0,
        firstChange: 0,
        secondChange: 0,
    })

    useEffect(() => {
        convertDurationToColorsTime();
    }, [task]);

    const handleBackgroundOffClick = (e: React.MouseEvent) => {
        if ((e.target as any).id === 'countdown-timer-background') {

        } else {
            return;
        }
    };

    const convertDurationToNumber = () => {
        const minutes = (task as Task).duration.split('min')[0];
        const minutesToNumber = Number(minutes);
        const minutesNumberToSeconds = minutesToNumber * 60;
        return minutesNumberToSeconds;
    };

    const convertDurationToColorsTime = () => {
        const minutes = (task as Task).duration.split('min')[0];
        const minutesToNumber = Number(minutes);
        const minutesNumberToSeconds = minutesToNumber * 60;

        // const seventyFivePercent = minutesNumberToSeconds * (75 / 100);
        const fiftyPercent = minutesNumberToSeconds * (50 / 100);
        const twentyFivePercent = minutesNumberToSeconds * (25 / 100);

        setTimerColorTime({
            totalTime: minutesNumberToSeconds,
            firstChange: fiftyPercent,
            secondChange: twentyFivePercent,
        });
    };

    const renderTime = (dimension: any, time: any) => {
        return (
          <div className="time-wrapper">
            <div className="time">{time}</div>
            <div>{dimension}</div>
          </div>
        );
    };

    const getTimeMinutes = (time: any) => ((time % hourSeconds) / minuteSeconds) | 0;

    if (Object.keys(task).length > 0) {
        return (
            <div 
                id='countdown-timer-background'
                onClick={(e) => handleBackgroundOffClick(e)}
                className={styles.countdownTimerBackground}
            >
                <CountdownCircleTimer
                    isPlaying
                    duration={convertDurationToNumber()}
                    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                    colorsTime={[timerColorTime.totalTime, timerColorTime.firstChange, timerColorTime.secondChange, 0]}
                >
                     {({ elapsedTime, color }) => (
                    <span style={{ color }}>
                        {renderTime("minutes", getTimeMinutes(hourSeconds - elapsedTime))}
                    </span>
                    )}
                </CountdownCircleTimer>
            </div>
        );
    } else {
        return (
            <p>Something went wrong</p>
        );
    };
};

export default CountdownTimer;