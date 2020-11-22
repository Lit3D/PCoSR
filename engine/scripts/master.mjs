import { QClient, Q_PATH_MASTER, Q_PATH_LED, Q_PATH_LINE } from "./q-client.mjs"

const Q_PATH = Q_PATH_MASTER

export class Master {
  #qClient = undefined

  #visualData = []

  constructor() {
    return this.#init()
  }

  #visualCmd = ({ id, lang = "ru" } = {}) => {
    console.debug(`Master [VISUAL]: ${JSON.stringify({id, lang})}`)
    if (id === undefined || id === null) return

    const data = this.#visualData.find(item => item.id === id )
    if (!data) return console.error(`Master [VISUAL] incorrect ID: ${id}`)

    const { led, line } = data[lang] ?? {}
    if (!led) return console.error(`Master [VISUAL] incorrect Lang: ${lang}`)

    Promise.all([
      this.#qClient.publish(`${Q_PATH_LED}/video`, { src: led }),
      this.#qClient.publish(`${Q_PATH_LINE}/wave`, { src: line }),
    ]).catch(err => console.error(`Master [VISUAL] error: ${err.message}`))
  }

  #init = async () => {
    const response = await fetch(SS_DATA_URL)
    this.#visualData = await response.json()

    this.#qClient = await new QClient()
    await this.#qClient.subscribe(`${Q_PATH}/visual`, this.#visualCmd)
    await this.#qClient.publish(`${Q_PATH}/visual`, {})

    return this
  }

  release = async () => {
    await this.#qClient.unsubscribe(`${Q_PATH}/visual`, this.#visualCmd)
  }
}
