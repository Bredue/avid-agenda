import uniqid from 'uniqid';

class Task {
    assignedClass: string;
    task: string;
    date: string;
    duration: string;
    id: string;

    constructor(assignedClass: string, task: string, date: string, duration: string) {
        this.assignedClass = assignedClass;
        this.task = task;
        this.date = date;
        this.duration = duration;
        this.id = uniqid();
    }

    getClass(): string {
        return `${this.assignedClass}`;
    }

    getTask(): string {
        return `${this.task}`;
    }

    getTaskDate(): string {
        return `${this.date}`;
    }

    getTaskDuration(): string {
        return `${this.duration}`;
    }

    getId(): string {
        return `${this.id}`;
    }

    // for storing and retrieving objects from local storage
    toPlainObject(): { assignedClass: string; task: string; date: string; duration: string; id: string } {
        return {
            assignedClass: this.assignedClass,
            task: this.task,
            date: this.date,
            duration: this.duration,
            id: this.id
        };
    }

    static fromPlainObject(obj: { assignedClass: string; task: string; date: string; duration: string; id: string }): Task {
        const instance = new Task(obj.assignedClass, obj.task, obj.date, obj.duration);
        instance.id = obj.id; // Use the ID from the object
        return instance;
    }
}

export default Task;