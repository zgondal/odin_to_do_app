import Project from "./project.js";
import Task from "./task.js";

const jsonToProjectArray = () => {
  const projectsJSON = JSON.parse(localStorage.getItem("allProjects"));
  if (Array.isArray(projectsJSON)) {
    // Deserialize each project and return the resulting array
    const deserializedProjects = projectsJSON.map((projectData) => Project.deserialize(projectData));
    deserializeTasks(deserializedProjects);
    return deserializedProjects;
  } else {
    // Return an empty array if there are no projects in storage
    return [];
  }
};

const storeProjectsToLocalStorage = (allProjects) => {
  const json = JSON.stringify(
    allProjects.map((project) => project.serialize()),
  );
  localStorage.setItem("allProjects", json);
};

const deserializeTasks = (deserializedProjects) => {
  const projectsJSON = JSON.parse(localStorage.getItem("allProjects"));
  projectsJSON.forEach((projectData) => {
    // TODO: Store projects in BST and instead of iterating through allProjects retrieve 
    // required project from BST using projectData.id 
    deserializedProjects.forEach((project) => {
      if (projectData.id === project.id) {
        project.tasks = projectData.tasks.map((taskJSON) => {
          return Task.deserialize(taskJSON);
        });
      }
    });
  });
};

export { jsonToProjectArray, storeProjectsToLocalStorage };
