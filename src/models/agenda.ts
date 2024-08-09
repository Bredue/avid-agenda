import uniqid from 'uniqid';

type Tasks = { id: string; task: string; duration: string }[]

class Agenda {
    assignedClasses: string[];
    date: string;
    tasks: Tasks;
    id: string;

    constructor(assignedClasses: string[], date: string, tasks: Tasks) {
        this.assignedClasses = assignedClasses;
        this.date = date;
        this.tasks = tasks;
        this.id = uniqid();
    }

    getAgendaClasses(): string[] {
        return this.assignedClasses;
    }

    getAgendaDate(): string {
        return `${this.date}`;
    }

    getAgendaTasks(): Tasks {
        return this.tasks;
    }

    getId(): string {
        return `${this.id}`;
    }

    // for storing and retrieving objects from local storage
    toPlainObject(): { assignedClasses: string[], date: string, tasks: Tasks, id: string } {
        return {
            assignedClasses: this.assignedClasses,
            date: this.date,
            tasks: this.tasks,
            id: this.id
        };
    }

    static fromPlainObject(obj: { assignedClasses: string[], date: string, tasks: Tasks, id: string }): Agenda {
        const instance = new Agenda(obj.assignedClasses, obj.date, obj.tasks);
        instance.id = obj.id;
        return instance;
    }
}

export default Agenda;