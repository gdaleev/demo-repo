import page from "../node_modules/page/page.mjs";
import { html, render } from "../node_modules/lit-html/lit-html.js";
const main = document.querySelector("main");

const loginTemp = html`<div id="top-links">
    <a href="/login" class="top-link">Login</a>
    <a href="/register" class="register-link">Register</a>
  </div>
  <form @submit=${onSubmit} id="loginForm">
    <h1>Login</h1>
    <label for="username">Username:</label><br />
    <input type="text" id="username" name="username" /><br />
    <label for="password">Password:</label><br />
    <input type="password" id="password" name="password" /><br />
    <button id="login">Sign In</button>
  </form>`;

export function loginView() {
  // e.preventDefault();
  render(loginTemp, main);
}

async function onSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const { username, password } = Object.fromEntries(formData);
  if (username == "" || password == "") {
    window.alert("There are empty fields!");
    return;
  } else {
    const response = await fetch("http://localhost:3000/users");
    const userData = await response.json();

    const userFound = userData.find(
      ({ username, password }) => username === username && password === password
    );

    if (userFound) {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
      window.alert(`Welcome, ${username}!`);
      page.redirect("/home");
    } else {
      window.alert("Invalid username or password!");
    }
  }
}
