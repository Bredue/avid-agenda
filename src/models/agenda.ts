import uniqid from 'uniqid';

type Tasks = { id: string; task: string; duration: string }[]

interface SVGOption {
    id: string;
    svg: string;
    alt: string;
  }

class Agenda {
    assignedClasses: string[];
    date: string;
    tasks: Tasks;
    why: string;
    essentialQuestion: string;
    homework: string;
    selectedSvgs: SVGOption[];
    id: string;

    constructor(
        assignedClasses: string[], 
        date: string, 
        tasks: Tasks, 
        why: string, 
        essentialQuestion: string, 
        homework: string, 
        selectedSvgs: SVGOption[]
    ) {
        this.assignedClasses = assignedClasses;
        this.date = date;
        this.tasks = tasks;
        this.why = why;
        this.essentialQuestion = essentialQuestion;
        this.homework = homework;
        this.selectedSvgs = selectedSvgs;
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
    toPlainObject(): { 
        assignedClasses: string[],
        date: string, 
        tasks: Tasks, 
        why: string,
        essentialQuestion: string,
        homework: string,
        selectedSvgs: SVGOption[],
        id: string 
    } {
        return {
            assignedClasses: this.assignedClasses,
            date: this.date,
            tasks: this.tasks,
            why: this.why,
            essentialQuestion: this.essentialQuestion,
            homework: this.homework,
            selectedSvgs: this.selectedSvgs,
            id: this.id
        };
    }

    static fromPlainObject(
        obj: { 
            assignedClasses: string[], 
            date: string, 
            tasks: Tasks, 
            why: string, 
            essentialQuestion: string, 
            homework: string, 
            selectedSvgs: SVGOption[], 
            id: string 
        }): Agenda {
            const instance = new Agenda(
                obj.assignedClasses, 
                obj.date, 
                obj.tasks,
                obj.why,
                obj.essentialQuestion,
                obj.homework,
                obj.selectedSvgs,
            );
            instance.id = obj.id;
            return instance;
    }
}

export default Agenda;