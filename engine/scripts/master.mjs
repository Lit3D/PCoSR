import { QClient, Q_PATH_MASTER, Q_PATH_LED, Q_PATH_LINE } from "./q-client.mjs"
import { RealSense } from "./realsense/index.mjs"

const Q_PATH = Q_PATH_MASTER
const VISUAL_DATA_URL = "/config/visual.json"
const SCENARIOS_DATA_URL = "/config/scenarios.json"
const SELECTORS_DATA_URL = "/config/selectors.json"

export class Master {
  #qClient = undefined
  #realsense = undefined

  #visualData = []
  #scenarios = []
  #selectors = []

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
      this.#qClient.publish(`${Q_PATH_LED}/video`, { src: led, muted: false }),
      this.#qClient.publish(`${Q_PATH_LINE}/wave`, { src: line }),
    ]).catch(err => console.error(`Master [VISUAL] error: ${err.message}`))
  }

  #currentScenario = undefined
  #step = -1

  #scenarioCmd = ({ id, lang = "ru" } = {}) => {
    console.debug(`Master [SCENARIO]: ${JSON.stringify({id, lang})}`)
    if (id === undefined || id === null) return this.#scenarioEnd()
    this.#currentScenario = this.#scenarios.find(item => item.id === id && item.lang === lang)
    if (!this.#currentScenario) return this.#scenarioEnd()
    this.#step = -1
    this.#scenarioStep()
  }

  #scenarioStep = () => {
    if (!this.#currentScenario) return
    this.#step += 1
    console.debug(`Master [SCENARIO STEP]: ${JSON.stringify({step: this.#scenarioStep})}`)
    const lang = this.#currentScenario.lang
    const id = this.#currentScenario.steps[this.#step]
    if (!id) return this.#scenarioEnd()
    this.#visualCmd({ id, lang })
  }

  #scenarioEnd = () => {
    console.debug(`Master [SCENARIO END]`)

    Promise.all([
      this.#qClient.publish(`${Q_PATH_LED}/splash`, {}),
      this.#qClient.publish(`${Q_PATH_LINE}/wave`, {}),
    ]).catch(err => console.error(`Master [SCENARIO] error: ${err.message}`))

    this.#currentScenario = undefined
    this.#step = -1
    return
  }

  #init = async () => {
    let response = await fetch(VISUAL_DATA_URL)
    this.#visualData = await response.json()

    response = await fetch(SCENARIOS_DATA_URL)
    this.#scenarios = await response.json()

    response = await fetch(SELECTORS_DATA_URL)
    this.#selectors = await response.json()

    this.#qClient = await new QClient()
    await this.#qClient.subscribe(`${Q_PATH}/visual`, this.#visualCmd)
    await this.#qClient.publish(`${Q_PATH}/visual`, {})
    await this.#qClient.subscribe(`${Q_PATH}/scenario`, this.#scenarioCmd)
    await this.#qClient.publish(`${Q_PATH}/scenario`, {})

    await this.#qClient.subscribe(`${Q_PATH_LED}/video/ended`, this.#scenarioStep)
    await this.#qClient.publish(`${Q_PATH_LED}/video/ended`, 1)

    this.#realsense = await new RealSense()
    this.#realsense.onActive(this.#onActive)

    return this
  }

  #onActive = (id) => {
    if (!Number.isFinite(id) || id < 0) return console.error(`Master [onActive] incorrect active id: ${id}`)
    const monitor = this.#selectors.find(({ss}) => ss.includes(id))?.id
    if (!Number.isFinite(monitor) || monitor < 0) return console.error(`Master [onActive] incorrect monitor id: ${monitor} by id: ${id}`)
    console.debug(`Master [onActive] active: ${JSON.stringify({id, monitor})}`)
    this.#qClient
        .publish(`${Q_PATH_LINE}/${monitor}/ss`, { id, muted: true, restart: false })
        .catch(err => console.error(`Master [onActive] error: ${err.message}`))
  }

  release = async () => {
    this.#realsense.offActive(this.#onActive)
    await this.#realsense.release()
    await this.#qClient.unsubscribe(`${Q_PATH}/visual`, this.#visualCmd)
    await this.#qClient.unsubscribe(`${Q_PATH}/scenario`, this.#scenarioCmd)
  }
}
