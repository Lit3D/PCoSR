
import { TRAINING_DURATION } from "./env.mjs"
import { Frame } from "./frame.mjs"

export class RealSenseProcessor extends EventTarget {
  #minDepth = 0
  #maxDepth = 0

  #width = 0
  #height = 0

  #pause = true
  start = () => {
    this.#pause = false
    this.training()
  }
  stop = () => this.#pause = true

  #etalonDepth = undefined

  #frames = undefined
  #selectedFrame = undefined

  #trainingDepthMode = false
  training = () => {
    console.debug(`RealSenseProcessor: Start training depth matrix`)
    this.#trainingDepthMode = true
    setTimeout(() => {
      this.#trainingDepthMode = false
      console.debug(`RealSenseProcessor: Stop training depth matrix`)
    }, TRAINING_DURATION)
  }

  #renderer = undefined
  attachRenderer = (renderer) => {
    this.#renderer = renderer
    this.#renderer.resize(this.#width, this.#height)
  }
  detachRenderer = () => this.#renderer = undefined

  constructor({
    minDepth = 0,
    maxDepth = 0,
    width = 0,
    height = 0,
    frames = [],
  }) {
    this.#minDepth = minDepth
    this.#maxDepth = maxDepth
    this.#width = width
    this.#height = height

    this.#frames = frames.map(item => {
      if (item instanceof Frame) {
        item.addEventListener("active", this.#onFrameActive)
        return item
      }

      const frame = new Frame(item)
      frame.addEventListener("active", this.#onFrameActive)
      return frame
    })

    this.#etalonDepth = new Array(this.#width * this.#height).fill(0)
  }

  #onFrameActive = ({detail}) => this.dispatchEvent(new CustomEvent("active", { detail }))

  process = (depthFrame) => {
    if (this.#pause) return
    this.#trainingDepth(depthFrame)
    this.#detect(depthFrame)
    this.#render(depthFrame)
  }

  #trainingDepth = (depthFrame) => {
    if (!this.#trainingDepthMode) return
    this.#etalonDepth = this.#etalonDepth.map((a, i) => {
      const b = depthFrame[i] ?? 0
      if (b < this.#minDepth || b > this.#maxDepth) return a
      if (a > 0 && b > 0) return Math.min(a, b)
      if (b > 0) return b
      return a
    })
  }

  #detect = (depthFrame) => {
    if (this.#trainingDepthMode) return
    this.#frames.forEach(frame => frame.detect(this.#etalonDepth, depthFrame))
  }

  #renderEtalon = false
  #render = (depthFrame) => {
    if (!this.#renderer) return
    if (this.#renderEtalon) depthFrame = this.#etalonDepth

    const depthZone = this.#maxDepth - this.#minDepth
    let depthPixelIndex = 0

    const pixelArray = this.#renderer.pixelArray
    const imageDataSize = pixelArray.length

    pointsLoop:
    for (let i = 0; i < imageDataSize; i+=4) {
      const y = Math.floor(depthPixelIndex / this.#width)
      const x = depthPixelIndex - y * this.#width
      const value = (depthFrame[y] ?? [])[x] ?? 0
      const etalon = this.#etalonDepth[depthPixelIndex] ?? 0
      depthPixelIndex++

      //Frames
      for (const frame of this.#frames) {
        if (frame.border(x,y)) {
          pixelArray[i  ] = frame === this.#selectedFrame ? 0xff : 0x00
          pixelArray[i+1] = frame === this.#selectedFrame ? 0x00 : 0xff
          pixelArray[i+2] = frame.isActive ? 0xff : 0x00
          pixelArray[i+3] = 0xff
          continue pointsLoop
        }

        if (frame.point(x,y)) {
          const delta = etalon - value
          if (frame.detectDelta(delta)) {
            pixelArray[i  ] = 0xff
            pixelArray[i+1] = 0x00
            pixelArray[i+2] = 0x00
            pixelArray[i+3] = 0xff
            continue pointsLoop
          }
        }
      }

      // Search depth
      if (value < this.#minDepth || value > this.#maxDepth) {
        pixelArray[i  ] = 0x00
        pixelArray[i+1] = 0x00
        pixelArray[i+2] = 0x00
        pixelArray[i+3] = 0xff
        continue
      }

      const gray = (value - this.#minDepth) / depthZone * 255
      pixelArray[i] = gray
      pixelArray[i+1] = gray
      pixelArray[i+2] = gray
      pixelArray[i+3] = 0xff
    }

    this.#renderer.draw()
  }

  addFrame = () => {
    this.#selectedFrame = new Frame()
    this.#selectedFrame.addEventListener("active", this.#onFrameActive)
    this.#frames = [...this.#frames, this.#selectedFrame]
  }

  removeFrame() {
    if (!this.#selectedFrame) return
    this.#selectedFrame.removeEventListener("active", this.#onFrameActive)
    this.#frames = this.#frames.filter(frame => frame !== this.#selectedFrame)
    this.#selectedFrame = undefined
  }

  nextFrame() {
    if (this.#frames.length === 0) return
    let i = this.#frames.findIndex(frame => frame === this.#selectedFrame) + 1
    if (i >= this.#frames.length) i = 0
    this.#selectedFrame = this.#frames[i]
  }

  prevFrame() {
    if (this.#frames.length === 0) return
    let i = this.#frames.findIndex(frame => frame === this.#selectedFrame) - 1
    if (i < 0) i = this.#frames.length - 1
    this.#selectedFrame = this.#frames[i]
  }

  keydown = (key, shiftKey) => {
    if (this.#selectedFrame && this.#selectedFrame.keydown(key, shiftKey)) return true

    switch(key) {
      case "T":
        this.#renderEtalon = !this.#renderEtalon
        return true

      case "N":
        this.addFrame()
        return true

      case "BACKSPACE":
        this.removeFrame()
        return true

      case "]":
        this.nextFrame()
        return true

      case "[":
        this.prevFrame()
        return true
    }
  }

  toJSON() {
    return {
      minDepth: this.#minDepth, maxDepth: this.#maxDepth, width: this.#width, height: this.#height,
      frames: this.#frames.map(frame => frame.toJSON())
    }
  }
}
