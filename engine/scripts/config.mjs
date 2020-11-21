
export class Config extends EventTarget {
  #url = undefined
  #reloadTimeout = undefined

  #data = null
  get data() { return this.#data }

  constructor(url, reloadTimeout = 0) {
    this.#url = url
    this.#reloadTimeout = reloadTimeout
    return this.#init
  }

  #init = async () => {
    await this.#getData()
    return this
  }

  #getData = async () => {
    let response = undefined
    try {
      response = await fetch(this.#url)
    } catch (err) {
      console.error(`Config [${this.#url}] fetch error: ${err.message}`)
      return
    }

    let data
    try {
      data = await response.json()
    } catch (err) {
      console.error(`Config [${this.#url}] parse error: ${err.message}`)
      return
    }

    this.#data = data
    this.dispatchEvent(new Event("change"))
    if (this.#reloadTimeout > 0) setTimeout(this.#reload, this.#reloadTimeout)
  }
}