
import { UUIDv4 } from "../uuid.mjs"
import * as TYPES from "./types.mjs"

const TYPES_VALUES = Object.values(TYPES)

export class Message extends CustomEvent {
  #id = undefined
  get id() { return this.#id }

  #from = undefined
  get from() { return this.#from }

  #to = undefined
  get to() { return this.#to }

  constructor({Id, From, To, Type, Detail}) {
    if (!TYPES_VALUES.includes(Type)) {
      throw new Error(`Incorrect message type of "${Type}"`)
    }

    super(Type, { detail: Detail })
    this.#id = Id ?? UUIDv4()
    this.#from = From
    this.#to = To
  }

  toJSON() {
    return {
      Id:     this.#id,
      From:   this.#from,
      To:     this.#to,
      Type:   this.type,
      Detail: this.detail,
    }
  }

  toString() {
    JSON.stringify(this)
  }
}
