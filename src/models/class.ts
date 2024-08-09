import uniqid from 'uniqid';

class Class {
    name: string;
    period: string;
    id: string;

    constructor(name: string, period: string) {
        this.name = name;
        this.period = period;
        this.id = uniqid();
    }

    getClassName(): string {
        return `${this.name}`;
    }

    getClassPeriod(): string {
        return `${this.period}`;
    }

    getId(): string {
        return `${this.id}`;
    }

    // for storing and retrieving objects from local storage
    toPlainObject(): { name: string; period: string; id: string } {
        return {
            name: this.name,
            period: this.period,
            id: this.id
        };
    }

    static fromPlainObject(obj: { name: string; period: string; id: string }): Class {
        const instance = new Class(obj.name, obj.period);
        instance.id = obj.id; // Use the ID from the object
        return instance;
    }
}

export default Class;