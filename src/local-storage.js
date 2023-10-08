import Project from './project.js'
import { allProjects } from './index.js';
import Task from './task.js';
import { idmanager } from './index.js';

const jsonToProjectArray = () => {
    const projectsJSON = JSON.parse(localStorage.getItem("allProjects"))
    if (Array.isArray(projectsJSON)) {
        // Deserialize each project and return the resulting array
        console.log("Converted allProjects from JSON to array");
        return projectsJSON.map((projectData) => Project.deserialize(projectData));
    } else {
        // Return an empty array if there are no projects in storage
        return [];
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
                project.tasks = projectData.tasks.map(task => {
                    console.log(task);
                    return Task.deserialize(task)
                });
            }
        })
    })
    console.log("Converted tasks from JSON to array");      
}

export {jsonToProjectArray, storeProjectsToLocalStorage, deserializeTasks}; 