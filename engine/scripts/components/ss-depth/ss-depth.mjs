const TEMPLATE = `<link rel="stylesheet" type="text/css" href="${import.meta.url.replace(/\.m?js$/i, "")}.css">`

export class SSDepthComponent extends HTMLElement  {
  static TAG_NAME = "ss-depth"

  #root = this.attachShadow({ mode: "open" })

  #canvas = document.createElement("canvas")
  #ctx = this.#canvas.getContext("2d")
  #imageData = this.#ctx.createImageData(1, 1)

  #pixelArray = this.#imageData.data
  get pixelArray() { return this.#pixelArray }
  
  constructor() {
    super()

    // Init root template
    this.#root.innerHTML = TEMPLATE
    this.#root.appendChild(this.#canvas)
  }

  resize = (width, height) => {
    this.style.setProperty("--width", width)
    this.style.setProperty("--height", height)
    this.#canvas.width = width
    this.#canvas.height = height
    this.#imageData = this.#ctx.createImageData(width, height)
    this.#pixelArray = this.#imageData.data
  }

  draw = () => requestAnimationFrame(() => this.#ctx.putImageData(this.#imageData, 0, 0))
}

customElements.define(SSDepthComponent.TAG_NAME, SSDepthComponent)