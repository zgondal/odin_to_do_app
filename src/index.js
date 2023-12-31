import "./style.scss";
import Project from "./project.js";
import Task from "./task.js";
import { isBefore, endOfToday, getWeek, } from "date-fns";
import idmanager from "./idmanager.js";
import * as local_storage from "./local-storage.js";
import * as DOM_manipulation from "./DOM-manipulation.js";

const {
  createProject,
  initializeScreen,
  populateProjectsList,
  createTaskLI,
  createTask,
  populateEditTaskForm,
  editTask,
} = DOM_manipulation;
const { jsonToProjectArray, storeProjectsToLocalStorage } =
  local_storage;
const todayButton = document.getElementById("today");
const weekButton = document.getElementById("week");
const todoButton = document.getElementById("todo");
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
const checkboxes = document.querySelectorAll("input[type=checkbox]");
const completedTasksButton = document.getElementById("completed");
const editTaskModal = document.getElementById("edit-task");
const editTaskForm = document.getElementById("edit-task-form");
// TODO: Create enum for view
let allProjects = [];
let today = endOfToday();
let View;
let currentView;
let currentProjectId;

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

const toggleTaskStatus = (event) => {
  const taskToToggle = event.target;
  const targetTaskId = parseInt(taskToToggle.dataset.taskid, 10);
  if (taskToToggle.checked) {
    allProjects.forEach((project) => {
      project.tasks.forEach((task) => {
        if (task.getId() === targetTaskId) task.setStatus(true);
      });
    });
    taskToToggle.parentNode.classList.add("completed");
  } else {
    allProjects.forEach((project) => {
      project.tasks.forEach((task) => {
        if (task.getId() === targetTaskId) task.setStatus(false);
      });
    });
    taskToToggle.parentNode.classList.remove("completed");
  }
  storeProjectsToLocalStorage(allProjects);
};

const showContextMenu = (event) => {
  const taskId = event.target.dataset.taskId;
  const menu = event.target.previousElementSibling;
  let taskToEdit;
  let targetProject;
  menu.classList.toggle("hide");
  menu.addEventListener("click", (menuOption) => {
    // Match target task in all tasks
    allProjects.forEach((project) => {
      project.tasks.forEach((task) => {
        if (task.getId() === parseInt(taskId, 10)) {
          console.log(`task found: ${task}`);
          taskToEdit = task;
          targetProject = project;
  }})});
    // Show editTask form
    if (menuOption.target.id === "edit-task") {
      editTaskModal.showModal();
      // Populate form with existing values
      populateEditTaskForm(taskToEdit);
      const submitEditButton = document.getElementById("submit-edit");
      const cancelEditButton = document.getElementById("cancel-edit");
      submitEditButton.addEventListener("click", (submitEvent) => {
        submitEvent.preventDefault();
        editTask(taskToEdit);
        editTaskForm.reset();
        editTaskModal.close();
      })
      cancelEditButton.addEventListener("click", () => {
        editTaskForm.reset();
        editTaskModal.close();
      })
    }
    if (menuOption.target.id === "delete-task") {
      targetProject.tasks = targetProject.tasks.filter(task => task.getId() !== taskToEdit.getId());
      populateTasksUl();
    }
  })
};

const populateTasksUl = () => {
  tasksUL.innerHTML = "";
  switch(currentView) {
    case View.TODO:
      allProjects.forEach(project => {
        project.tasks.forEach(task => {
          if (!task.getStatus()) {
            createTaskLI(task);
          }
        })
      })
      break;

    case View.TODAY:
      allProjects.forEach(project => {
        project.tasks.forEach(task => {
          if (isBefore(task.getDueDate(), today) && !task.getStatus()) {
            createTaskLI(task);
          }
        })
      })
      break;
    
    case View.WEEK:
      allProjects.forEach(project => {
        project.tasks.forEach(task => {
          if (getWeek(task.getDueDate()) <= getWeek(today) && !task.getStatus()) {
            createTaskLI(task);
          }
        })
      })
      break;
    
    case View.COMPLETED:
      allProjects.forEach(project => {
        project.tasks.forEach(task => {
          if (task.getStatus()) {
            createTaskLI(task);
          }
        })
      })
      break;

    case View.PROJECT:
      allProjects.forEach(project => {
        if (project.getId() === currentProjectId) {
          project.tasks.forEach(task => {
            if (!task.getStatus()) {
              createTaskLI(task);
            }
          })
        }
      })
      break;
    
    default:
      allProjects.forEach(project => {
        project.tasks.forEach(task => {
          if (isBefore(today, task.getDueDate()) && !task.getStatus()) {
            createTaskLI(task);
          }
        })
      })
  }
}

const createStateEnum = () => {
  const stateEnum = {
    TODO: 'todo',
    TODAY: 'today',
    WEEK: 'week',
    COMPLETED: 'completed',
    PROJECT: 'project',  
  }
  return stateEnum;
}

View = createStateEnum();

document.addEventListener("DOMContentLoaded", () => {
  initializeStorage();
  // TODO: Do I need this write right after initializeStorage?
  // storeProjectsToLocalStorage(allProjects);
  initializeScreen();
  currentView = View.TODAY;
  //TODO: Move this to separate function
  const projectsItems = document.querySelectorAll(".project-item");
  projectsItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      currentView = View.PROJECT;
      currentProjectId = parseInt(event.target.dataset.projectId);
      populateTasksUl();
    });
  });
});
showProjectModalButton.addEventListener("click", () => {
  addProjectModal.showModal();
});
submitNewProject.addEventListener("click", (event) => {
  createProject(event);
  View = createStateEnum();
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
  currentView = View.WEEK;
  console.log(`current view: ${currentView}`);
  populateTasksUl();
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
          createTaskLI(task);
        }
      });
    });
    taskForm.reset();
  }
});
todayButton.addEventListener("click", () => {
  currentView = View.TODAY;
  console.log(`current view: ${currentView}`);
  populateTasksUl();
});
tasksUL.addEventListener("click", (event) => {
  // Check if the target is the checkbox
  if (event.target.type === "checkbox") {
    toggleTaskStatus(event);
    populateTasksUl();
  }
  if (event.target.classList.contains("options")) {
    showContextMenu(event);
  }
});
todoButton.addEventListener("click", () => {
  currentView = View.TODO;
  populateTasksUl();
})
completedTasksButton.addEventListener("click", () => {
  // Show completed tasks
  currentView = View.COMPLETED;
  populateTasksUl();
});
export { allProjects, projectsUL, tasksUL };
