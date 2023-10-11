import './style.scss';
import './style.css';
import Project from './project.js';
import Task from './task.js';
import { isBefore, endOfToday, endOfTomorrow, getWeek } from 'date-fns';
import IdManager from './idmanager.js';
import * as local_storage from './local-storage.js';
import * as DOM_manipulation from './DOM-manipulation.js';


const { createProject, initializeScreen, populateProjectsList, populateTasksList, createTask} = DOM_manipulation;
const { jsonToProjectArray, storeProjectsToLocalStorage, deserializeTasks } = local_storage;
const todayButton = document.getElementById("today");
const weekButton = document.getElementById("week");
const projectsUL = document.querySelector(".projects ul");
const tasksUL = document.querySelector(".tasks ul");
const createProjectButton = document.getElementById("create-project");
const submitNewProject = document.getElementById("submit-project");
const cancelNewProject = document.getElementById("cancel-project");
const addProjectModal = document.getElementById("add-project");
const projectForm = document.getElementById("new-project");
const taskForm = document.getElementById("new-task");
const addTaskModal = document.getElementById("add-task");
const createTaskButton = document.getElementById("create-task");
const cancelNewTask = document.getElementById("cancel-task");
const submitNewTask = document.getElementById("submit-task");
const idmanager = new IdManager();
const checkboxes = document.querySelectorAll("input[type=checkbox]");
const completed = document.getElementById("completed");
// TODO: Create enum for view
let today = endOfToday();
let tomorrow = endOfTomorrow();
let allProjects = [];
let currentView = "today";

const initializeStorage = () => {
    if (localStorage.getItem("allProjects")) {
        allProjects = jsonToProjectArray();
        deserializeTasks();
    } else {
        const defaultProject = new Project("Default", "#000000", idmanager.getNextProjectId());
        allProjects.push(defaultProject);
        storeProjectsToLocalStorage();
    }   
}

const getThisWeeksTasks = () => {
    tasksUL.innerHTML = "";
    allProjects.forEach((project) => {
        project.tasks.forEach((task) => {
            if (getWeek(task.getDueDate()) <= getWeek(today)) {
                populateTasksList(task);
            }
        })
    })

}

const toggleTaskStatus = (event) => {
    const taskToToggle = event.target;
    const targetTask = parseInt(taskToToggle.dataset.taskid, 10);
    if (taskToToggle.checked) {
        allProjects.forEach(project => {
            project.tasks.forEach(task => {
                console.log(`Checking task: ${task.getID()} against target of ${targetTask}`);
                if (task.getID() === targetTask) {
                    console.log(`Found task: ${task.getID()} against target of ${targetTask}`);
                    task.setStatus(true);
                }
            })
        });
        taskToToggle.parentNode.classList.add("completed");
    } else if (!taskToToggle.checked) {
        allProjects.forEach(project => {
            project.tasks.forEach(task => {
                console.log(`Checking task: ${task.getID()} against target of ${targetTask}`);
                if (task.getID() === targetTask) {
                    console.log(`Found task: ${task.getID()} against target of ${targetTask}`);
                    task.setStatus(false);
                }
            })
        });
        taskToToggle.parentNode.classList.remove("completed");
    }
    storeProjectsToLocalStorage();
}

const showMenu = (event) => {
    const taskId = event.target.dataset.taskid;
    const menu = event.target.previousElementSibling;
    menu.classList.toggle("hide");
    document.addEventListener("click", (event) => {
        if (event.target !== menu) {
            menu.classList.add("hide");
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    initializeStorage();
    storeProjectsToLocalStorage();
    initializeScreen();
    const projectsItems = document.querySelectorAll(".project-item");
    projectsItems.forEach((item) => {
        item.addEventListener("click", (event) => {
            currentView = `project-${item.dataset.projectID}`;
            console.log(`current view: ${currentView}`);
            const selectedProject = event.target.dataset.projectID;
            allProjects.forEach((project) => {
                if (project.id === parseInt(selectedProject, 10)) {
                    tasksUL.innerHTML = "";
                    project.tasks.forEach((task) => {
                        populateTasksList(task);
                    })
                }
            })
        })
    })
});
createProjectButton.addEventListener("click", () => {addProjectModal.showModal()});
submitNewProject.addEventListener("click", (event) => {
    createProject(event);
    projectsUL.innerHTML = "";
    allProjects.forEach(project => {
        populateProjectsList(project);
    });
    projectForm.reset();
});
weekButton.addEventListener("click", () => {
    currentView = "week";
    console.log(`current view: ${currentView}`);
    getThisWeeksTasks();
});
cancelNewProject.addEventListener("click", () => {addProjectModal.close()});
createTaskButton.addEventListener("click", () => {
    addTaskModal.showModal();
    const selectProject = document.getElementById("projects");
    selectProject.innerHTML = "";
    allProjects.forEach((project) => {
        const projectOption = document.createElement("option");
        projectOption.setAttribute("value", `${project.getID()}`);
        projectOption.textContent = `${project.title}`;
        selectProject.appendChild(projectOption);
    })
    });
cancelNewTask.addEventListener("click", () => {addTaskModal.close()});
submitNewTask.addEventListener("click", (event) => {
    const due_date = document.getElementById("due-date").value;

    // TODO: Prevent form submission if any of the fields are blank
    if (due_date.trim() === "") {
        event.preventDefault();
        alert("Please select a date and time.");
    } else {
        createTask(event);
        tasksUL.innerHTML = "";
        allProjects.forEach(project => {
            project.tasks.forEach(task => {
                if (isBefore(task.getDueDate(), today)) {
                    populateTasksList(task);
                }
            })
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
    })})
});

tasksUL.addEventListener("click", (event) => {
    toggleTaskStatus(event);
    if (event.target.classList.contains("options")) {
        showMenu(event);
    }
});

completed.addEventListener("click", () => {
    currentView = "completed";
    tasksUL.innerHTML = "";
    allProjects.forEach(project => {
        project.tasks.forEach(task => {
            if (task.getStatus()) {
                populateTasksList(task);
            }
        })
    })
})
export { allProjects, projectsUL, tasksUL, idmanager };