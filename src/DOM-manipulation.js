import { allProjects, projectsUL, tasksUL, idmanager } from ".";
import Project from "./project.js";
import { isBefore, endOfToday, endOfTomorrow } from "date-fns";
import Task from "./task.js";
import * as local_storage from "./local-storage.js";

const { jsonToProjectArray, storeProjectsToLocalStorage, deserializeTasks } =
  local_storage;
const addTaskModal = document.getElementById("add-task");
const addProjectModal = document.getElementById("add-project");
const today = endOfToday();
const tomorrow = endOfTomorrow();
export const createProject = (event) => {
  event.preventDefault();
  let projectTitle = document.getElementById("project-title").value;
  let projectColour = document.getElementById("project-colour").value;
  if (!projectTitle || !projectColour) {
    throw new Error("Please provide a valid title and colour");
  }
  let projectToAdd = new Project(
    projectTitle,
    projectColour,
    idmanager.getNextProjectId(),
  );
  addProjectModal.close();
  allProjects.push(projectToAdd);
  storeProjectsToLocalStorage(allProjects);
};

export const initializeScreen = () => {
  projectsUL.innerHTML = "";
  tasksUL.innerHTML = "";
  allProjects.forEach((project) => {
    populateProjectsList(project);
    project.tasks.forEach((task) => {
      if (isBefore(today, task.getDueDate()) && !task.getStatus()) {
        populateTasksList(task);
      }
    });
  });
};

export const populateProjectsList = (project) => {
  if (project instanceof Project) {
    const projectItem = document.createElement("li");
    const projectLink = document.createElement("span");
    projectLink.classList.add("project-item");
    projectLink.textContent = `${project.title}`;
    projectItem.appendChild(projectLink);
    projectLink.dataset.projectID = project.id;
    projectsUL.appendChild(projectItem);
  } else {
    throw new Error("Not a project.");
  }
};

export const populateTasksList = (task) => {
  // TODO: Receive state parameter and populate tasks according to current state
  if (task instanceof Task) {
    const taskItem = document.createElement("li");
    const status = document.createElement("input");
    status.type = "checkbox";
    status.id = "task-status";
    if (task.getStatus()) {
      status.checked = true;
      taskItem.classList.add("completed");
    }
    taskItem.appendChild(status);
    const title = document.createElement("label");
    title.textContent = task.getTitle();
    title.htmlFor = "task-status";
    taskItem.appendChild(title);
    status.dataset.taskid = task.getId();
    taskItem.style.setProperty("--project-colour", `${task.getColor()}`);
    // TODO: Add edit and delete buttons
    const menu = document.createElement("div");
    menu.innerHTML = "<button>Edit</button><button>Delete</button>";
    menu.classList.add("hide", "menu");
    taskItem.appendChild(menu);
    const showMenu = document.createElement("button");
    showMenu.textContent = "︙";
    showMenu.classList.add("options");
    showMenu.dataset.taskid = task.getId();
    taskItem.appendChild(showMenu);
    tasksUL.appendChild(taskItem);
  } else {
    throw new Error("Not a task.");
  }
};

export const createTask = (event) => {
  event.preventDefault();
  const taskTitle = document.getElementById("task-title").value;
  const taskDescription = document.getElementById("description").value;
  const taskDate = document.getElementById("due-date").value;
  const taskProjectID = document.getElementById("projects").value;
  const taskPriority = document.getElementById("priority").value;
  let taskToAdd = new Task(
    taskTitle,
    taskDescription,
    taskDate,
    taskProjectID,
    taskPriority,
    false,
    idmanager.getNextTaskId(),
  );
  addTaskModal.close();
  storeProjectsToLocalStorage(allProjects);
};
