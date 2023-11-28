import { allProjects } from "./index.js";

export default class Task {
  constructor(
    title,
    description,
    due_date,
    projectId,
    priority,
    completed,
    id,
  ) {
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
    this.getProjectId = () => this._projectId;
    this.getPriority = () => this._priority;
    this.getStatus = () => this._completed;
    this.getId = () => this._id;
    this.getColor = () => this._color;
    this.addTaskToProject(projectId);
  }

  serialize() {
    return {
      title: this.getTitle(),
      description: this.getDescription(),
      due_date: this.getDueDate(),
      projectId: this.getProjectId(),
      priority: this.getPriority(),
      completed: this.getStatus(),
      id: this.getId(),
    };
  }

  static deserialize(json) {
    const task = new Task(
      json.title,
      json.description,
      json.due_date,
      json.projectId,
      json.priority,
      json.completed,
      json.id,
    );
    return task;
  }

  addTaskToProject(projectId) {
    allProjects.forEach((project) => {
      if (project.id === parseInt(projectId, 10)) {
        this._projectId = projectId;
        this._color = project.color;
        project.addTask(this);
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

  setProjectId(newProjectId) {
    allProjects.forEach((project) => {
      if (newProjectId === project.id) {
        project.addTask(this);
        return;
      }
      throw new Error("New project not found.");
    });
    allProjects.forEach((project) => {
      if (this._projectId === project.id) {
        project.deleteTask(this);
        return;
      }
    });
    this._projectId = newProjectID;
  }

  setPriority(newPriority) {
    this._priority = newPriority;
  }

  setStatus(completed) {
    this._completed = completed;
  }
}
