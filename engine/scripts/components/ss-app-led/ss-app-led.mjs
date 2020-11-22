const TEMPLATE = `<link rel="stylesheet" type="text/css" href="${import.meta.url.replace(/\.m?js$/i, "")}.css">`

export class SSAppLedComponent extends HTMLElement  {
  static TAG_NAME = "ss-app-led"

  #root = this.attachShadow({ mode: "open" })

  constructor() {
    super()

    // Init root template
    this.#root.innerHTML = TEMPLATE
  }
}

customElements.define(SSAppLedComponent.TAG_NAME, SSAppLedComponent)