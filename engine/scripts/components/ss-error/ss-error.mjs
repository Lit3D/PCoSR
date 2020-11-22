const TEMPLATE = `
  <link rel="stylesheet" type="text/css" href="${import.meta.url.replace(/\.m?js$/i, "")}.css">
  <h1 class="header">ERROR:</h1>
`

export class SSErrorComponent extends HTMLElement {
  static TAG_NAME = "ss-error"

  #root = this.attachShadow({ mode: "open" })
  #message = document.createElement("span")

  constructor(message = "") {
    super()

    // Init root template
    this.#root.innerHTML = TEMPLATE

    // Set message
    this.#message.classList.add("message")
    this.#message.innerText = message
    this.#root.appendChild(this.#message)
  }
}