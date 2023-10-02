export default class IdManager {
    constructor() {
      this.projectIDCounter = parseInt(localStorage.getItem("projectIDCounter"), 10) || 1;
      this.taskIDCounter = parseInt(localStorage.getItem("taskIDCounter"), 10) || 1;
    }
  
    getNextProjectId() {
      localStorage.setItem("projectIDCounter", this.projectIDCounter++);
      return this.projectIDCounter;
    }
  
    getNextTaskId() {
      localStorage.setItem("taskIDCounter", this.taskIDCounter++);
      return this.taskIdCounter;
      }
  }