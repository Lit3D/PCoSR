import { RealSense, RealSenseRenderer } from "../../realsense/index.mjs"

const TEMPLATE = `<link rel="stylesheet" type="text/css" href="${import.meta.url.replace(/\.m?js$/i, "")}.css">`

export class SSDepthComponent extends HTMLElement  {
  static TAG_NAME = "ss-depth"

  #realSense = undefined
  #renderer = undefined

  #root = this.attachShadow({ mode: "open" })

  #canvas = document.createElement("canvas")
  #ctx = this.#canvas.getContext("2d")
  
  constructor() {
    super()

    // Init root template
    this.#root.innerHTML = TEMPLATE
    this.#root.appendChild(this.#canvas)
  }

  #resize = ({detail: {width, height}}) => {
    this.style.setProperty("--width", width)
    this.style.setProperty("--height", height)
    this.#canvas.width = width
    this.#canvas.height = height
  }

  async connectedCallback() {
    this.#realSense = await new RealSense()
    this.#renderer = new RealSenseRenderer(this.#ctx)
    this.#renderer.addEventListener("setup", this.#resize, { once: true })
    this.#realSense.attachProcessor(this.#renderer)
    this.#renderer.start()
  }

  disconnectedCallback() {
    this.#realSense.detachProcessor(this.#renderer)
    this.#realSense.release()
  }
}

customElements.define(SSDepthComponent.TAG_NAME, SSDepthComponent)