import { Slave } from "./slave.mjs"
//import { Master } from "./master.mjs"

void async function main() {
  //const isMaster = new URLSearchParams(window.location.search).has("master")
  //if (isMaster) await new Master()

  await new Slave()
}().catch(err => document.body.innerHTML = `<div class="error">ERROR: ${err}</div>`)
