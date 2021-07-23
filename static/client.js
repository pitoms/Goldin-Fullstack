// On back or forward button - load the page from the server
window.addEventListener("popstate", function (e) {
  location.reload();
});

// Tooltips - To do: caching fetched data in local storage
let projectElements = document.getElementsByClassName("project");
projectElements.forEach((projectDiv) => {
  projectDiv.addEventListener("mouseover", (e) => {});
  projectDiv.addEventListener("mouseleave", (e) => {});
});

// Creates the tooltip HTML either from localstorage data or
// a fetch
function generateToolTips(projectID) {}

// Replaces the projects listpage content with a new page of projects
function loadProjects(pageNum) {
  console.log(`Displaying page num:${pageNum}`);
  console.log("Requesting: ", `http://localhost:4000/relayProjects=${pageNum}`);
  let loadingImg = document.createElement("img");
  loadingImg.src = "https://media4.giphy.com/media/3oEjI6SIIHBdRxXI40/200w.gif?cid=82a1493bn64f95wlrhgldv1wfihr40dyux2r8o37f5wjlmpg&rid=200w.gif&ct=g";
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
      document.getElementById("projectsWrapper").innerHTML = JSON.stringify(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

///TODO: Refactor next and prev into one function
// < button functionality
function prev(currPage) {
  if (currPage > 1) {
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
  loadProjects(currPage);

  // Add our current page to history
  history.pushState(null, "", window.location.href);

  // Replace the window url with incremented page
  let newURL = window.location.href.split("=")[0] + "=" + (parseInt(window.location.href.split("=")[1]) + 1);
  history.replaceState(null, "", newURL);

  let nextButton = document.getElementById("next");
  nextButton.setAttribute("onclick", `next(${currPage + 1})`);

  let prevButton = document.getElementById("prev");
  prevButton.setAttribute("onclick", `prev(${currPage - 1})`);
}
