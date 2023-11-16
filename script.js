async function solve(){
    const getTasks = await fetch("http://localhost:3000/results");
    const tasks = await getTasks.json();
    const ulEl = document.getElementById("toDoList")
    
    for (const [id, {title, description, date, isDone}] of Object.entries(tasks)) {
        const liEl = document.createElement("li");
        liEl.textContent = `Task: ${title}, Description: ${description}, Date: ${date}, Done: ${isDone}`;
        ulEl.appendChild(liEl);
    }

    const addBtn = document.getElementById("addBtn")
    const titleInput = document.getElementById("title")
    const descInput = document.getElementById("desc")
    const dateInput = document.getElementById("date")
    const checkBox = document.getElementById("check")
    let isChecked = checkBox.checked;

    addBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const data = {title: titleInput.value, description: descInput.value, date: dateInput.value, isDone: isChecked}
        fetch("http://localhost:3000/results", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        titleInput.value = "";
        descInput.value = "";
        dateInput.value = "";   
        checkBox.checked = false;
        console.log(data);
    })
    
}

solve();