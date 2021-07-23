// replaces the projects listpage content with
function dynamicClientSideLoadProjects(pageNum) {
  console.log(`Displaying page num:${pageNum}`);
  document.getElementById("projectsWrapper").innerHTML = "";
}

function prev(currPage) {
  if (currPage > 1) {
    dynamicClientSideLoadProjects(currPage - 1);
  } else {
    return;
  }

  // Setup our new prev button
  document.getElementById("prev").onclick = `prev(${currPage - 1})`;
  // Setup our new next button
  document.getElementById("next").onclick = `next(${currPage})`;

  // Add our current page to history
  history.pushState(null, "", window.location.href);

  // Replace the window url with decremented page
  let newURL = window.location.href.split("=")[0] + "=" + (parseInt(window.location.href.split("=")[1]) - 1);
  history.replaceState(null, "", newURL);

  // Setup functionality of our back button
  window.onpopstate = (event) => {
    window.location.href = window.location.href;
  };
}

function next(currPage) {
  dynamicClientSideLoadProjects(currPage + 1);

  // Setup our new prev button
  document.getElementById("prev").onclick = `prev(${currPage})`;

  // Setup our new next button
  document.getElementById("next").onclick = `next(${currPage + 1})`;

  // Add our current page to history
  history.pushState(null, "", window.location.href);

  // Replace the window url with incremented page
  let newURL = window.location.href.split("=")[0] + "=" + (parseInt(window.location.href.split("=")[1]) + 1);
  history.replaceState(null, "", newURL);

  // Setup functionality of our forward button
  window.onpopstate = (event) => {
    window.location.href = window.location.href;
  };
}
