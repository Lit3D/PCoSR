export class Cache {
  static _instance = new Cache()
  constructor() { return Cache._instance ?? this }

  #map = new Map()

  get = url => {
    if (this.#map.has(url)) return this.#map.get(url)
    this.#fetch(url)
        .then(() => console.debug(`Cache [fetch] success: ${url}`))
        .catch(err => console.error(`Cache [fetch] error: ${err}`))
    return url
  }

  #fetch = async url => {
    const response = await fetch(url, { method: "GET", cache: "no-cache" })
    const blob = await response.blob()
    const data = URL.createObjectURL(blob)
    this.#map.set(url, data)
  }

  clear = () => this.#map.clear()
}
