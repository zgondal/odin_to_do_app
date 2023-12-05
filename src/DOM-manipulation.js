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
    const editButton = document.createElement("button");
    editButton.setAttribute("id", "edit-task");
    editButton.textContent = "Edit";
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("id", "delete-task");
    deleteButton.textContent = "Delete";
    contextMenu.classList.add("hide", "menu");
    contextMenu.dataset.taskid = task.getId();
    taskItem.appendChild(contextMenu);
    const showMenuButton = document.createElement("button");
    showMenuButton.textContent = "︙";
    showMenuButton.classList.add("options");
    taskItem.appendChild(showMenuButton);
    tasksUL.appendChild(taskItem);
  } else {
    throw new Error("Not a task.");
  }
};

export const populateEditTaskForm = function(task) {
  const editTitle = document.getElementById("edit-task-title");
  const editDescription = document.getElementById("edit-description");
  const editDate = document.getElementById("edit-due-date");
  const editProject = document.getElementById("edit-project");
  const editPriority = document.getElementById("edit-priority");
  editTitle.value = task.getTitle();
  editDescription.value = task.getDescription();
  editDate.value = task.getDueDate();
  editProject.innerHTML = "";
  allProjects.forEach((project) => {
    const projectOption = document.createElement("option");
    projectOption.setAttribute("value", `${project.getId()}`);
    projectOption.textContent = `${project.title}`;
    if (project.getId() === task.getProjectId()) {
      projectOption.setAttribute("selected", true);
    }
    editProject.appendChild(projectOption);
  });
  editPriority.value = task.getPriority();
}

export const editTask = (task) => {
  const title = document.getElementById("edit-task-title").value;
  const description = document.getElementById("edit-description").value;
  const date = document.getElementById("edit-due-date").value;
  const project = document.getElementById("edit-project").value;
  const priority = document.getElementById("edit-priority").value;
  task.setTitle(title);
  task.setDescription(description);
  task.setDueDate(date);
  task.setProjectId(project);
  task.setPriority(priority);
  storeProjectsToLocalStorage(allProjects);
}