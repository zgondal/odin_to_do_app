export default class IdManager {
    constructor() {
      this.projectIDCounter = parseInt(localStorage.getItem("projectIDCounter"), 10) || 1;
      this.taskIDCounter = parseInt(localStorage.getItem("taskIDCounter"), 10) || 1;
    }
  
    getNextProjectId() {
      this.projectIDCounter++;
      localStorage.setItem("projectIDCounter", this.projectIDCounter);
      return this.projectIDCounter - 1;
    }
  
    getNextTaskId() {
      this.taskIDCounter++;
      localStorage.setItem("taskIDCounter", this.taskIDCounter);
      return this.taskIDCounter - 1;
      }
  }