import { Slave } from "./slave.mjs"
import { UUIDv4 } from "./uuid.mjs"
//import { Master } from "./master.mjs"

const ID = (new URLSearchParams(window.location.search).get("id") || "").toLowerCase() || UUIDv4()

void async function main() {
  //const isMaster = new URLSearchParams(window.location.search).has("master")
  //if (isMaster) await new Master()

  await new Slave(ID)
}().catch(err => document.body.innerHTML = `<div class="error">ERROR: ${err}</div>`)
