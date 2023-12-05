import { allProjects, projectsUL, tasksUL} from ".";
import Project from "./project.js";
import { isBefore, endOfToday } from "date-fns";
import Task from "./task.js";
import * as local_storage from "./local-storage.js";
import idmanager from "./idmanager.js";

const { jsonToProjectArray, storeProjectsToLocalStorage, deserializeTasks } =
  local_storage;
const addTaskModal = document.getElementById("add-task");
const addProjectModal = document.getElementById("add-project");
const today = endOfToday();

export const createProject = (event) => {
  event.preventDefault();
  let projectTitle = document.getElementById("project-title").value;
  let projectColour = document.getElementById("project-colour").value;
  if (!projectTitle || !projectColour) {
    alert("Please provide a valid title and colour");
    // DEBUG: Unable to view tasks by project after failed form submission
    // unless page refreshes
    return;
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

export const initializeScreen = () => {
  projectsUL.innerHTML = "";
  tasksUL.innerHTML = "";
  allProjects.forEach((project) => {
    populateProjectsList(project);
    project.tasks.forEach((task) => {
      if (isBefore(today, task.getDueDate()) && !task.getStatus()) {
        createTaskLI(task);
      }
    });
  });
};

// TODO: Maybe pass allProjects to this method instead of calling this method
// in a loop that iterates through allProjects(Move loop inside method body 
// instead of before method call)
export const populateProjectsList = (project) => {
  if (project instanceof Project) {
    const projectItem = document.createElement("li");
    const projectLink = document.createElement("span");
    projectLink.classList.add("project-item");
    projectLink.textContent = `${project.title}`;
    projectLink.dataset.projectId = project.id;
    projectItem.appendChild(projectLink);
    projectsUL.appendChild(projectItem);
  } else {
    throw new Error("Not a project.");
  }
};

export const createTaskLI = (task) => {
  // TODO: Receive state parameter and populate tasks based on current state
  if (task instanceof Task) {
    const taskItem = document.createElement("li");
    const status = document.createElement("input");
    status.type = "checkbox";
    status.id = "task-status";
    if (task.getStatus()) {
      status.checked = true;
      taskItem.classList.add("completed");
    }
    status.dataset.taskid = task.getId();
    taskItem.appendChild(status);
    const title = document.createElement("label");
    title.textContent = task.getTitle();
    title.htmlFor = "task-status";
    taskItem.appendChild(title);
    taskItem.style.setProperty("--project-colour", `${task.getColor()}`);
    // TODO: Add edit and delete buttons
    const contextMenu = document.createElement("div");
    contextMenu.innerHTML = "<button>Edit</button><button>Delete</button>";
    contextMenu.classList.add("hide", "menu");
    taskItem.appendChild(contextMenu);
    const showMenuButton = document.createElement("button");
    showMenuButton.textContent = "︙";
    showMenuButton.classList.add("options");
    showMenuButton.dataset.taskid = task.getId();
    taskItem.appendChild(showMenuButton);
    tasksUL.appendChild(taskItem);
  } else {
    throw new Error("Not a task.");
  }
};