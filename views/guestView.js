import { html, render } from "../node_modules/lit-html/lit-html.js"

const temp = html`<div id="top-links">
<a href="/login" class="top-link">Login</a>
<a href="/register" class="register-link">Register</a>
</div>`

const main = document.querySelector("main")

export function guestView() {
    // render(temp, document.body)
    render(temp, main)
}