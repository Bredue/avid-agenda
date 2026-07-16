interface ClassTime {
    start: string;
    end: string;
}

interface ClassSchedule {
    [classKey: string]: ClassTime;
}

interface AdditionalSchedule {
    label: string;
    schoolStart: string;
    schoolEnd: string;
    classes: ClassSchedule;
}

class Settings {

    schoolTimeSettings: {
        enabled: boolean;
        schoolStart: string;
        schoolEnd: string;
    };

    classTimes: {
        enabled: boolean;
        classes: ClassSchedule[];
    };

    additionalSchedules: {
        enabled: boolean;
        schedules: AdditionalSchedule[];
        selectedSchedule?: AdditionalSchedule;
    };

    progressBars: {
        showDayProgress: boolean;
        showClassProgress: boolean;
    };

    constructor(
        schoolEnabled: boolean = false,
        schoolStart: string = "07:30",
        schoolEnd: string = "15:00",

        classTimesEnabled: boolean = false,
        classes: ClassSchedule[] = [],

        additionalSchedulesEnabled: boolean = false,
        schedules: AdditionalSchedule[] = [],
        selectedSchedule?: AdditionalSchedule,

        showDayProgress: boolean = false,
        showClassProgress: boolean = false
    ) {
        this.schoolTimeSettings = {
            enabled: schoolEnabled,
            schoolStart,
            schoolEnd
        };

        this.classTimes = {
            enabled: classTimesEnabled,
            classes
        };

        this.additionalSchedules = {
            enabled: additionalSchedulesEnabled,
            schedules,
            selectedSchedule
        };

        this.progressBars = {
            showDayProgress,
            showClassProgress
        };
    }

    toPlainObject() {
        return {
            schoolTimeSettings: this.schoolTimeSettings,
            classTimes: this.classTimes,
            additionalSchedules: this.additionalSchedules,
            progressBars: this.progressBars
        };
    }

    static fromPlainObject(obj: any): Settings {
        return new Settings(
            obj.schoolTimeSettings?.enabled ?? false,
            obj.schoolTimeSettings?.schoolStart ?? "07:30",
            obj.schoolTimeSettings?.schoolEnd ?? "15:00",

            obj.classTimes?.enabled ?? false,
            obj.classTimes?.classes ?? [],

            obj.additionalSchedules?.enabled ?? false,
            obj.additionalSchedules?.schedules ?? [],
            obj.additionalSchedules?.selectedSchedule,

            obj.progressBars?.showDayProgress ?? false,
            obj.progressBars?.showClassProgress ?? false
        );
    }
}

export default Settings;

export type {
    ClassTime,
    ClassSchedule,
    AdditionalSchedule
};