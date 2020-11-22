import { UUIDv4 } from "./uuid.mjs"

const ID = (new URLSearchParams(window.location.search).get("id") || "").toLowerCase() || UUIDv4()
const APP_MODULE = `./components/ss-app-${ID}/index.mjs`
document.title += ` - ${ID}`
document.body.classList.add(`sw--${window.screen.width}`)

void async function main() {
  const { default: SSAppComponent } = await import(APP_MODULE)
  document.body.appendChild(new SSAppComponent())
}().catch(err => {
  console.error(err)
  document.body.innerHTML = `<div class="error">GLOBAL ERROR: ${err}</div>`
})
