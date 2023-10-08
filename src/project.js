import Task from './task.js'
import * as local_storage from './local-storage.js'
import { allProjects } from './index.js';


const { jsonToProjectArray, storeProjectsToLocalStorage } = local_storage;

export default class Project {
    
    constructor(title, color, id) {
        this.title = title;
        this._color = color;
        this.tasks = [];
        this.id = id;
    }

    serialize() {
        return {title: this.title, color: this._color, tasks: this.tasks.map(task => task.serialize()), id: this.id}
    }

    static deserialize(json) {
        const project = new Project(json.title, json.color, json.id);
        return project;
    }
    get color() {
        return this._color;
    }

    set color(hex) {
        this._color = hex;
    }

    addTask(task) {
        this.tasks.push(task);
    }

    deleteTask(task) {
        const indexToRemove = this.tasks.indexOf(task);
        if (indexToRemove !== -1) {
            this.tasks.splice(indexToRemove, 1);
        } else {
            throw new Error("Task not found");
        }
    }

    getID() {
        return this.id;
    }

    getTasks() {
        return this.tasks;
    }
}