async function getTasksFromServer() {
  const response = await fetch("http://localhost:3000/results");
  return response.json();
}

async function loadTaskPropsIntoDropdown() {
  try {
    const response = await fetch("http://localhost:3000/results");
    const data = await response.json();
    const selectCategory = document.querySelector(".category");
    const keys = Object.keys(data[data.length - 1]);
    keys.forEach((key) => {
      if (key !== "id" && key !== "isDone") {
        const optionEl = document.createElement("option");
        optionEl.textContent = key;
        selectCategory.appendChild(optionEl);
      }
    });
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
}

async function sortAscending() {
  const host = "http://localhost:3000/results";
  const selectCategory = document.querySelector(".category");
  const selectedIndex = selectCategory.selectedIndex;
  const selectedOption = selectCategory.options[selectedIndex];
  const selectedText = selectedOption.textContent;
  const response = await fetch(`${host}?_sort=${selectedText}&_order=asc`);
  const sortedData = await response.json();
  const toDoList = document.getElementById("toDoList");
  toDoList.innerHTML = "";
  const id = sortedData.id;
  sortedData.forEach((task) => {
    const liEl = document.createElement("li");
    liEl.innerHTML = `Task: ${task.title}, Description: ${
      task.description
    }, Date: ${task.date}, Done: ${task.isDone}, TimeEstimation: ${
      task.timeEstimation ? task.timeEstimation : 0
    } min`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("data-id", id);

    liEl.appendChild(editBtn);
    liEl.appendChild(deleteBtn);
    toDoList.appendChild(liEl);
  });
}

async function sortDescending() {
  const host = "http://localhost:3000/results";
  const selectCategory = document.querySelector(".category");
  const selectedIndex = selectCategory.selectedIndex;
  const selectedOption = selectCategory.options[selectedIndex];
  const selectedText = selectedOption.textContent;
  const response = await fetch(`${host}?_sort=${selectedText}&_order=desc`);
  const sortedData = await response.json();
  const toDoList = document.getElementById("toDoList");
  toDoList.innerHTML = "";
  const id = sortedData.id;
  sortedData.forEach((task) => {
    const liEl = document.createElement("li");
    liEl.innerHTML = `Task: ${task.title}, Description: ${
      task.description
    }, Date: ${task.date}, Done: ${task.isDone}, TimeEstimation: ${
      task.timeEstimation ? task.timeEstimation : 0
    } min`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("data-id", id);

    liEl.appendChild(editBtn);
    liEl.appendChild(deleteBtn);
    toDoList.appendChild(liEl);
  });
}

async function filterTrueFalse() {
  const host = "http://localhost:3000/results";
  const selectCategory = document.querySelector(".filterDoneOrNot");
  const selectedIndex = selectCategory.selectedIndex;
  const selectedOption = selectCategory.options[selectedIndex];
  const selectedText = selectedOption.textContent;

  let isDoneValue;
  if (selectedText === "true" || selectedText === "false") {
    isDoneValue = selectedText === "true";
  }

  const response = await fetch(`${host}?isDone=${isDoneValue}`);
  const sortedData = await response.json();
  const toDoList = document.getElementById("toDoList");
  toDoList.innerHTML = "";

  sortedData.forEach((task) => {
    const liEl = document.createElement("li");
    liEl.innerHTML = `Task: ${task.title}, Description: ${
      task.description
    }, Date: ${task.date}, Done: ${task.isDone}, TimeEstimation: ${
      task.timeEstimation ? task.timeEstimation : 0
    } min`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("data-id", task.id);

    liEl.appendChild(editBtn);
    liEl.appendChild(deleteBtn);
    toDoList.appendChild(liEl);
  });
}

function checkAscOrDesc() {
  const selectCategory = document.querySelector(".sort");
  const selectedIndex = selectCategory.selectedIndex;
  const selectedOption = selectCategory.options[selectedIndex];
  const selectedText = selectedOption.textContent;
  if (selectedText == "Ascending") {
    sortAscending();
  } else {
    sortDescending();
  }
}

function createTaskElement(task) {
  const { id, title, description, date, isDone, timeEstimation } = task;

  const liEl = document.createElement("li");
  liEl.innerHTML = `Task: ${title}, Description: ${description}, Date: ${date}, Done: ${isDone}, TimeEstimation: ${
    timeEstimation ? timeEstimation : 0
  } min`;

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.setAttribute("data-id", id);

  liEl.appendChild(editBtn);
  liEl.appendChild(deleteBtn);

  return {
    liEl,
    editBtn,
    deleteBtn,
    id,
    title,
    description,
    date,
    isDone,
    timeEstimation,
  };
}

function handleEditTask(task) {
  const { id, title, description, date, isDone, timeEstimation } = task;

  const h2 = document.getElementsByTagName("h2")[0];
  h2.textContent = "Edit Task:";
  const button = document.getElementById("addBtn");
  button.textContent = "Edit Task";

  const idInput = document.getElementById("identifier");
  const titleInput = document.getElementById("title");
  const descInput = document.getElementById("desc");
  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");
  const checkBox = document.getElementById("check");

  idInput.value = id;
  titleInput.value = title;
  descInput.value = description;
  dateInput.value = date;
  timeInput.value = timeEstimation;
  checkBox.checked = isDone;
}

function search() {
  const searchBox = document.getElementById("searchBox");
  const searchText = searchBox.value;
  const listOfTasks = document.getElementById("toDoList");
  const listItems = Array.from(listOfTasks.children);

  listItems.forEach((li) => {
    const currentLiText = li.textContent.toLowerCase().trim();
    if (currentLiText.includes(searchText.toLowerCase().trim())) {
      li.style.display = "block";
    } else {
      li.style.display = "none";
    }
  });
}

let pageLimit = 5;

async function getNextPageItems() {
  try {
    const pageLabel = document.getElementById("pageIndex");
    let pageIndex = parseInt(pageLabel.textContent);
    pageIndex++;

    const response = await fetch(
      `http://localhost:3000/results?_page=${pageIndex}&_limit=${pageLimit}`
    );
    const data = await response.json();

    const nextPageBtn = document.getElementById("nextPage");

    if (data.length > 0) {
      renderTasks(data);
      pageLabel.textContent = pageIndex;
      nextPageBtn.disabled = false;
    } else {
      nextPageBtn.disabled = true;
    }

    nextPageBtn.addEventListener("click", getNextPageItems);

    const prevPageBtn = document.getElementById("previousPage");
    prevPageBtn.addEventListener("click", getPrevPageItems);
    prevPageBtn.disabled = false;
  } catch (error) {
    console.error("Error fetching next page:", error);
  }
}



async function getPrevPageItems() {
  try {
    const pageLabel = document.getElementById("pageIndex");
    let pageIndex = parseInt(pageLabel.textContent);
    pageIndex--;

    // Ensure the pageIndex doesn't go below 1
    if (pageIndex < 1) {
      pageIndex = 1;
    }

    const response = await fetch(
      `http://localhost:3000/results?_page=${pageIndex}&_limit=${pageLimit}`
    );
    const data = await response.json();

    // Render the fetched items
    renderTasks(data);

    // Update the pageIndex in the UI
    pageLabel.textContent = pageIndex;

    // Enable/disable pagination buttons based on the pageIndex
    const nextPageBtn = document.getElementById("nextPage");
    nextPageBtn.addEventListener("click", getNextPageItems);
    nextPageBtn.disabled = false;
    const prevPageBtn = document.getElementById("previousPage");
    prevPageBtn.addEventListener("click", getPrevPageItems);
    prevPageBtn.disabled = pageIndex === 1;
  } catch (error) {
    console.error("Error fetching previous page:", error);
  }
}

function renderTasks(data) {
  const toDoList = document.getElementById("toDoList");
  toDoList.innerHTML = "";


  data.forEach((task) => {
    const liEl = document.createElement("li");
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    liEl.appendChild(editBtn);
    liEl.appendChild(deleteBtn);

    const taskDetails = document.createElement("span");
    taskDetails.textContent = `Task: ${task.title}, Description: ${task.description}`;

    liEl.appendChild(taskDetails);
    toDoList.appendChild(liEl);
  });
}

function validateForm() {
  const titleInput = document.getElementById("title");
  const descInput = document.getElementById("desc");
  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");

  const titleError = document.querySelector("#titleError");
  if (titleInput.value.trim() === "") {
    if (!titleError) {
      const errorLabel = document.createElement("label");
      errorLabel.textContent = "Title cannot be empty!";
      errorLabel.style.color = "red";
      errorLabel.setAttribute("id", "titleError");
      titleInput.parentNode.appendChild(errorLabel);
    }
    return false;
  } else {
    if (titleError) {
      titleError.parentNode.removeChild(titleError);
    }
    return true;
  }
}

async function updateOrCreateTask(isEdit) {
  const idInput = document.getElementById("identifier");
  const titleInput = document.getElementById("title");
  const descInput = document.getElementById("desc");
  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");
  const checkBox = document.getElementById("check");

  const data = {
    title: titleInput.value,
    description: descInput.value,
    date: dateInput.value,
    timeEstimation: timeInput.value,
    isDone: checkBox.checked,
  };

  if (!validateForm()) {
    return;
  } else {
    const url = isEdit
      ? `http://localhost:3000/results/${idInput.value}`
      : "http://localhost:3000/results";
    const method = isEdit ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    titleInput.value = "";
    descInput.value = "";
    dateInput.value = "";
    timeInput.value = "";
    checkBox.checked = false;
  }
}

async function deleteTask(id) {
  await fetch(`http://localhost:3000/results/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

import page from "./node_modules/page/page.mjs";
import { loginView } from "./views/loginView.js";
import { registerView } from "./views/registerView.js";
import { guestView } from "./views/guestView.js";
import { userView } from "./views/userView.js";
import { logout } from "./views/logout.js";

const sortBtn = document.getElementById("sortBtn");
const filterBtn = document.getElementById("filterBtn");
const searchBtn = document.getElementById("searchBoxBtn");
const registerLink = document.querySelector(".register-link");
const loginLink = document.querySelector(".top-link");
// registerLink.addEventListener("click", registerView);
// loginLink.addEventListener("click", loginView);
// sortBtn.addEventListener("click", checkAscOrDesc);
// filterBtn.addEventListener("click", filterTrueFalse);
// searchBtn.addEventListener("click", search);

page("/index.html", guestView);
page("/", guestView);
page("/login", loginView);
page("/register", registerView);
page("/home", (context, next) => {
  userView(context, next);
  initializeApp(); 
});
page("/logout", logout);
page.start();

async function initializeApp() {
  // const tasks = await getTasksFromServer();
  // const ulEl = document.getElementById("toDoList");
  loadTaskPropsIntoDropdown();
  getNextPageItems();
  getPrevPageItems();

  // tasks.forEach((task) => {
  //   const {
  //     liEl,
  //     editBtn,
  //     deleteBtn,
  //     id,
  //     title,
  //     description,
  //     date,
  //     isDone,
  //     timeEstimation,
  //   } = createTaskElement(task);

  //   editBtn.addEventListener("click", () => {
  //     validateForm();
  //     handleEditTask({ id, title, description, date, isDone, timeEstimation });
  //   });

  //   deleteBtn.addEventListener("click", async () => {
  //     await deleteTask(id);
  //     ulEl.removeChild(liEl);
  //   });

  //   ulEl.appendChild(liEl);
  // });

  const addBtn = document.getElementById("addBtn");
  addBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const isEdit = addBtn.textContent === "Edit Task";
    await updateOrCreateTask(isEdit);
  });
}
