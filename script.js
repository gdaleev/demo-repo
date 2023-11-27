// async function solve() {
//   const addBtn = document.getElementById("addBtn");
//   const titleInput = document.getElementById("title");
//   const descInput = document.getElementById("desc");
//   const dateInput = document.getElementById("date");
//   const checkBox = document.getElementById("check");
//   const idInput = document.getElementById("identifier");
//   let isChecked = checkBox.checked;

//   const getTasks = await fetch("http://localhost:3000/results");
//   const tasks = await getTasks.json();
//   const ulEl = document.getElementById("toDoList");

//   function showEditForm() {
//     const h2 = document.getElementsByTagName("h2")[0];
//     h2.textContent = "Edit Task:";
//     const button = document.getElementById("addBtn");
//     button.textContent = "Edit Task";
//   }

//   tasks.forEach((task) => {
//     const { id, title, description, date, isDone } = task;
//     const liEl = document.createElement("li");
//     liEl.innerHTML = `Task: ${title}, Description: ${description}, Date: ${date}, Done: ${isDone}`;
//     const editBtn = document.createElement("button");
//     const deleteBtn = document.createElement("button");
//     editBtn.textContent = "Edit";
//     deleteBtn.textContent = "Delete"
//     deleteBtn.setAttribute("id", id)
//     liEl.appendChild(editBtn);
//     liEl.appendChild(deleteBtn);

//     editBtn.addEventListener("click", (e) => {
//       showEditForm();
//       idInput.value = id;
//       titleInput.value = title;
//       descInput.value = description;
//       dateInput.value = date;
//       isChecked = isDone;

//       if (isDone == true) {
//         checkBox.checked = true;
//       } else {
//         checkBox.checked = false;
//       }
//     });

//     deleteBtn.addEventListener("click", async () => {
//       fetch(`http://localhost:3000/results/${id}`, {
//         method: "DELETE",
//         headers:{
//           "Content-Type": "application/json"
//         }
//       })
//     })

//     ulEl.appendChild(liEl);
//   });

//   addBtn.addEventListener("click", async (e) => {
//     e.preventDefault();
//     if (addBtn.textContent == "Edit Task") {
//       const data = {
//         title: titleInput.value,
//         description: descInput.value,
//         date: dateInput.value,
//         isDone: checkBox.checked == true ? true : false,
//       };
//       fetch(`http://localhost:3000/results/${idInput.value}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });
//       titleInput.value = "";
//       descInput.value = "";
//       dateInput.value = "";
//       checkBox.checked = false;
//     } else {
//       const data = {
//         title: titleInput.value,
//         description: descInput.value,
//         date: dateInput.value,
//         isDone: isChecked,
//       };
//       fetch("http://localhost:3000/results", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       titleInput.value = "";
//       descInput.value = "";
//       dateInput.value = "";
//       checkBox.checked = false;
//     }
//   });
// }

// solve();

// ↓↓↓ Refactored code ↓↓↓

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
    deleteBtn.setAttribute("data-id", task.id); // Use task.id here

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

const nextPageBtn = document.getElementById("nextPage");
const prevPageBtn = document.getElementById("previousPage");
let pageLimit = 5;

async function getNextPageItems() {
  const pageLabel = document.getElementById("pageIndex");
  let pageIndex = parseInt(pageLabel.textContent);
  pageIndex++;
  pageLabel.textContent = pageIndex;

  const response = await fetch(
    `http://localhost:3000/results?_page=${pageIndex}&_limit=${pageLimit}`
  );
  const data = await response.json();
  const toDoList = document.getElementById("toDoList");
  toDoList.innerHTML = "";

  for (const [
    id,
    { title, description, date, isDone, timeEstimation },
  ] of Object.entries(data)) {
    const liEl = document.createElement("li");

    liEl.innerHTML = `Task: ${title}, Description: ${description}, Date: ${date}, Done: ${isDone}, TimeEstimation: ${
      timeEstimation ? timeEstimation : 0
    } min`;

    toDoList.appendChild(liEl);
  }

  // Check if there's more data beyond the current page
  const nextPageResponse = await fetch(
    `http://localhost:3000/results?_page=${pageIndex + 1}&_limit=${pageLimit}`
  );
  const nextPageData = await nextPageResponse.json();
  const nextPageHasData = nextPageData.length > 0;

  nextPageBtn.disabled = !nextPageHasData; // Disable if no more data for the next page
  prevPageBtn.disabled = false; // Always enable previous page button after navigating to next
}

async function getPrevPageItems() {
  const pageLabel = document.getElementById("pageIndex");
  let pageIndex = parseInt(pageLabel.textContent);
  pageIndex--;

  if (pageIndex < 1) {
    pageIndex = 1;
  }

  pageLabel.textContent = pageIndex;

  const response = await fetch(
    `http://localhost:3000/results?_page=${pageIndex}&_limit=${pageLimit}`
  );
  const data = await response.json();
  const toDoList = document.getElementById("toDoList");
  toDoList.innerHTML = "";

  for (const [
    id,
    { title, description, date, isDone, timeEstimation },
  ] of Object.entries(data)) {
    const liEl = document.createElement("li");

    liEl.innerHTML = `Task: ${title}, Description: ${description}, Date: ${date}, Done: ${isDone}, TimeEstimation: ${
      timeEstimation ? timeEstimation : 0
    } min`;

    toDoList.appendChild(liEl);
  }

  nextPageBtn.disabled = false; // Always enable next page button after navigating to previous
  prevPageBtn.disabled = pageIndex === 1; // Disable if at the first page
}


nextPageBtn.addEventListener("click", getNextPageItems);
prevPageBtn.addEventListener("click", getPrevPageItems);


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

const sortBtn = document.getElementById("sortBtn");
const filterBtn = document.getElementById("filterBtn");
const searchBtn = document.getElementById("searchBoxBtn");
sortBtn.addEventListener("click", checkAscOrDesc);
filterBtn.addEventListener("click", filterTrueFalse);
searchBtn.addEventListener("click", search);

async function initializeApp() {
  //const tasks = await getTasksFromServer();
  //const ulEl = document.getElementById("toDoList");
  loadTaskPropsIntoDropdown();
  getNextPageItems();

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

  // const addBtn = document.getElementById("addBtn");
  // addBtn.addEventListener("click", async (e) => {
  //   e.preventDefault();
  //   const isEdit = addBtn.textContent === "Edit Task";
  //   await updateOrCreateTask(isEdit);
  // });
}

// Run the app
initializeApp();
