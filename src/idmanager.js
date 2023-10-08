export default class IdManager {
    constructor() {
      this.projectIDCounter = Number(localStorage.getItem("projectIDCounter")) ?? 0;
      this.taskIDCounter = Number(localStorage.getItem("taskIDCounter")) ?? 0;
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