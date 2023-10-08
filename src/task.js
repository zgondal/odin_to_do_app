import { allProjects } from './index.js';

export default class Task {
    constructor(title, description, due_date, projectID, priority, completed, id) {
    // These variables are private because they are within the closure of the constructor.
        this._title = title;
        this._description = description;
        this._due_date = new Date(due_date);
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
        this.addTaskToProject(projectID);
        this.getColor = () => this._color;
        console.log(`Task created: ${this.getTitle()} in project: ${this.getProjectID()}`);
    }

    serialize() {
        return {title: this.getTitle(), description: this.getDescription(), due_date: this.getDueDate(), projectID: this.getProjectID(), priority: this.getPriority(), completed: this.getStatus(), id: this.getID()}
    }

    static deserialize(json) {
        const task = new Task(json.title, json.description, json.due_date, json.projectID, json.priority, json.completed, json.id);
        return task;
    }

    addTaskToProject(projectID) {
        allProjects.forEach(project => {
            console.log(project.title);
            if (project.id === parseInt(projectID, 10)) {
                this._projectID = projectID;
                this._color = project.color;
                project.addTask(this);
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
