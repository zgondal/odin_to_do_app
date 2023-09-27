import {allProjects} from './index.js';
import Project from './project.js';

export default class Task {
    static taskId = 0;
    constructor(title, description, due_date, project, priority) {
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
        let _completed = false;
        let _id = taskId++;
        
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