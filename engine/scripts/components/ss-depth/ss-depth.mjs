import { RealSenseClient } from "../../realsense.mjs"

const TEMPLATE = `<link rel="stylesheet" type="text/css" href="${import.meta.url.replace(/\.m?js$/i, "")}.css">`

const WIDTH = 270
const HEIGHT = 480

const MIN_DEPTH = 0
const MAX_DEPTH = 3000
const MIN_SENSE = 3
const MAX_SENSE = 30

export class SSDepthComponent extends HTMLElement  {
  static TAG_NAME = "ss-depth"

  #realSenseClient = undefined

  #root = this.attachShadow({ mode: "open" })

  #canvas = document.createElement("canvas")
  #ctx = this.#canvas.getContext("2d")
  #imageData = this.#ctx.createImageData(WIDTH, HEIGHT)
  #pixelArray = this.#imageData.data
  #imageDataSize = this.#pixelArray.length

  //#etalon = new Array(WIDTH * HEIGHT).fill(0)

  constructor() {
    super()

    // Init root template
    this.#root.innerHTML = TEMPLATE

    this.style.setProperty("--width", WIDTH);
    this.style.setProperty("--height", HEIGHT);

    // Setup canvas
    this.#canvas.width = WIDTH
    this.#canvas.height = HEIGHT
    this.#root.appendChild(this.#canvas)
  }

  #depthFrame = ({detail}) => {
    this.#render(detail)
  }

  #render = depth => {
    console.dir(depth)
    let depthPixelIndex = 0

    for (let i = 0; i < this.#imageDataSize; i+=4) {
      const y = Math.floor(depthPixelIndex / WIDTH)
      const x = depthPixelIndex - y * WIDTH
      const value = (depth[y] ?? [])[x] ?? 0
      depthPixelIndex++

      const gray = value / MAX_DEPTH * 255
      this.#pixelArray[i] = gray
      this.#pixelArray[i+1] = gray
      this.#pixelArray[i+2] = gray
      this.#pixelArray[i+3] = 0xff
    }

    requestAnimationFrame(() => this.#ctx.putImageData(this.#imageData, 0, 0))
  }

  connectedCallback() {
    this.#realSenseClient = new RealSenseClient("wss://depth-1.pcosr.local:8080", 0)
    this.#realSenseClient.addEventListener("depth", this.#depthFrame)
  }

  disconnectedCallback() {
    this.#realSenseClient.removeEventListener("depth", this.#depthFrame)
    this.#realSenseClient.release()
  }
}

customElements.define(SSDepthComponent.TAG_NAME, SSDepthComponent)