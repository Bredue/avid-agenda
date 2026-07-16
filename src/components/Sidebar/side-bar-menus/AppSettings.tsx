import { FC, useEffect, useState } from "react";
import ClassModel from "../../../models/class";
import Settings, {
    AdditionalSchedule,
    ClassTime,
    ClassSchedule
} from "../../../models/settings";
import toast from "react-hot-toast";
import styles from "../../../styles/App.module.css";
import { handleClassSort } from "../../../helpers/sortClasses";

interface SettingsProps {
    handleHeaderRefreshRequest: () => void;
}

const placeholderBank = [
    "short day",
    "assembly schedule",
    "parent teacher conferences",
    "field trip"
];

const AppSettings: FC<SettingsProps> = (props) => {

    const {
        handleHeaderRefreshRequest
    } = props;

    const [enableSchoolSchedule, setEnableSchoolSchedule] = useState(false);
    const [enableClassTimes, setEnableClassTimes] = useState(false);
    const [enableAdditionalSchedules, setEnableAdditionalSchedules] = useState(false);
    const [showDayProgress, setShowDayProgress] = useState(false);
    const [showClassProgress, setShowClassProgress] = useState(false);
    const [classes, setClasses] = useState<ClassModel[]>([]);
    const [schoolStart, setSchoolStart] = useState("07:30");
    const [schoolEnd, setSchoolEnd] = useState("15:00");
    const [classTimes, setClassTimes] = useState<
        Record<string, ClassTime>
    >({});
    const [additionalSchedules, setAdditionalSchedules] = useState<
        AdditionalSchedule[]
    >([]);
    const [placeholders, setPlaceholders] = useState<string[]>([]);
    const [currentSchedule, setCurrentSchedule] = useState<AdditionalSchedule>();

    useEffect(() => {

        loadClasses();
        loadSettings();

    }, []);

    useEffect(() => {
        const timers: ReturnType<typeof setInterval>[] = [];

        additionalSchedules.forEach((_, index) => {
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

                } else if (deleting && !dots) {

                    current = target.slice(
                        0,
                        current.length - 1
                    );

                    if (current.length === 0) {
                        dots = true;
                        current = "";
                    }

                } else if (dots) {
                    if (current === "...") {
                        current = "";
                        dots = false;
                        deleting = false;

                        textIndex =
                            (textIndex + 1) %
                            placeholderBank.length;
                    } else {
                        current += ".";
                    }
                }

                setPlaceholders(prev => {

                    const updated = [
                        ...prev
                    ];

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
    }, [additionalSchedules.length]);


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

        const stored =
            localStorage.getItem("settings");

        if (!stored)
            return;

        const settings =
            Settings.fromPlainObject(
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

        setEnableClassTimes(
            settings.classTimes.enabled
        );

        const loadedClassTimes:
            Record<string, ClassTime> = {};

        settings.classTimes.classes.forEach(item => {

            const key =
                Object.keys(item)[0];

            if (!key)
                return;

            const id =
                key.replace(
                    "class-",
                    ""
                );

            loadedClassTimes[id] =
                item[key];
        });

        setClassTimes(
            loadedClassTimes
        );

        setEnableAdditionalSchedules(
            settings.additionalSchedules.enabled
        );

        setAdditionalSchedules(
            settings.additionalSchedules.schedules
        );

        setCurrentSchedule(
            settings.additionalSchedules.selectedSchedule
        );

        setShowDayProgress(
            settings.progressBars.showDayProgress
        );

        setShowClassProgress(
            settings.progressBars.showClassProgress
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

    const updateAdditionalSchedule = (
        index: number,
        field: keyof AdditionalSchedule,
        value: string
    ) => {
        setAdditionalSchedules(prev => {
            const updated = [
                ...prev
            ];

            updated[index] = {
                ...updated[index],
                [field]: value
            };

            return updated;
        });
    };

    const updateAdditionalClassTime = (
        scheduleIndex: number,
        classId: string,
        field: "start" | "end",
        value: string
    ) => {

        setAdditionalSchedules(prev => {
            const updated = [
                ...prev
            ];

            updated[scheduleIndex] = {

                ...updated[scheduleIndex],
                classes: {
                    ...updated[scheduleIndex].classes,

                    [classId]: {
                        ...updated[scheduleIndex]
                            .classes[classId],

                        [field]: value
                    }
                }
            };

            return updated;
        });
    };

    const addSchedule = () => {
        const emptyClasses:
            ClassSchedule = {};

        classes.forEach(cls => {
            emptyClasses[cls.id] = {
                start: "",
                end: ""
            };
        });

        setAdditionalSchedules(prev => [
            ...prev,
            {
                label: "",
                schoolStart: schoolStart,
                schoolEnd: schoolEnd,
                classes: emptyClasses
            }
        ]);
    };

    const removeSchedule = (
        index: number
    ) => {
        setAdditionalSchedules(prev =>
            prev.filter((_, i) =>
                i !== index
            )
        );
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
        const formattedClassTimes =
            Object.entries(classTimes)
                .filter(([_, times]) =>
                    times.start &&
                    times.end
                )
                .map(([classId, times]) => ({
                    [`class-${classId}`]: {

                        start: times.start,
                        end: times.end

                    }
                }));

        const updatedSelectedSchedule =
            currentSchedule
                ? additionalSchedules.find(
                    schedule =>
                        schedule.label === currentSchedule.label
                )
                : undefined;

        const settings =
            new Settings(
                enableSchoolSchedule,
                schoolStart,
                schoolEnd,
                enableClassTimes,
                formattedClassTimes,
                enableAdditionalSchedules,
                additionalSchedules,
                updatedSelectedSchedule,
                showDayProgress,
                showClassProgress
            );

        localStorage.setItem(
            "settings",
            JSON.stringify(
                settings.toPlainObject()
            )
        );

        console.log("currentSchedule state:", currentSchedule);
        console.log(settings.additionalSchedules.selectedSchedule);

        handleHeaderRefreshRequest();

        toast.success(
            "Settings Saved!"
        );

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
                    Add Typical Class Start and End Times
                </label>
            </div>

            {enableClassTimes && (
                <>
                    {handleClassSort(classes).map(cls => (

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
                                        removeClassTime(
                                            cls.id
                                        )
                                    }
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </>
            )}

            <div className={styles.appSettingFormGroup}>
                <label className={styles.appSettingFormLabel}>
                    <input
                        type="checkbox"
                        checked={enableAdditionalSchedules}
                        onChange={(e) => {
                            if (!enableSchoolSchedule && e.target.checked) {
                                toast.error("Enable School Start and End Times first.");
                                return;
                            }

                            setEnableAdditionalSchedules(
                                e.target.checked
                            )
                        }}
                    />
                    Add Additional School Schedules
                </label>
            </div>

            {enableAdditionalSchedules && (
                <>
                    <div className={styles.appSettingFormGroup}>
                        <label className={styles.appSettingFormLabel}>
                            Selected Modified Schedule that will be used today
                        </label>

                        <select
                            className={styles.appSettingsAdditionalScheduleText}
                            value={currentSchedule?.label ?? ""}
                            onChange={(e) => {
                                const selected = additionalSchedules.find(
                                    schedule => schedule.label === e.target.value
                                );

                                setCurrentSchedule(selected);
                            }}
                        >
                            <option value="">
                                None - Normal School Schedule
                            </option>

                            {additionalSchedules.map((schedule, index) => (
                                <option
                                    key={index}
                                    value={schedule.label}
                                >
                                    {schedule.label || `Schedule ${index + 1}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {additionalSchedules.map((schedule, index) => (

                        <div
                            key={index}
                            className={styles.appSettingScheduleRow}
                        >
                            <button
                                type="button"
                                className={styles.schoolTimeRemoveButton}
                                onClick={() =>
                                    removeSchedule(index)
                                }
                            >
                                X
                            </button>

                            <label className={styles.appSettingFormLabel}>
                                Schedule Name
                            </label>

                            <input
                                className={styles.appSettingsAdditionalScheduleText}
                                type="text"
                                placeholder={
                                    placeholders[index] || ""
                                }
                                value={
                                    schedule.label
                                }
                                onChange={(e) =>
                                    updateAdditionalSchedule(
                                        index,
                                        "label",
                                        e.target.value
                                    )
                                }
                            />

                            <label className={styles.appSettingFormLabel}>
                                School Start
                            </label>

                            <input
                                className={styles.classTimeEntry}
                                type="time"
                                value={
                                    schedule.schoolStart
                                }
                                onChange={(e) =>
                                    updateAdditionalSchedule(
                                        index,
                                        "schoolStart",
                                        e.target.value
                                    )
                                }
                            />

                            <label className={styles.appSettingFormLabel}>
                                School End
                            </label>

                            <input
                                className={styles.classTimeEntry}
                                type="time"
                                value={
                                    schedule.schoolEnd
                                }
                                onChange={(e) =>
                                    updateAdditionalSchedule(
                                        index,
                                        "schoolEnd",
                                        e.target.value
                                    )
                                }
                            />

                            {handleClassSort(classes).map(cls => (
                                <div
                                    key={cls.id}
                                    className={styles.appSettingClassRow}
                                >
                                    <span
                                        className={styles.appSettingsClassText}
                                    >
                                        {cls.period} - {cls.name}
                                    </span>

                                    <input
                                        className={styles.classTimeEntry}
                                        type="time"
                                        value={
                                            schedule.classes[cls.id]?.start || ""
                                        }
                                        onChange={(e) =>
                                            updateAdditionalClassTime(
                                                index,
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
                                            schedule.classes[cls.id]?.end || ""
                                        }
                                        onChange={(e) =>
                                            updateAdditionalClassTime(
                                                index,
                                                cls.id,
                                                "end",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            ))}

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
                        checked={showDayProgress}
                        onChange={(e) => {
                            if (!enableSchoolSchedule && e.target.checked) {
                                toast.error("Enable School Start and End Times first.");
                                return;
                            }

                            setShowDayProgress(
                                e.target.checked
                            )
                        }}
                    />
                    Show School Progress Bar
                </label>
            </div>

            <div className={styles.appSettingFormGroup}>
                <label className={styles.appSettingFormLabel}>
                    <input
                        type="checkbox"
                        checked={showClassProgress}
                        onChange={(e) => {
                            if (!enableClassTimes && e.target.checked) {
                                toast.error("Enable Typical Class Start and End Times first.");
                                return;
                            }

                            setShowClassProgress(e.target.checked);
                        }}
                    />
                    Show Time to Class End Data
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