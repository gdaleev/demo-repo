// async function getTasksFromServer() {
//   const response = await fetch("http://localhost:3000/results");
//   return response.json();
// }

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

  const taskOwnerId = await getCurrentUserId();

  const toDoList = document.getElementById("toDoList");
  toDoList.innerHTML = "";

  sortedData.forEach((task) => {
    const { id, ownerId, title, description, date, isDone, timeEstimation } =
      task;
    const isUserTask = ownerId == taskOwnerId;

    const liEl = document.createElement("li");
    liEl.innerHTML = `Task: ${title}, Description: ${description}, Date: ${date}, Done: ${isDone}, TimeEstimation: ${
      timeEstimation ? timeEstimation : 0
    } min`;

    if (isUserTask) {
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";

      liEl.appendChild(editBtn);
      liEl.appendChild(deleteBtn);
    }

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

  const taskOwnerId = await getCurrentUserId();

  const toDoList = document.getElementById("toDoList");
  toDoList.innerHTML = "";

  sortedData.forEach((task) => {
    const { id, ownerId, title, description, date, isDone, timeEstimation } =
      task;
    const isUserTask = ownerId == taskOwnerId;

    const liEl = document.createElement("li");
    liEl.innerHTML = `Task: ${title}, Description: ${description}, Date: ${date}, Done: ${isDone}, TimeEstimation: ${
      timeEstimation ? timeEstimation : 0
    } min`;

    if (isUserTask) {
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.setAttribute("data-id", id);

      liEl.appendChild(editBtn);
      liEl.appendChild(deleteBtn);
    }

    toDoList.appendChild(liEl);
  });
}

async function filterTrueFalse() {
  const host = "http://localhost:3000/results";
  const selectCategory = document.querySelector(".filterDoneOrNot");
  const selectedIndex = selectCategory.selectedIndex;
  const selectedOption = selectCategory.options[selectedIndex];
  const selectedText = selectedOption.textContent;

  const taskOwnerId = await getCurrentUserId()

  let isDoneValue;
  if (selectedText === "true" || selectedText === "false") {
    isDoneValue = selectedText === "true";
  }

  const response = await fetch(`${host}?isDone=${isDoneValue}`);
  const sortedData = await response.json();
  const toDoList = document.getElementById("toDoList");
  toDoList.innerHTML = "";

  sortedData.forEach((task) => { const { id, ownerId, title, description, date, isDone, timeEstimation } =
  task; 
    const liEl = document.createElement("li");
    liEl.innerHTML = `Task: ${task.title}, Description: ${
      task.description
    }, Date: ${task.date}, Done: ${task.isDone}, TimeEstimation: ${
      task.timeEstimation ? task.timeEstimation : 0
    } min`;
    const isUserTask = ownerId == taskOwnerId;

    if (isUserTask) {
      const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("data-id", task.id);

    liEl.appendChild(editBtn);
    liEl.appendChild(deleteBtn);
    }

    
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

// function createTaskElement(task) {
//   const { id, title, description, date, isDone, timeEstimation } = task;

//   const liEl = document.createElement("li");
//   liEl.innerHTML = `Task: ${title}, Description: ${description}, Date: ${date}, Done: ${isDone}, TimeEstimation: ${
//     timeEstimation ? timeEstimation : 0
//   } min`;

//   const editBtn = document.createElement("button");
//   editBtn.textContent = "Edit";

//   const deleteBtn = document.createElement("button");
//   deleteBtn.textContent = "Delete";
//   deleteBtn.setAttribute("data-id", id);

//   liEl.appendChild(editBtn);
//   liEl.appendChild(deleteBtn);

//   return {
//     liEl,
//     editBtn,
//     deleteBtn,
//     id,
//     title,
//     description,
//     date,
//     isDone,
//     timeEstimation,
//   };
// }

async function handleEditTask(id) {
  const response = await fetch("http://localhost:3000/results");
  const data = await response.json();

  const taskToEdit = data.find(task => task.id === id);

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

  idInput.value = taskToEdit.id;
  titleInput.value = taskToEdit.title;
  descInput.value = taskToEdit.description;
  dateInput.value = taskToEdit.date;
  timeInput.value = taskToEdit.timeEstimation;
  checkBox.checked = taskToEdit.isDone;
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

    if (pageIndex < 1) {
      pageIndex = 1;
    }

    const response = await fetch(
      `http://localhost:3000/results?_page=${pageIndex}&_limit=${pageLimit}`
    );
    const data = await response.json();

    renderTasks(data);

    pageLabel.textContent = pageIndex;

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

async function getUserRoles() {
  const response = await fetch("http://localhost:3000/roles")
  const data = await response.json()
  const { permissions } = Object.entries(data)
}

async function renderTasks(data) {
  const toDoList = document.getElementById("toDoList");
  toDoList.innerHTML = "";
  const ownerId = await getCurrentUserId();
  const currentUserRole = await getCurrentUserRole()
  const rolePermissions = await getRolePermissions(currentUserRole)

  data.forEach((task) => {
    const liEl = document.createElement("li");

    const canEditOwnTasks = rolePermissions.includes("canUpdateOwnTasks")
    const canEditAllTasks = rolePermissions.includes("canUpdateAllTasks")
    const canDeleteOwnTasks = rolePermissions.includes("canDeleteOwnTasks")
    const canDeleteAllTasks = rolePermissions.includes("canDeleteAllTasks")
    const canReadTasks = rolePermissions.includes("canReadTasks")

    if (canEditOwnTasks && canDeleteOwnTasks) {
      if (task.ownerId == ownerId) {
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.setAttribute("id", "editBtn");
        editBtn.setAttribute("data-btnId", task.id);
        editBtn.addEventListener("click", () => handleEditTask(task.id)); 
        const deleteBtn = document.createElement("button");
        deleteBtn.setAttribute("id", "deleteBtn");
        deleteBtn.setAttribute("data-btnId", task.id);
        deleteBtn.addEventListener("click", () => deleteTask(task.id))
        deleteBtn.textContent = "Delete";
        const taskDetails = document.createElement("span");
        taskDetails.textContent = `Task: ${task.title}, Description: ${
          task.description
        }, Date: ${task.date}, Done: ${task.isDone}, TimeEstimation: ${
          task.timeEstimation ? task.timeEstimation : 0
        } min`;
        liEl.appendChild(taskDetails);
        liEl.appendChild(editBtn);
        liEl.appendChild(deleteBtn);
      } else {
        const taskDetails = document.createElement("span");
        taskDetails.textContent = `Task: ${task.title}, Description: ${
          task.description
        }, Date: ${task.date}, Done: ${task.isDone}, TimeEstimation: ${
          task.timeEstimation ? task.timeEstimation : 0
        } min`;
        liEl.appendChild(taskDetails);
      }
    } else if (canEditAllTasks && canDeleteAllTasks) {
      const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.setAttribute("id", "editBtn");
        editBtn.setAttribute("data-btnId", task.id);
        editBtn.addEventListener("click", () => handleEditTask(task.id)); 
        const deleteBtn = document.createElement("button");
        deleteBtn.setAttribute("id", "deleteBtn");
        deleteBtn.setAttribute("data-btnId", task.id);
        deleteBtn.addEventListener("click", () => deleteTask(task.id))
        deleteBtn.textContent = "Delete";
        const taskDetails = document.createElement("span");
        taskDetails.textContent = `Task: ${task.title}, Description: ${
          task.description
        }, Date: ${task.date}, Done: ${task.isDone}, TimeEstimation: ${
          task.timeEstimation ? task.timeEstimation : 0
        } min`;
        liEl.appendChild(taskDetails);
        liEl.appendChild(editBtn);
        liEl.appendChild(deleteBtn);
    } else if (rolePermissions.length == 1 && canReadTasks) {
      const taskDetails = document.createElement("span");
      taskDetails.textContent = `Task: ${task.title}, Description: ${
        task.description
      }, Date: ${task.date}, Done: ${task.isDone}, TimeEstimation: ${
        task.timeEstimation ? task.timeEstimation : 0
      } min`;
      liEl.appendChild(taskDetails);
    }
    toDoList.appendChild(liEl);
  });
}

function validateForm() {
  const titleInput = document.getElementById("title");
  const descInput = document.getElementById("desc");
  const dateInput = document.getElementById("date");
  let errorLabel = document.getElementById("errorLabel");

  if (!errorLabel) {
    errorLabel = document.createElement("label");
    errorLabel.id = "errorLabel";
    errorLabel.style.color = "red";
    titleInput.parentNode.appendChild(errorLabel);
  }

  if (titleInput.value.trim() === "") {
    errorLabel.textContent = "Title cannot be empty!";
    return false;
  } else if (descInput.value.trim() === "") {
    errorLabel.textContent = "Description cannot be empty!";
    return false;
  } else if (dateInput.value.trim() === "") {
    errorLabel.textContent = "Date cannot be empty!";
    return false;
  } else {
    errorLabel.textContent = "";
    return true;
  }
}

async function getCurrentUserId() {
  const userString = localStorage.getItem("username");

  const userDataResponse = await fetch("http://localhost:3000/users");
  const userData = await userDataResponse.json();

  let ownerId = "";

  for (const [_id, { username, id }] of Object.entries(userData)) {
    if (userString == username) {
      ownerId = id;
      return ownerId;
    }
  }
}

async function getCurrentUserRole() {
  const userString = localStorage.getItem("username");

  const userDataResponse = await fetch("http://localhost:3000/users");
  const userData = await userDataResponse.json();

  let userRole = ""

  for (const [_id, { role, username }] of Object.entries(userData)) {
    if (userString == username) {
      userRole = role
      return role;
    }
  }
}

async function getRolePermissions(userRole) {
  const response = await fetch("http://localhost:3000/roles")
  const data = await response.json()

  for (const [id, {role, permissions}] of Object.entries(data)) {
    if (userRole == role) {
      return permissions
    }
  }
}

async function updateOrCreateTask(isEdit) {
  const idInput = document.getElementById("identifier");
  const titleInput = document.getElementById("title");
  const descInput = document.getElementById("desc");
  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");
  const checkBox = document.getElementById("check");

  const ownerId = await getCurrentUserId();

  const data = {
    title: titleInput.value,
    description: descInput.value,
    date: dateInput.value,
    timeEstimation: timeInput.value,
    isDone: checkBox.checked,
    ownerId: ownerId,
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
  }

  titleInput.value = "";
  descInput.value = "";
  dateInput.value = "";
  timeInput.value = "";
  checkBox.checked = false;
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
  loadTaskPropsIntoDropdown();
  getNextPageItems();
  getPrevPageItems();
  const sortBtn = document.getElementById("sortBtn");
  sortBtn.addEventListener("click", checkAscOrDesc);
  const filterBtn = document.getElementById("filterBtn");
  const searchBtn = document.getElementById("searchBoxBtn");
  filterBtn.addEventListener("click", filterTrueFalse);
  searchBtn.addEventListener("click", search);

  const addBtn = document.getElementById("addBtn");
  addBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const isEdit = addBtn.textContent === "Edit Task";
    await updateOrCreateTask(isEdit);
  });
}
