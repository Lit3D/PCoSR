// import { Scenario } from "./scenario.mjs"
import { QClient } from "./q-client.mjs"

export class Master {
  #qClient = undefined
  #qPathMaster = `/lit3d/master`
  #qPathSlave = `/lit3d/slave`

  constructor() {
    return this.#init()
  }

  #init = async () => {
    // Init MQTT
    this.#qClient = await new QClient()

    await this.#qClient.subscribe(`${this.#qPathMaster}/volume`, this.#setVolume)
    await this.#qClient.publish(`${this.#qPathMaster}/volume`, null)
  }

  #setVolume = (volume) => {
    if (!Number.isFinite(volume) || volume < 0 || volume > 100) return
  }


  // #scenario = undefined

  // #newScenario = async ({ detail: { id = "main", step = 0 } = {} }) => {
  //   this.#scenario && this.#scenario.destruct()
  //   this.#scenario = await new Scenario(id)
  //   this.#scenario.step(step)
  // }

  // constructor(initialScenario) {
  //   // const eventBus = new EventBus()
  //   // eventBus.addEventListener(SCENARIO_START, this.#newScenario)
  //   if (initialScenario) this.#newScenario()
  // }
}
