export default class Project {
    static projectID = 0;
    
    constructor(title, colour) {
        this.title = title;
        this._colour = colour;
        this.tasks = [];
        this.id = this.projectID++;
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
}