export default class Project {
    static projectID = null;
    
    constructor(title, colour) {
        this.title = title;
        this._colour = colour;
        this.tasks = [];
        this.id = Project.projectID++;
        localStorage.setItem("projectID", Project.projectID);
    }

    serialize() {
        return {title: this.title, colour: this._colour, tasks: this.tasks, id: this.id}
    }

    static deserialize(json) {
        const project = new Project(json.title, json.colour);
        project.tasks = json.tasks;
        project.id = json.id;
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