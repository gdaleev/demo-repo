import page from "../node_modules/page/page.mjs";
import { html, render } from "../node_modules/lit-html/lit-html.js";
const main = document.querySelector("main");

const registerTemp = html`<div id="top-links">
    <a href="/login" class="top-link">Login</a>
    <a href="/register" class="register-link">Register</a>
  </div>
  <form @submit=${onSubmit} id="registerForm">
    <h1>Register</h1>
    <label for="username">Username:</label><br />
    <input type="text" id="username" name="username" /><br />
    <label for="password">Password:</label><br />
    <input type="password" id="password" name="password" /><br />
    <label for="repass">Repeat password:</label><br />
    <input type="password" id="repass" name="repass" /><br />
    <button id="register">Sign Up</button>
  </form>`;

export function registerView() {
  render(registerTemp, main);
}

async function onSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const { username, password, repass } = Object.fromEntries(formData);
  if (username == "" || password == "" || password !== repass) {
    window.alert("There are empty fields or passwords don't match!");
    return;
  } else {
    const url = "http://localhost:3000/users";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          permissions: ['canCreateNewTasks', 'canReadTasks', 'canUpdateOwnTasks', 'canDeleteOwnTasks'],
          ownerId: ""
        }),
      });

      if (response.ok) {
        console.log("User registered successfully!");
        page.redirect("/login")
      } else {
        console.error("Failed to register user:", response.statusText);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }
}