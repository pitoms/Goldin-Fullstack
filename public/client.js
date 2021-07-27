let projects;
let usersCache = new Map();

// On back or forward button - load the page from the server
window.addEventListener("popstate", function (e) {
  location.reload();
});

window.onload = () => {
  setToolTipsHover();
  fetchUsers();
};

// Replaces the projects listpage content with a new page of projects
function loadProjects(pageNum) {
  console.log(`Displaying page num:${pageNum}`);
  console.log("Requesting: ", `http://localhost:4000/relayProjects=${pageNum}`);
  let loadingImg = document.createElement("img");
  loadingImg.src = "img/loading.gif";
  loadingImg.className = "loadingImg";
  document.getElementById("projectsWrapper").innerHTML = "";
  document.getElementById("projectsWrapper").appendChild(loadingImg);

  fetch(`http://localhost:4000/relayProjects=${pageNum}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      projects = data.projects;
      buildProjectListHTML(projects);
      console.log(projects);
    })
    .catch((err) => {
      console.log(err);
    });
}

function setToolTipsHover() {
  let projectElements = document.getElementsByClassName("project");

  for (let project of projectElements) {
    let tooltip = project.childNodes[1];

    project.addEventListener("mouseover", (e) => {
      tooltip.style.display = "block";
    });
    project.addEventListener("mouseleave", (e) => {
      tooltip.style.display = "none";
    });
  }
}

// Grab user data of projects from server if not previously fetched
// Uses hidden id's to lookup user data
function fetchUsers() {
  let tooltips = document.getElementsByClassName("tooltip");

  for (let tooltip of tooltips) {
    let userID = tooltip.innerText;
    if (!usersCache.has(userID)) {
      fetch(`http://localhost:4000/relayUserInfo=${userID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          usersCache.set(userID, data);
          fillToolTip(tooltip, data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      fillToolTip(tooltip, usersCache.get(userID));
    }
  }
}

//Add user data html to tooltips
function fillToolTip(tooltip, userData) {
  console.log("filling tooltip:", tooltip);
  console.log("potential tooltip data", userData);
  tooltip.innerHTML = "";
  //Profile image
  let profPic = document.createElement("img");
  profPic.style.height = "50px";
  profPic.src = userData.image_url;
  tooltip.appendChild(profPic);

  let name = document.createElement("span");
  name.innerText = "built by: " + userData.screen_name;
  tooltip.appendChild(name);
}

// Given the project list response from the API
// Fills the wrapper with divs for each project
function buildProjectListHTML(projects) {
  let wrapper = document.getElementById("projectsWrapper");
  wrapper.innerHTML = "";

  projects.forEach((project) => {
    // Project div
    let projectDiv = document.createElement("div");
    projectDiv.className = "project";

    //Tooltip div
    let tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.style.display = "none";
    tooltip.innerText = project.owner_id;

    projectDiv.appendChild(tooltip);

    projectDiv.addEventListener("mouseover", (e) => {
      tooltip.style.display = "block";
    });
    projectDiv.addEventListener("mouseleave", (e) => {
      tooltip.style.display = "none";
    });

    // Image div
    let prjImg = document.createElement("img");
    prjImg.src = project.image_url;
    prjImg.className = "prjImg";
    projectDiv.appendChild(prjImg);

    let prjName = document.createElement("a");
    prjName.href = `http://localhost:4000/project=${project.id}`;
    prjName.innerText = project.name;
    projectDiv.appendChild(prjName);

    wrapper.appendChild(projectDiv);
  });

  fetchUsers();
}

///TODO: Refactor next and prev into one function
// < button functionality
function prev(currPage) {
  if (currPage >= 1) {
    page = currPage;
    console.log(`prev(${currPage})`);
    loadProjects(currPage);

    // Add our current page to history
    history.pushState(null, "", window.location.href);

    // Replace the window url with decremented page
    let newURL = window.location.href.split("=")[0] + "=" + (parseInt(window.location.href.split("=")[1]) - 1);
    history.replaceState(null, "", newURL);

    let nextButton = document.getElementById("next");
    nextButton.setAttribute("onclick", `next(${currPage + 1})`);

    let prevButton = document.getElementById("prev");
    prevButton.setAttribute("onclick", `prev(${currPage - 1})`);
  }
}

// > button functionality
function next(currPage) {
  console.log(`next(${currPage})`);
  page = currPage;
  loadProjects(currPage);

  // Add our current page to history
  history.pushState(null, "", window.location.href);

  // Replace the window url with incremented page

  if (!window.location.href.includes("page=")) {
    let newURL = window.location.href + "page=1";
    history.replaceState(null, "", newURL);
  }

  let newURL = window.location.href.split("=")[0] + "=" + (parseInt(window.location.href.split("=")[1]) + 1);
  history.replaceState(null, "", newURL);

  let nextButton = document.getElementById("next");
  nextButton.setAttribute("onclick", `next(${currPage + 1})`);

  let prevButton = document.getElementById("prev");
  prevButton.setAttribute("onclick", `prev(${currPage - 1})`);
}
