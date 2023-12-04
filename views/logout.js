import { html, render } from "../node_modules/lit-html/lit-html.js"

const temp = html`<div id="top-links">
<a href="/login" class="top-link">Login</a>
<a href="/register" class="register-link">Register</a>
</div>`

const main = document.querySelector("main")

export function logout() {
    // render(temp, document.body)
    localStorage.clear()
    render(temp, main)
}