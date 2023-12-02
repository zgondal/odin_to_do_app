import "./style.scss";
import Project from "./project.js";
import Task from "./task.js";
import { isBefore, endOfToday, endOfTomorrow, getWeek } from "date-fns";
import IdManager from "./idmanager.js";
import * as local_storage from "./local-storage.js";
import * as DOM_manipulation from "./DOM-manipulation.js";

const {
  createProject,
  initializeScreen,
  populateProjectsList,
  populateTasksList,
  createTask,
} = DOM_manipulation;
const { jsonToProjectArray, storeProjectsToLocalStorage } =
  local_storage;
const todayButton = document.getElementById("today");
const weekButton = document.getElementById("week");
const projectsUL = document.querySelector(".projects ul");
const tasksUL = document.querySelector(".tasks ul");
const showProjectModalButton = document.getElementById("create-project");
const submitNewProject = document.getElementById("submit-project");
const cancelNewProject = document.getElementById("cancel-project");
const addProjectModal = document.getElementById("add-project");
const projectForm = document.getElementById("project-form");
const taskForm = document.getElementById("task-form");
const addTaskModal = document.getElementById("add-task");
const showTaskModalButton = document.getElementById("create-task");
const cancelNewTask = document.getElementById("cancel-task");
const submitNewTask = document.getElementById("submit-task");
const idmanager = new IdManager();
const checkboxes = document.querySelectorAll("input[type=checkbox]");
const completed = document.getElementById("completed");
// TODO: Create enum for view
let allProjects = [];
let today = endOfToday();
let tomorrow = endOfTomorrow();
let currentView = "today";

const initializeStorage = () => {
  if (localStorage.getItem("allProjects")) {
    allProjects = jsonToProjectArray();
  } else {
    const defaultProject = new Project(
      "Default",
      "#000000",
      idmanager.getNextProjectId(),
    );
    allProjects.push(defaultProject);
    storeProjectsToLocalStorage(allProjects);
  }
};

const getThisWeeksTasks = () => {
  tasksUL.innerHTML = "";
  allProjects.forEach((project) => {
    project.tasks.forEach((task) => {
      if (getWeek(task.getDueDate()) <= getWeek(today)) {
        populateTasksList(task);
      }
    });
  });
};

const toggleTaskStatus = (event) => {
  const taskToToggle = event.target;
  const targetTask = parseInt(taskToToggle.dataset.taskid, 10);
  if (taskToToggle.checked) {
    allProjects.forEach((project) => {
      project.tasks.forEach((task) => {
        if (task.getId() === targetTask) task.setStatus(true);
      });
    });
    taskToToggle.parentNode.classList.add("completed");
  } else {
    allProjects.forEach((project) => {
      project.tasks.forEach((task) => {
        if (task.getId() === targetTask) task.setStatus(false);
      });
    });
    taskToToggle.parentNode.classList.remove("completed");
  }
  storeProjectsToLocalStorage(allProjects);
};

const showContextMenu = (event) => {
  const taskId = event.target.dataset.taskid;
  const menu = event.target.previousElementSibling;
  menu.classList.toggle("hide");
};

document.addEventListener("DOMContentLoaded", () => {
  initializeStorage();
  // TODO: Do I need this write right after initializeStorage?
  // storeProjectsToLocalStorage(allProjects);
  initializeScreen();
  //TODO: Move this to separate function
  const projectsItems = document.querySelectorAll(".project-item");
  projectsItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      currentView = `project-${item.dataset.projectId}`;
      const selectedProject = event.target.dataset.projectId;
      allProjects.forEach((project) => {
        if (project.id === parseInt(selectedProject, 10)) {
          tasksUL.innerHTML = "";
          project.tasks.forEach((task) => {
            populateTasksList(task);
          });
        }
      });
    });
  });
});
//TODO: Move this to DOM-Manipulation
showProjectModalButton.addEventListener("click", () => {
  addProjectModal.showModal();
});
submitNewProject.addEventListener("click", (event) => {
  createProject(event);
  projectForm.reset();
  projectsUL.innerHTML = "";
  allProjects.forEach((project) => {
    populateProjectsList(project);
  });
});
cancelNewProject.addEventListener("click", () => {
  projectForm.reset();
  addProjectModal.close();
});
weekButton.addEventListener("click", () => {
  currentView = "week";
  console.log(`current view: ${currentView}`);
  getThisWeeksTasks();
});
showTaskModalButton.addEventListener("click", () => {
  addTaskModal.showModal();
  // Populate projects dropdown in new task form with all projects
  const selectProjectDropdown = document.getElementById("projects");
  selectProjectDropdown.innerHTML = "";
  allProjects.forEach((project) => {
    const projectOption = document.createElement("option");
    projectOption.setAttribute("value", `${project.getId()}`);
    projectOption.textContent = `${project.title}`;
    selectProjectDropdown.appendChild(projectOption);
  });
});
cancelNewTask.addEventListener("click", () => {
  taskForm.reset();
  addTaskModal.close();
});
submitNewTask.addEventListener("click", (event) => {
  const due_date = document.getElementById("due-date").value;

  // TODO: Prevent form submission if any of the fields are blank
  if (due_date.trim() === "") {
    event.preventDefault();
    alert("Please select a date and time.");
  } else {
    createTask(event);
    tasksUL.innerHTML = "";
    allProjects.forEach((project) => {
      project.tasks.forEach((task) => {
        if (isBefore(task.getDueDate(), today)) {
          populateTasksList(task);
        }
      });
    });
    taskForm.reset();
  }
});
todayButton.addEventListener("click", () => {
  currentView = "today";
  console.log(`current view: ${currentView}`);
  tasksUL.innerHTML = "";
  allProjects.forEach((project) => {
    const projectTasks = project.getTasks();
    projectTasks.forEach((task) => {
      if (isBefore(task.getDueDate(), today) && !task.getStatus()) {
        populateTasksList(task);
      }
    });
  });
});

tasksUL.addEventListener("click", (event) => {
  // Check if the target is the checkbox
  if (event.target.type === "checkbox") {
    toggleTaskStatus(event);
  }
  if (event.target.classList.contains("options")) {
    showContextMenu(event);
  }
});

completed.addEventListener("click", () => {
  // Show completed tasks
  currentView = "completed";
  tasksUL.innerHTML = "";
  allProjects.forEach((project) => {
    project.tasks.forEach((task) => {
      if (task.getStatus()) {
        populateTasksList(task);
      }
    });
  });
});
export { allProjects, projectsUL, tasksUL, idmanager };
