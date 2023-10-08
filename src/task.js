import {allProjects} from './index.js';

export default class Task {
    constructor(title, description, due_date, projectID, priority, completed, id) {
    // These variables are private because they are within the closure of the constructor.
        this._title = title;
        this._description = description;
        this._due_date = new Date(due_date);
        this._projectID = projectID;
        this._priority = priority;
        this._completed = completed;
        this._id = id;
        
        // Public methods to access private properties
        this.getTitle = () => this._title;
        this.getDescription = () => this._description;
        this.getDueDate = () => this._due_date;
        this.getProjectID = () => this._projectID;
        this.getPriority = () => this._priority;
        this.getStatus = () => this._completed;
        this.getID = () => this._id;
        this.addTaskToProject();
        // console.log(`Task created: ${this.getTitle()}`);
    }

    serialize() {
        return {title: this.getTitle(), description: this.getDescription(), due_date: this.getDueDate(), projectID: this.getProjectID(), priority: this.getPriority(), completed: this.getStatus(), id: this.getID()}
    }

    static deserialize(json) {
        const task = new Task(json.title, json.description, json.due_date, json.projectID, json.priority, json.completed, json.id);
        return task;
    }

    addTaskToProject() {
        allProjects.forEach(project => {
            if (project.id === parseInt(this.getProjectID(), 10)) {
                project.addTask(this);
                this._color = project.colour;
                console.log(`Task added to project: ${project.title}`);
            }
        });
    }

    setID(newID) {
        this._id = newID;
    }

    // Public methods to modify private properties
    setTitle(newTitle) {
        this._title = newTitle;
    }

    setDescription(newDescription) {
        this._description = newDescription;
    }

    setDueDate(newDueDate) {
        this._due_date = new Date(newDueDate);
    }

    setProjectID(newProjectID) {
        allProjects.forEach(project => {
            if (newProjectID === project.id) {
                project.addTask(this);
                return;
            }
            throw new Error("New project not found.");
        })
        allProjects.forEach((project) => {
            if (this._projectID === project.id) {
                project.deleteTask(this);
            }
        })
        this._projectID = newProjectID;
    }

    setPriority(newPriority) {
        this._priority = newPriority;
    }

    setStatus(completed) {
        console.log(`Setting status to: ${completed}`);
        this._completed = completed;
        console.log(`Status set to: ${this._completed}`);
    }
}
