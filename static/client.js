// On back or forward button - load the page from the server
window.addEventListener("popstate", function (e) {
  location.reload();
});

// Replaces the projects listpage content with a new page of projects
function loadProjects(pageNum) {
  console.log(`Displaying page num:${pageNum}`);
  document.getElementById("projectsWrapper").innerHTML = "";
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
