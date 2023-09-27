import './style.scss';
import './style.css';
import Project from './project.js';
import Task from './task.js';

const todayButton = document.getElementById("today");
const weekButton = document.getElementById("week");
const projectsUL = document.querySelector(".projects ul");
const tasksUL = document.querySelector(".tasks ul");
var today = require('date-fns/endOfToday');
var isBefore = require('date-fns/isBefore');
var tomorrow = require('date-fns/startOfTomorrow');
const addProjectForm = document.getElementById("add-project");
const createProjectButton = document.getElementById("create-project");
const submitNewProject = document.getElementById("submit-project");
const cancelNewProject = document.getElementById("cancel-project");
const addTaskForm = document.getElementById("add-task");
const createTaskButton = document.getElementById("create-task");
const cancelNewTask = document.getElementById("cancel-task");
const submitNewTask = document.getElementById("submit-task");

const createProject = (event) => {
    event.preventDefault();
    let projectTitle = document.getElementById("project-title").value;
    let projectColour = document.getElementById("project-colour").value;
    if (!projectTitle || !projectColour) {
        throw new Error("Please provide a valid title and colour");
    }
    let projectToAdd = new Project(projectTitle, projectColour);
    allProjects.push(projectToAdd);
    localStorage.setItem("allProjects", allProjects);
    addProjectForm.close();
    initializeScreen();
}

const initializeScreen = () => {
    projectsUL.innerHTML = "";
    tasksUL.innerHTML = "";
    allProjects.forEach((project) => {
        populateProjectsList(project);
        (project.tasks.forEach((task) => {
        if (isBefore(tomorrow, task.getDueDate())) {
            populateTasksList(task);
        }
    }))})
}
const getThisWeeksTasks = () => {
    tasksUL.innerHTML = "";
    var getWeek = require('date-fns/getWeek');
    allProjects.forEach((project) => {
        project.tasks.forEach((task) => {
            if (getWeek(task.getDueDate()) === getWeek(today)) {
                populateTasksList(task);
            }
        })
    })

}
const populateProjectsList = (project) => {
    if (project instanceof Project) {
        const projectItem = document.createElement("li");
        const projectLink = document.createElement("span");
        projectLink.classList.add("project-item");
        projectLink.textContent = `${project.title}`;
        projectItem.appendChild(projectLink);
        projectItem.dataset.projectID = project.id;
        projectsUL.appendChild(projectItem);
    } else {
        throw new Error("Not a project.");
    }
}

const populateTasksList = (task) => {
    if (task instanceof Task) {
        const task = document.createElement("li");
        const status = document.createElement("input");
        status.setAttribute("type", "checkbox");
        task.appendChild(status);
        task.textContent = task.getTitle();
        tasksUL.appendChild(task);
    } else {
        throw new Error("Not a task.");
    }
}

const createTask = (event) => {
    event.preventDefault();
    const taskTitle = document.getElementById("task-title").value;
    const taskDescription = document.getElementById("description").value;
    const taskDate = document.getElementById("due-date").value;
    const taskProjectID = document.getElementById("project").value;
    const taskPriority = document.getElementById("priority").value;
    let taskProject = allProjects[0];
    allProjects.forEach((project) => {
        if (project.id === taskProjectID) {
            taskProject = project;
        }
    })
    let taskToAdd = new Task(taskTitle, taskDescription, taskDate, taskProject, taskPriority);
    taskProject.addTask(taskToAdd);
    localStorage.setItem("allProjects", allProjects);

}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("allProjects")) {
        let allProjects = localStorage.getItem("allProjects");
    } else {
        const defaultProject = new Project("default", "#FFFFFF");
        let allProjects = [];
        allProjects.push(defaultProject);
        localStorage.setItem("allProjects", allProjects);
    }
    initializeScreen();
    const projectsItems = document.querySelectorAll(".project-item");
    projectsItems.forEach((item) => {
        item.addEventListener("click", (event) => {
            const selectedProject = event.target.dataset.projectID;
            allProjects.forEach((project) => {
                if (project.id === selectedProject) {
                    tasksUL.innerHTML = "";
                    project.tasks.forEach((task) => {
                        populateTasksList(task);
                    })
                }
            })
        })
    })
});
createProjectButton.addEventListener("click", () => {addProjectForm.showModal()});
submitNewProject.addEventListener("click", (event) => {
    createProject(event);
});
weekButton.addEventListener("click", getThisWeeksTasks);
cancelNewProject.addEventListener("click", () => {addProjectForm.close()});
createTaskButton.addEventListener("click", () => {
    addTaskForm.showModal();
    const selectProject = document.getElementById("projects");
    allProjects.forEach((project) => {
        const projectOption = document.createElement("option");
        projectOption.setAttribute("value", `${project.id}`);
        projectOption.textContent = `${project.title}`;
        selectProject.appendChild(projectOption);
    })
    });
cancelNewTask.addEventListener("click", () => {addTaskForm.close()});
submitNewTask.addEventListener("click", (event) => {
    createTask(event);
})

export {allProjects as allProjects}