import './style.css';
import Project from './project.js';
import Task from './task.js';

let allProjects = [];
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

const createProject = () => {
    let projectTitle = document.getElementById("project-title").value;
    let projectColour = document.getElementById("project-colour").value;
    if (!projectTitle || !projectColour) {
        throw new Error("Please provide a valid title and colour");
    }
    let projectToAdd = new Project(projectTitle, projectColour);
    allProjects.push(projectToAdd);
}

const initializeScreen = () => {
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
        const projectLink = document.createElement("a");
        projectLink.setId(`${project.title}`);
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

document.addEventListener("DOMContentLoaded", initializeScreen);
createProjectButton.addEventListener("click", () => {addProjectForm.showModal()});
submitNewProject.addEventListener("click", createProject);
weekButton.addEventListener("click", getThisWeeksTasks);

export {allProjects as allProjects}