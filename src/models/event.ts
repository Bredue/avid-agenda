import uniqid from 'uniqid';

class Event {
    assignedClass: string;
    name: string;
    date: string;
    id: string;

    constructor(assignedClass: string, name: string, date: string) {
        this.assignedClass = assignedClass;
        this.name = name;
        this.date = date;
        this.id = uniqid();
    }

    getClass(): string {
        return `${this.assignedClass}`;
    }

    getEventName(): string {
        return `${this.name}`;
    }

    getEventDate(): string {
        return `${this.date}`;
    }

    getId(): string {
        return `${this.id}`;
    }

    // for storing and retrieving objects from local storage
    toPlainObject(): { assignedClass: string; name: string; date: string; id: string } {
        return {
            assignedClass: this.assignedClass,
            name: this.name,
            date: this.date,
            id: this.id
        };
    }

    static fromPlainObject(obj: { assignedClass: string; name: string; date: string; id: string }): Event {
        const instance = new Event(obj.assignedClass, obj.name, obj.date);
        instance.id = obj.id; // Use the ID from the object
        return instance;
    }
}

export default Event;