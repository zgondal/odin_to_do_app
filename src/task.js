import {allProjects} from './index.js';
import format from 'date-fns';

export default class Task {
    constructor(title, description, due_date, projectID, priority, completed, id) {
    // These variables are private because they are within the closure of the constructor.
        let _title = title;
        let _description = description;
        let _due_date = new Date(due_date);
        let _projectID = projectID;
        let _priority = priority;
        let _completed = completed;
        let _id = id;
        
        // Public methods to access private properties
        this.getTitle = () => _title;
        this.getDescription = () => _description;
        this.getDueDate = () => _due_date;
        this.getProjectID = () => _projectID;
        this.getPriority = () => _priority;
        this.getStatus = () => _completed;
        this.getID = () => _id;
        this.addTaskToProject();
        console.log(`Task created: ${this.getTitle()}`);
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
                console.log(`Task added to project: ${project.title}`);
            }
        });
    }

    setID(newID) {
        this._id = newID;
    }

    // Public methods to modify private properties
    setTitle(newTitle) {
        _title = newTitle;
    }

    setDescription(newDescription) {
        this._description = newDescription;
    }

    setDueDate(newDueDate) {
        _due_date = newDueDate;
    }

    setProjectID(newProjectID) {
        allProjects.forEach(project => {
            if (newProjectID === project.id) {
                project.addTask(this);
            } else {
                throw new Error("New project not found.");
            }
        })
        allProjects.forEach((project) => {
            if (this._projectID === project.id) {
                project.deleteTask(this);
            }
        })
        this._projectID = newProjectID;
    }

    setPriority(newPriority) {
        _priority = newPriority;
    }

    setStatus(completed) {
        console.log(`Setting status to: ${completed}`);
        this._completed = completed;
        console.log(`Status set to: ${this._completed}`);
    }
}
