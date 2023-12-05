class IdManager {
  constructor() {
    this.projectIDCounter =
      Number(localStorage.getItem("projectIDCounter")) ?? -1;
    this.taskIDCounter = Number(localStorage.getItem("taskIDCounter")) ?? -1;
  }

  getNextProjectId() {
    this.projectIDCounter++;
    localStorage.setItem("projectIDCounter", this.projectIDCounter);
    return this.projectIDCounter;
  }

  getNextTaskId() {
    this.taskIDCounter++;
    localStorage.setItem("taskIDCounter", this.taskIDCounter);
    return this.taskIDCounter;
  }
}

const idmanager = new IdManager();

export default idmanager;