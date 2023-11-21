async function solve() {
  const addBtn = document.getElementById("addBtn");
  const titleInput = document.getElementById("title");
  const descInput = document.getElementById("desc");
  const dateInput = document.getElementById("date");
  const checkBox = document.getElementById("check");
  const idInput = document.getElementById("identifier");
  let isChecked = checkBox.checked;

  const getTasks = await fetch("http://localhost:3000/results");
  const tasks = await getTasks.json();
  const ulEl = document.getElementById("toDoList");

  function showEditForm() {
    idInput.style.display = "block";
    const h2 = document.getElementsByTagName("h2")[0];
    h2.textContent = "Edit Task:";
    const button = document.getElementById("addBtn");
    button.textContent = "Edit Task";
  }

  tasks.forEach((task) => {
    const { id, title, description, date, isDone } = task;
    const liEl = document.createElement("li");
    liEl.innerHTML = `Task: ${title}, Description: ${description}, Date: ${date}, Done: ${isDone}`;
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    liEl.appendChild(editBtn);

    editBtn.addEventListener("click", (e) => {
      showEditForm();
      idInput.value = id;
      titleInput.value = title;
      descInput.value = description;
      dateInput.value = date;
      isChecked = isDone;

      if (isDone == true) {
        checkBox.checked = true;
      } else {
        checkBox.checked = false;
      }
    });

    ulEl.appendChild(liEl);
  });

  addBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (addBtn.textContent == "Edit Task") {
      const data = {
        title: titleInput.value,
        description: descInput.value,
        date: dateInput.value,
        isDone: checkBox.checked == true ? true : false,
      };
      fetch(`http://localhost:3000/results/${idInput.value}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      titleInput.value = "";
      descInput.value = "";
      dateInput.value = "";
      checkBox.checked = false;
    } else {
      const data = {
        title: titleInput.value,
        description: descInput.value,
        date: dateInput.value,
        isDone: isChecked,
      };
      fetch("http://localhost:3000/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      titleInput.value = "";
      descInput.value = "";
      dateInput.value = "";
      checkBox.checked = false;
    }
  });
}

solve();