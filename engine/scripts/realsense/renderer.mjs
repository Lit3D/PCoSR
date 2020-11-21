
import { SETUP_PROCESSOR_SYMBOL } from "./env.mjs"

export class RealSenseRenderer extends EventTarget {
  #minDepth = 0
  #maxDepth = 0

  #width = 0
  #height = 0

  #ctx = undefined
  #imageData = undefined
  #pixelArray = undefined
  #imageDataSize = undefined

  #pause = true
  start() { this.#pause = false }
  stop() { this.#pause = true }

  constructor(ctx) {
    super()
    this.#ctx = ctx
  }

  [SETUP_PROCESSOR_SYMBOL]({minDepth, maxDepth, width, height}) {
    this.#minDepth = minDepth
    this.#maxDepth = maxDepth
    this.#width = width
    this.#height = height

    this.#imageData = this.#ctx.createImageData(this.#width, this.#height)
    this.#pixelArray = this.#imageData.data
    this.#imageDataSize = this.#pixelArray.length

    this.dispatchEvent(new CustomEvent("setup", { detail: {minDepth, maxDepth, width, height} }))
  }

  process = (depthFrame) => {
    if (this.#pause) return
    this.#render(depthFrame)
    console.dir(depthFrame)
  }

  #render = (depthFrame) => {
    const depthZone = this.#maxDepth - this.#minDepth
    let depthPixelIndex = 0

    for (let i = 0; i < this.#imageDataSize; i+=4) {
      const y = Math.floor(depthPixelIndex / this.#width)
      const x = depthPixelIndex - y * this.#width
      const value = (depthFrame[y] ?? [])[x] ?? 0
      depthPixelIndex++

      // Search depth
      if (value < this.#minDepth || value > this.#maxDepth) {
        this.#pixelArray[i  ] = 0xff
        this.#pixelArray[i+1] = 0x00
        this.#pixelArray[i+2] = 0x00
        this.#pixelArray[i+3] = 0xff
        continue
      }

      //const gray = value / MAX_DEPTH * 255
      const gray = (value - this.#minDepth) / depthZone * 255
      this.#pixelArray[i] = gray
      this.#pixelArray[i+1] = gray
      this.#pixelArray[i+2] = gray
      this.#pixelArray[i+3] = 0xff
    }

    requestAnimationFrame(() => this.#ctx.putImageData(this.#imageData, 0, 0))
  }
}
