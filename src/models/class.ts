import uniqid from 'uniqid';
import Event from './event';
import Agenda from './agenda';

class Class {
    agendas: Agenda[];
    events: Event[];
    name: string;
    period: string;
    id: string;

    constructor(agendas: Agenda[], events: Event[], name: string, period: string) {
        this.agendas = agendas;
        this.events = events;
        this.name = name;
        this.period = period;
        this.id = uniqid();
    }

    getClassAgendas(): Agenda[] {
        return this.agendas;
    }

    getClassEvents(): Event[] {
        return this.events;
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
    toPlainObject(): { agendas: Agenda[]; events: Event[]; name: string; period: string; id: string } {
        return {
            agendas: this.agendas,
            events: this.events,
            name: this.name,
            period: this.period,
            id: this.id
        };
    }

    static fromPlainObject(obj: { agendas: Agenda[]; events: Event[]; name: string; period: string; id: string }): Class {
        const instance = new Class(obj.agendas, obj.events, obj.name, obj.period);
        instance.id = obj.id; // Use the ID from the object
        return instance;
    }
}

export default Class;