import { html, render } from "../node_modules/lit-html/lit-html.js";

const main = document.querySelector("main");

const userTemp = html`<div id="top-links">
<a href="/logout" class="logout-link">Logout</a>
</div>
<h1>ToDo List</h1>
<select class="category"></select>
<select class="sort">
<option>Ascending</option>
<option>Descending</option>
</select> 
<button id="sortBtn" class="button success">Sort</button><br>
<label for="">Is task done?</label>
<select class="filterDoneOrNot">
<option>true</option>
<option>false</option>
</select>
<button id="filterBtn" class="button warning">Filter</button><br>
<label for="searchBox">Search for task:</label><br /> 
<input type="text" id="searchBox" name="searchBox"/>
<button id="searchBoxBtn">Search</button>
<ul id="toDoList"></ul>
<label>Page:</label><br>
<button id="previousPage">←</button>
<label id="pageIndex">1</label>
<button id="nextPage">→</button>

<form id="addTaskform">
<h2>Add Task:</h2>
<input
type="text"
id="identifier"
name="identifier"
style="display: none"
readonly
/><br />
<label for="title">Title:</label><br />
<input type="text" id="title" name="title" required/><br />
<label for="desc">Description:</label><br />
<input type="text" id="desc" name="desc" required/><br />
<label for="desc">Date:</label><br />
<input type="text" id="date" name="date" required/><br />
<label for="time">Estimated time:</label><br />
<input type="text" id="time" name="time" required/><br />
<label for="isDone">Is task done?</label><br />
<input type="checkbox" id="check" name="check" required/><br />
<button id="addBtn" class="button primary">Add Task</button>
</form>`

export function userView() {
    render(userTemp, main)
}