
import { DEFAULT_FRAME_SIZE } from "./env.mjs"

export class Frame extends EventTarget {

  #action = 0

  #x = 0
  #y = 0
  #width = 0
  #height = 0

  #minSense = 0
  #maxSense = 0

  #pathos = 0

  #isActive = false
  get isActive() { return this.#isActive }
  set isActive(value) {
    if (value && !this.#isActive && this.#action > 0) {
      console.debug(`Frame [${this.#x}, ${this.#y}, ${this.#width}, ${this.#height}] active ${this.#action} action`)
      this.dispatchEvent(new CustomEvent("active", { detail: this.#action }))
    }
    this.#isActive = value
  }

  get x1() { return this.#x }
  get x2() { return this.#x + this.#width }
  get y1() { return this.#y }
  get y2() { return this.#y + this.#height }

  constructor({
    x = 0,
    y = 0,
    width = DEFAULT_FRAME_SIZE,
    height = DEFAULT_FRAME_SIZE,
    minSense = 0,
    maxSense = 0,
    pathos = 0,
    action = 0,
  } = {}){
    super()
    this.#x = x
    this.#y = y
    this.#width = width
    this.#height = height
    this.#minSense = minSense
    this.#maxSense = maxSense
    this.#pathos = pathos
    this.#action = action
  }

  toJSON() {
    return {
      x: this.#x, y: this.#y, width: this.#width, height: this.#height,
      minSense: this.#minSense, maxSense: this.#maxSense, pathos: this.#pathos,
      action: this.#action,
    }
  }

  border = (x, y) => {
    const { x1, y1, x2, y2 } = this
    if (x === x1 && y >= y1 && y <= y2) return true
    if (x === x2 && y >= y1 && y <= y2) return true
    if (y === y1 && x >= x1 && x <= x2) return true
    if (y === y2 && x >= x1 && x <= x2) return true
    return false
  }

  point = (x, y) => {
    const { x1, y1, x2, y2 } = this
    return x >= x1 && x <= x2 && y >= y1 && y <= y2
  }

  detectDelta = delta => delta > this.#minSense && delta < this.#maxSense

  detect = (etalonDepth, depthFrame) => {
    const { x1, y1, x2, y2 } = this
    let activePoints = 0
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        const etalon = (etalonDepth[y] ?? [])[x] ?? 0
        const value = (depthFrame[y] ?? [])[x] ?? 0
        if  (etalon <= 0 || value <= 0) continue

        const delta = etalon - value
        if (this.detectDelta(delta)) activePoints++
      }
    }

    return this.isActive = activePoints > this.#pathos
  }

  #configDepth = () => {
    let result = prompt(
      "Настройка глубины",
      `{ minSense: ${this.#minSense}, maxSense: ${this.#maxSense}, pathos: ${this.#pathos} }`,
    )

    if (!result) return
    try {
      result = JSON.parse(result)
    } catch(err) {
      return
    }

    const { minSense, maxSense, pathos } = {
      minSense: this.#minSense,
      maxSense: this.#maxSense,
      pathos: this.#pathos,
    ...result }

    this.#minSense = minSense
    this.#maxSense = maxSense
    this.#pathos = pathos
  }

  #configAction = () => {
    let result = prompt("SS data id: ", this.#action)
    if (!result) return
    result = Number.parseInt(result)
    if (!Number.isFinite(result) || result <= 0) return
    this.#action = result
  }

  keydown = (key, shiftKey) => {
    switch(key) {
      case "D":
        if (shiftKey) return false
        this.#configDepth()
        return true

      case "A":
        if (shiftKey) return false
        this.#configAction()
        return true

      case "ARROWUP":
        if (shiftKey) {
          this.#height = this.#height - 1
          return true
        }
        this.#y = this.#y - 1
        return true

      case "ARROWDOWN":
        if (shiftKey) {
          this.#height = this.#height + 1
          return true
        }
        this.#y = this.#y + 1
        return true

      case "ARROWLEFT":
        if (shiftKey) {
          this.#width = this.#width - 1
          return true
        }
        this.#x = this.#x - 1
        return true

      case "ARROWRIGHT":
        if (shiftKey) {
          this.#width = this.#width + 1
          return true
        }
        this.#x = this.#x + 1
        return true
    }
    return false
  }
}