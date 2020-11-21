
import { SETUP_PROCESSOR_SYMBOL } from "./env.mjs"

export class RealSenseProcessor {
  #minDepth = 0
  #maxDepth = 0

  #width = 0
  #height = 0

  #pause = true
  start() { this.#pause = false }
  stop() { this.#pause = true }

  constructor() {}

  [SETUP_PROCESSOR_SYMBOL]({minDepth, maxDepth, width, height}) {
    this.#minDepth = minDepth
    this.#maxDepth = maxDepth
    this.#width = width
    this.#height = height
  }

  process = (depthFrame) => {
    if (this.#pause) return
    console.dir(depthFrame)
    this.#trainingDepth(depthFrame)
    this.#detect(depthFrame)
  }

  #trainingDepth = (depthFrame) => {

  }

  #detect = (depthFrame) => {

  }
}
