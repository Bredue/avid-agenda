import { FC, useEffect, useState } from "react";
import ClassModel from "../../../models/class";
import Settings from "../../../models/settings";
import toast from "react-hot-toast";
import styles from "../../../styles/App.module.css";
import { handleClassSort } from "../../../helpers/sortClasses";

interface SettingsProps {
    handleHeaderRefreshRequest: () => void,
}

interface ClassTime {
    start: string;
    end: string;
}

interface CustomSchedule {
    label: string;
    start: string;
    end: string;
}

const placeholderBank = [
    "short day",
    "assembly schedule",
    "parent teacher conferences",
    "field trip"
];

const AppSettings: FC<SettingsProps> = (props) => {

    const { handleHeaderRefreshRequest } = props;

    const [enableSchoolSchedule, setEnableSchoolSchedule] = useState(false);
    const [enableClassTimes, setEnableClassTimes] = useState(false);
    const [showDayProgress, setShowDayProgress] = useState(false);
    const [showClassProgress, setShowClassProgress] = useState(false);
    const [classes, setClasses] = useState<ClassModel[]>([]);
    const [schoolStart, setSchoolStart] = useState("07:30");
    const [schoolEnd, setSchoolEnd] = useState("15:00");
    const [placeholders, setPlaceholders] = useState<string[]>([
        placeholderBank[0]
    ]);

    const [customSchedules, setCustomSchedules] = useState<CustomSchedule[]>([
        {
            label: "",
            start: "",
            end: "",
        }
    ]);

    const [classTimes, setClassTimes] = useState<
        Record<string, ClassTime>
    >({});

    useEffect(() => {
        loadClasses();
        loadSettings();
    }, []);

    useEffect(() => {
        const timers: ReturnType<typeof setInterval>[] = [];

        customSchedules.forEach((_, index) => {

            let textIndex = index % placeholderBank.length;
            let current = "";
            let deleting = false;
            let dots = false;

            const timer = setInterval(() => {
                const target = placeholderBank[textIndex];

                if (!deleting && !dots) {
                    current = target.slice(
                        0,
                        current.length + 1
                    );

                    if (current === target) {
                        deleting = true;
                    }
                } 

                else if (deleting && !dots) {
                    current = target.slice(
                        0,
                        current.length - 1
                    );

                    if (current.length === 0) {
                        dots = true;
                        current = "";
                    }
                }

                else if (dots) {
                    if (current === "...") {
                        current = "";
                        dots = false;
                        deleting = false;
                        textIndex =
                            (textIndex + 1) %
                            placeholderBank.length;
                    } 
                    else {
                        current += ".";
                    }
                }

                setPlaceholders(prev => {
                    const updated = [...prev];
                    updated[index] = current;
                    return updated;
                });
            }, 150);

            timers.push(timer);
        });

        return () => {
            timers.forEach(timer =>
                clearInterval(timer)
            );
        };

    }, [customSchedules.length]);

    const loadClasses = () => {
        const loaded: ClassModel[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            if (!key || !key.startsWith("class-"))
                continue;

            const data = localStorage.getItem(key);

            if (!data)
                continue;

            loaded.push(
                ClassModel.fromPlainObject(
                    JSON.parse(data)
                )
            );
        }

        setClasses(loaded);
    };

    const loadSettings = () => {
        const stored = localStorage.getItem("settings");

        if (!stored)
            return;

        const settings = Settings.fromPlainObject(
            JSON.parse(stored)
        );

        setEnableSchoolSchedule(
            settings.schoolTimeSettings.enabled
        );

        setSchoolStart(
            settings.schoolTimeSettings.schoolStart
        );

        setSchoolEnd(
            settings.schoolTimeSettings.schoolEnd
        );

        setCustomSchedules(
            settings.schoolTimeSettings.additionalSchedules.length > 0
                ? settings.schoolTimeSettings.additionalSchedules
                : [
                    {
                        label: "",
                        start: "",
                        end: ""
                    }
                ]
        );

        setEnableClassTimes(
            settings.classTimes.enabled
        );

        const loadedClassTimes: Record<string, ClassTime> = {};

        settings.classTimes.classes.forEach((item) => {
            const classKey = Object.keys(item)[0];

            if (!classKey)
                return;

            const classId = classKey.replace(
                "class-",
                ""
            );

            loadedClassTimes[classId] = item[classKey];
        });

        setClassTimes(
            loadedClassTimes
        );

        setShowDayProgress(
            settings.progressBars.showDayProgress
        );

        setShowClassProgress(
            settings.progressBars.showClassProgress
        );
    };

    const updateSchedule = (
        index: number,
        field: keyof CustomSchedule,
        value: string
    ) => {
        setCustomSchedules(prev => {
            const updated = [...prev];

            updated[index] = {
                ...updated[index],
                [field]: value
            };
            return updated;
        });
    };

    const addSchedule = () => {
        setCustomSchedules(prev => [
            ...prev,
            {
                label: "",
                start: "",
                end: ""
            }
        ]);
    };

    const removeSchedule = (
        index: number
    ) => {
        setCustomSchedules(prev =>
            prev.filter((_, i) => i !== index)
        );
    };

    const updateClassTime = (
        id: string,
        field: "start" | "end",
        value: string
    ) => {
        setClassTimes(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const removeClassTime = (
        id: string
    ) => {
        setClassTimes(prev => {
            const updated = {
                ...prev
            };
            delete updated[id];
            return updated;
        });
    };

    const saveSettings = () => {
        const formattedClassTimes = Object.entries(classTimes)
            .filter(([_, times]) =>
                times.start && times.end
            )
            .map(([classId, times]) => ({
                [`class-${classId}`]: {
                    start: times.start,
                    end: times.end
                }
            }));

        const settings = new Settings(
            enableSchoolSchedule,
            schoolStart,
            schoolEnd,
            customSchedules,
            enableClassTimes,
            formattedClassTimes,
            showDayProgress,
            showClassProgress
        );

        localStorage.setItem(
            "settings",
            JSON.stringify(settings.toPlainObject())
        );

        handleHeaderRefreshRequest();
        toast.success("Settings Saved!");
    };

    return (
        <form
            className={styles.appSettingForm}
            onSubmit={(e) => {
                e.preventDefault();
                saveSettings();
            }}
        >
            <div className={styles.appSettingFormGroup}>
                <label className={styles.appSettingFormLabel}>
                    <input
                        type="checkbox"
                        checked={enableSchoolSchedule}
                        onChange={(e) =>
                            setEnableSchoolSchedule(
                                e.target.checked
                            )
                        }
                    />
                    Add School Start and End Times
                </label>
            </div>

            {enableSchoolSchedule && (
                <>
                    <div className={styles.appSettingFormGroup}>
                        <label className={styles.appSettingFormLabel}>
                            School Start
                        </label>
                        <input
                            className={styles.classTimeEntry}
                            type="time"
                            value={schoolStart}
                            onChange={(e) =>
                                setSchoolStart(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className={styles.appSettingFormGroup}>
                        <label className={styles.appSettingFormLabel}>
                            School End
                        </label>
                        <input
                            className={styles.classTimeEntry}
                            type="time"
                            value={schoolEnd}
                            onChange={(e) =>
                                setSchoolEnd(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <label className={styles.appSettingFormLabel}>
                        Add Additional School Schedules
                    </label>

                    {customSchedules.map((schedule, index) => (
                        <div
                            key={index}
                            className={styles.appSettingClassRow}
                        >
                            <input
                                className={styles.appSettingsAdditionalScheduleText}
                                type="text"
                                placeholder={
                                    placeholders[index] || ""
                                }
                                value={schedule.label}
                                onChange={(e) =>
                                    updateSchedule(
                                        index,
                                        "label",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                className={styles.classTimeEntry}
                                type="time"
                                value={schedule.start}
                                onChange={(e) =>
                                    updateSchedule(
                                        index,
                                        "start",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                className={styles.classTimeEntry}
                                type="time"
                                value={schedule.end}
                                onChange={(e) =>
                                    updateSchedule(
                                        index,
                                        "end",
                                        e.target.value
                                    )
                                }
                            />

                            <button
                                type="button"
                                className={styles.schoolTimeRemoveButton}
                                onClick={() =>
                                    removeSchedule(index)
                                }
                            >
                                X
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        className={styles.addSchoolScheduleButton}
                        onClick={addSchedule}
                    >
                        Add Schedule
                    </button>
                </>

            )}

            <div className={styles.appSettingFormGroup}>
                <label className={styles.appSettingFormLabel}>
                    <input
                        type="checkbox"
                        checked={enableClassTimes}
                        onChange={(e) =>
                            setEnableClassTimes(
                                e.target.checked
                            )
                        }
                    />
                    Add Individual Class Start and End Times
                </label>
            </div>

            {enableClassTimes && handleClassSort(classes).map(cls => (
                <div
                    key={cls.id}
                    className={styles.appSettingClassRow}
                >
                    <span className={styles.appSettingsClassText}>
                        {cls.period} - {cls.name}
                    </span>

                    <input
                        className={styles.classTimeEntry}
                        type="time"
                        value={
                            classTimes[cls.id]?.start || ""
                        }
                        onChange={(e) =>
                            updateClassTime(
                                cls.id,
                                "start",
                                e.target.value
                            )
                        }
                    />

                    <input
                        className={styles.classTimeEntry}
                        type="time"
                        value={
                            classTimes[cls.id]?.end || ""
                        }
                        onChange={(e) =>
                            updateClassTime(
                                cls.id,
                                "end",
                                e.target.value
                            )
                        }
                    />

                    {classTimes[cls.id] && (
                        <button
                            type="button"
                            className={styles.appSettingsButton}
                            onClick={() =>
                                removeClassTime(cls.id)
                            }
                        >
                            Remove
                        </button>
                    )}

                </div>

            ))}

            <div className={styles.appSettingFormGroup}>
                <label className={styles.appSettingFormLabel}>
                    <input
                        type="checkbox"
                        checked={showDayProgress}
                        disabled={!enableSchoolSchedule}
                        onChange={(e) =>
                            setShowDayProgress(
                                e.target.checked
                            )
                        }
                    />
                    Show School Progress Bar
                </label>
            </div>

            <div className={styles.appSettingFormGroup}>
                <label className={styles.appSettingFormLabel}>
                    <input
                        type="checkbox"
                        checked={showClassProgress}
                        disabled={!enableClassTimes}
                        onChange={(e) =>
                            setShowClassProgress(
                                e.target.checked
                            )
                        }
                    />
                    Show Class Progress Bar
                </label>
            </div>

            <button
                className={styles.appSettingSubmitButton}
                type="submit"
            >
                Save Settings
            </button>
        </form>
    );
};


export default AppSettings;