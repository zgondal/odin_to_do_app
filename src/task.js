import {allProjects} from './index.js';
import Project from './project.js';

export default class Task {
    static taskID = null;
    constructor(title, description, due_date, project, priority, completed) {
    // These variables are private because they are within the closure of the constructor.
        let _title = title;
        let _description = description;
        let _due_date = due_date;
        if (allProjects.includes(project)) {
            let _project = project;
        } else {
            throw new Error("Project not found.");
        }
        let _priority = priority;
        let _completed = completed;
        let _id = Task.taskID++;
        localStorage.setItem("taskID", Task.taskID);
        
        // Public methods to access private properties
        this.getTitle = () => _title;
        this.getDescription = () => _description;
        this.getDueDate = () => _due_date;
        this.getProject = () => _project;
        this.getPriority = () => _priority;
        this.getStatus = () => _completed;
        this.getId = () => _id;
        project.addTask(this);
    }

    serialize() {
        return {title: this.getTitle(), description: this.getDescription(), due_date: this.getDueDate(), project: this.getProject(), priority: this.getPriority(), completed: this.getStatus(), id: this.getId()}
    }

    static deserialize(json) {
        const task = new Task(json.title, json.description, json.due_data, json.project, json.priority, json.completed);
        task.setID(json.id);
        return task;
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