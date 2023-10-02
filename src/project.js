import Task from './task.js'

export default class Project {
    static projectID = parseInt(localStorage.getItem("projectID"), 10) || 1;;
    
    constructor(title, colour, id) {
        this.title = title;
        this._colour = colour;
        this.tasks = [];
        this.id = id;
        // localStorage.setItem("projectID", Project.projectID);
    }

    serialize() {
        return {title: this.title, colour: this._colour, tasks: this.tasks.map(task => task.serialize()), id: this.id}
    }

    static deserialize(json) {
        const project = new Project(json.title, json.colour, json.id);
        project.tasks = json.tasks.map(task => Task.deserialize(task));
        return project;
    }
    get colour() {
        return this._colour;
    }

    set colour(hex) {
        this._colour = hex;
    }

    addTask(task) {
        this.tasks.push(task);
    }

    deleteTask(task) {
        const indexToRemove = this.tasks.indexOf(task);
        if (indexToRemove !== -1) {
            this.tasks.splice(indexToRemove, 1);
        } else {
            throw new console.error("Task not found");
        }
    }

    getID() {
        return this.id;
    }
}