import Project from './project.js'
import { allProjects } from './index.js';
import Task from './task.js';
import { idmanager } from './index.js';

const jsonToProjectArray = () => {
    const projectsJSON = JSON.parse(localStorage.getItem("allProjects"))
    if (Array.isArray(projectsJSON)) {
        // Deserialize each project and return the resulting array
        return projectsJSON.map((projectData) => Project.deserialize(projectData));
    } else {
        // Return an empty array if there are no projects in storage
        const allProjects = [];
        const defaultProject = new Project("Default", "#000000", idmanager.getNextProjectId());
        allProjects.push(defaultProject);
        return allProjects;
    }
}

const storeProjectsToLocalStorage = () => {
    const json = JSON.stringify(allProjects.map(project => project.serialize()));
    localStorage.setItem("allProjects", json);
}

const deserializeTasks = () => {
    const projectsJSON = JSON.parse(localStorage.getItem("allProjects"));
    projectsJSON.forEach((projectData) => {
        allProjects.forEach((project) => {
            if (projectData.id === project.id) {
                project.tasks = projectData.tasks.map(task => Task.deserialize(task));
            }
        })
    })      
}

export {jsonToProjectArray, storeProjectsToLocalStorage, deserializeTasks}; 