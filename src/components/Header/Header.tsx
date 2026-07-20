import { FC, useEffect, useState } from "react";
import HeaderDate from "./Date";
import Time from "./Time";
import SidebarButton from "./SidebarButton";
import styles from "../../styles/App.module.css";
import Settings from "../../models/settings";

interface HeaderProps {
    sidebarStatus: boolean;
    changeSidebarStatus: () => void;
    headerRefresh: boolean;
}

interface CurrentClass {
    start: string;
    end: string;
}

const Header: FC<HeaderProps> = ({
    sidebarStatus,
    changeSidebarStatus,
    headerRefresh,
}) => {

    const getAppSettings = () => {
        const raw =
            localStorage.getItem("settings");

        if (!raw)
            return new Settings();

        try {
            return Settings.fromPlainObject(
                JSON.parse(raw)
            );
        } catch {
            return new Settings();
        }
    }

    const [settings, setSettings] =
        useState(getAppSettings());

    const [dayProgress, setDayProgress] =
        useState(0);

    const [activeClass, setActiveClass] =
        useState<CurrentClass | null>(null);

    const [remainingSeconds, setRemainingSeconds] =
        useState(0);

    const [showCountdown, setShowCountdown] =
        useState(false);

    const getClassList = (): CurrentClass[] => {
        if (!settings.progressBars.showClassProgress)
            return [];

        const selectedSchedule =
            settings.additionalSchedules.selectedSchedule;

        if (selectedSchedule) {
            return Object.values(
                selectedSchedule.classes
            )
            .filter(
                classTime =>
                    classTime.start &&
                    classTime.end
            );
        }

        if (
            settings.classTimes.enabled &&
            settings.classTimes.classes.length > 0
        ) {
            return settings.classTimes.classes
                .flatMap(
                    classSchedule =>
                        Object.values(classSchedule)
                )
                .filter(
                    classTime =>
                        classTime.start &&
                        classTime.end
                );
        }
        return [];
    };

    const findCurrentClass = (): CurrentClass | null => {

        const classes =
            getClassList();

        const now =
            new Date();

        const currentSeconds =
            now.getHours() * 3600 +
            now.getMinutes() * 60 +
            now.getSeconds();

        const activeClasses =
            classes.filter(classTime => {

                const [sh, sm] =
                    classTime.start
                        .split(":")
                        .map(Number);

                const [eh, em] =
                    classTime.end
                        .split(":")
                        .map(Number);

                const startSeconds =
                    sh * 3600 +
                    sm * 60;

                const endSeconds =
                    eh * 3600 +
                    em * 60;

                return (
                    currentSeconds >= startSeconds &&
                    currentSeconds < endSeconds
                );
            });

        if (!activeClasses.length)
            return null;

        return activeClasses.sort((a, b) => {
            const aStart =
                a.start
                    .split(":")
                    .map(Number);

            const bStart =
                b.start
                    .split(":")
                    .map(Number);

            return (
                (bStart[0] * 60 + bStart[1]) -
                (aStart[0] * 60 + aStart[1])
            );
        })[0];
    };

    // Reload settings only after a save request
    useEffect(() => {
        setSettings(
            getAppSettings()
        );
    }, [headerRefresh]);

    // Find current class once after settings reload
    useEffect(() => {
        if (!settings.progressBars.showClassProgress) {
            setActiveClass(null);
            return;
        }

        const current =
            findCurrentClass();

        setActiveClass(current);

        if (current) {
            console.log(
                "Mounted class:",
                current.start,
                "-",
                current.end
            );
        }
    }, [settings]);


    // Countdown handler and next-class remount
    useEffect(() => {
        if (!activeClass) {
            setRemainingSeconds(0);
            return;
        }

        const updateCountdown = () => {
            const now =
                new Date();

            const [eh, em] =
                activeClass.end
                    .split(":")
                    .map(Number);

            const end =
                new Date(now);

            end.setHours(
                eh,
                em,
                0,
                0
            );

            const remaining =
                Math.max(
                    0,
                    Math.floor(
                        (
                            end.getTime() -
                            now.getTime()
                        ) / 1000
                    )
                );

            setRemainingSeconds(
                remaining
            );

            if (remaining === 0) {
                console.log(
                    "Class ended:",
                    activeClass.start,
                    "-",
                    activeClass.end
                );

                const nextClass =
                    findCurrentClass();

                if (nextClass) {
                    console.log(
                        "Next class mounted:",
                        nextClass.start,
                        "-",
                        nextClass.end
                    );

                    setActiveClass(
                        nextClass
                    );
                    return;
                }

                setActiveClass(null);
                setShowCountdown(false);
            }
        };

        updateCountdown();

        const interval =
            setInterval(
                updateCountdown,
                1000
            );

        return () =>
            clearInterval(interval);

    }, [activeClass]);


    // Shows countdown every minute for 5 seconds
    useEffect(() => {

        if (!activeClass) {

            setShowCountdown(false);

            return;
        }

        const showWarning = () => {
            setShowCountdown(true);

            setTimeout(() => {

                setShowCountdown(false);

            }, 5000);
        };

        const interval =
            setInterval(
                showWarning,
                60000
            );

        return () =>
            clearInterval(interval);

    }, [activeClass]);


    // Force countdown during final minute
    useEffect(() => {

        if (
            remainingSeconds <= 60 &&
            remainingSeconds > 0
        ) {

            setShowCountdown(true);

        }


        if (remainingSeconds === 0) {

            setShowCountdown(false);

        }


    }, [remainingSeconds]);


    // Calculates school progress
    useEffect(() => {
        const updateProgress = () => {

          const selectedSchedule =
              settings.additionalSchedules.selectedSchedule;

          const schoolStart =
              selectedSchedule
                  ? selectedSchedule.schoolStart
                  : settings.schoolTimeSettings.schoolStart;

          const schoolEnd =
              selectedSchedule
                  ? selectedSchedule.schoolEnd
                  : settings.schoolTimeSettings.schoolEnd;

          const now =
              new Date();

            const [sh, sm] =
                schoolStart
                    .split(":")
                    .map(Number);

            const [eh, em] =
                schoolEnd
                    .split(":")
                    .map(Number);

            const start =
                new Date(now);

            start.setHours(
                sh,
                sm,
                0,
                0
            );

            const end =
                new Date(now);

            end.setHours(
                eh,
                em,
                0,
                0
            );

            if (now <= start) {
                setDayProgress(0);
                return;
            }

            if (now >= end) {
                setDayProgress(100);
                return;
            }

            setDayProgress(
                (
                    (now.getTime() - start.getTime()) /
                    (end.getTime() - start.getTime())
                ) * 100
            );
        };

        updateProgress();

        const interval =
            setInterval(
                updateProgress,
                30000
            );

        return () =>
            clearInterval(interval);

    }, [settings]);


    const minutes =
        Math.floor(
            remainingSeconds / 60
        );

    const seconds =
        remainingSeconds % 60;

    const countdownText =
        `${minutes}:${seconds
            .toString()
            .padStart(2, "0")} remaining`;

    const forceCountdown =
        remainingSeconds <= 60 &&
        remainingSeconds > 0;

    return (
        <div className={styles.headerContainer}>
            <SidebarButton
                sidebarStatus={sidebarStatus}
                changeSidebarStatus={changeSidebarStatus}
            />
            <div className={styles.dateAndTimeContainer}>
                <div className={styles.headerViewport}>
                    <div
                        className={`${styles.headerStack} ${
                            showCountdown || forceCountdown
                                ? styles.showCountdown
                                : ""
                        }`}
                    >
                        <div className={styles.headerClock}>
                            <HeaderDate />
                            <Time />
                        </div>

                        <div className={styles.classCountdown}>
                            {countdownText}
                        </div>
                    </div>
                </div>
            </div>

            {settings.progressBars.showDayProgress && (
                <div
                    className={styles.dayProgress}
                    style={{
                        width: `${dayProgress}%`
                    }}
                />
            )}
        </div>
    );

};

export default Header;