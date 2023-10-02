import {allProjects} from './index.js';
import Project from './project.js';

export default class Task {
    // static taskID = parseInt(localStorage.getItem("taskID"), 10) || 1;
    constructor(title, description, due_date, projectID, priority, completed, id) {
    // These variables are private because they are within the closure of the constructor.
        let _title = title;
        let _description = description;
        let _due_date = due_date;
        let _projectID = projectID;
        let _priority = priority;
        let _completed = completed;
        let _id = id;
        // localStorage.setItem("taskID", Task.taskID);
        
        // Public methods to access private properties
        this.getTitle = () => _title;
        this.getDescription = () => _description;
        this.getDueDate = () => _due_date;
        this.getProjectID = () => _projectID;
        this.getPriority = () => _priority;
        this.getStatus = () => _completed;
        this.getId = () => _id;
        this.addTaskToProject();
    }

    serialize() {
        return {title: this.getTitle(), description: this.getDescription(), due_date: this.getDueDate(), projectID: this.getProjectID(), priority: this.getPriority(), completed: this.getStatus(), id: this.getId()}
    }

    static deserialize(json) {
        const task = new Task(json.title, json.description, json.due_data, json.projectID, json.priority, json.completed, json.id);
        return task;
    }

    addTaskToProject() {
        allProjects.forEach((project) => {
            if (project.id === this._projectID) {
                project.addTask(this);
            }
        })
    }

    setID(newID) {
        this._id = newID;
    }

    // Public methods to modify private properties
    setTitle(newTitle) {
        _title = newTitle;
    }

    setDescription(newDescription) {
        _description = newDescription;
    }

    setDueDate(newDueDate) {
        _due_date = newDueDate;
    }

    setProject(newProject) {
        _project = newProject;
    }

    setPriority(newPriority) {
        _priority = newPriority;
    }

    setStatus(completed) {
        _completed = completed;
    }
}