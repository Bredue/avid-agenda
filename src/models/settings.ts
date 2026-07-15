interface CustomSchedule {
    label: string;
    start: string;
    end: string;
}

interface ClassTime {
    start: string;
    end: string;
}

interface ClassSchedule {
    [classKey: string]: ClassTime;
}

class Settings {

    schoolTimeSettings: {
        enabled: boolean;
        schoolStart: string;
        schoolEnd: string;
        additionalSchedules: CustomSchedule[];
    };

    classTimes: {
        enabled: boolean;
        classes: ClassSchedule[];
    };

    progressBars: {
        showDayProgress: boolean;
        showClassProgress: boolean;
    };

    constructor(
        schoolEnabled: boolean = false,
        schoolStart: string = "07:30",
        schoolEnd: string = "15:00",
        additionalSchedules: CustomSchedule[] = [],
        classTimesEnabled: boolean = false,
        classes: ClassSchedule[] = [],
        showDayProgress: boolean = false,
        showClassProgress: boolean = false
    ) {
        this.schoolTimeSettings = {
            enabled: schoolEnabled,
            schoolStart,
            schoolEnd,
            additionalSchedules
        };

        this.classTimes = {
            enabled: classTimesEnabled,
            classes
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
            progressBars: this.progressBars
        };
    }

    static fromPlainObject(obj: any): Settings {

        return new Settings(
            obj.schoolTimeSettings?.enabled ?? false,
            obj.schoolTimeSettings?.schoolStart ?? "07:30",
            obj.schoolTimeSettings?.schoolEnd ?? "15:00",
            obj.schoolTimeSettings?.additionalSchedules ?? [],
            obj.classTimes?.enabled ?? false,
            obj.classTimes?.classes ?? [],
            obj.progressBars?.showDayProgress ?? false,
            obj.progressBars?.showClassProgress ?? false

        );
    }
}

export default Settings;