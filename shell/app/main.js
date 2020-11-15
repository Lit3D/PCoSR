const { app, BrowserWindow, powerSaveBlocker, globalShortcut, dialog } = require("electron")
const WINDOW_OPTIONS = require("./window-options.js")

const { DISPLAY } = require("./pages/index.js")
const { Config } = require("./config/config.js")
const { ENGINE_HOST } = require("./config/platform.js")

const REMOTE_DEBUGGING_PORT = 1337
const CHESS_BOARD_TIMEOUT = 10 * 1000 // 30s

// Suppress error dialogs by overriding
dialog.showErrorBox = (title, content) => console.error(`${title}\n${content}`)

const powerSaveID = powerSaveBlocker.start("prevent-display-sleep")

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required")
app.commandLine.appendSwitch("disable-renderer-backgrounding")
app.commandLine.appendSwitch("force-device-scale-factor", "1")
app.commandLine.appendSwitch("high-dpi-support", "1")
app.commandLine.appendSwitch("ignore-certificate-errors")
app.commandLine.appendSwitch("ignore-connections-limit", `localhost,${ENGINE_HOST}`)
app.commandLine.appendSwitch("ignore-gpu-blacklist")
app.commandLine.appendSwitch("no-proxy-server")
app.commandLine.appendSwitch("remote-debugging-port", String(REMOTE_DEBUGGING_PORT))

app.commandLine.appendSwitch("video-threads", 48)

const DISABLE_VIDEO_ACCELERATION_RX = /\s*\-*disable\-?video\-?acceleration\s*/i
if (process.argv.some(arg => DISABLE_VIDEO_ACCELERATION_RX.test(arg))) {
  app.commandLine.appendSwitch("disable-accelerated-mjpeg-decode")
  app.commandLine.appendSwitch("disable-accelerated-video-decode")
  app.commandLine.appendSwitch("disable-accelerated-video-encode")
}

const DISABLE_HARDWARE_ACCELERATION_RX = /\s*\-*disable\-?hardware\-?acceleration\s*/i
if (process.argv.some(arg => DISABLE_HARDWARE_ACCELERATION_RX.test(arg))) {
  app.disableHardwareAcceleration()
}

app.on("ready", main)
app.on("window-all-closed", exit)

let windows = []

function exit() {
  windows.forEach(w => w.close())
  powerSaveBlocker.stop(powerSaveID)
  app.exit()
}

function reload() {
  windows.forEach(w => w.webContents.reloadIgnoringCache())
} 

let allowClient = true

function urls() {
  allowClient = false
  windows.forEach(w => w.loadURL("chrome://chrome-urls/"))
}

function gpu() {
  allowClient = false
  windows.forEach(w => w.loadURL("chrome://gpu/"))
}

function initViewPorts({ engine, viewPorts, mac, IPv4, IPv6, hostname }) {
  for (const {id, x, y, width, height, fullscreen, content} of viewPorts) {

    const position =  fullscreen ? {
                        x: x + width / 4,
                        y: y + height / 4,
                        width: width / 2,
                        height: height / 2,
                      } : {
                        x, y, width, height,
                      }

    let win = new BrowserWindow({
      ...WINDOW_OPTIONS,
      ...position,
      fullscreen, kiosk: fullscreen,
    })

    win.on("closed", () => {
      windows = windows.filter(w => w !== win)
      win = null
    })

    win.removeMenu()
    !fullscreen && win.setSize(width, height)

    const url = content || `${engine}?id=${id}`
    win.loadURL(DISPLAY({x, y, width, height, id: id, mac, IPv4, IPv6, hostname, url }))
    setTimeout(() => allowClient && win && win.loadURL(url), CHESS_BOARD_TIMEOUT)
    
    win.show()
    windows.push(win)
  }
}

function initGlobalShortcut() {
  globalShortcut.register("CommandOrControl+G", gpu)
  globalShortcut.register("CommandOrControl+Q", exit)
  globalShortcut.register("CommandOrControl+U", urls)
  globalShortcut.register("F5", reload)
}

function main() {
  const config = Config.GetConfig()
  initViewPorts(config)
  initGlobalShortcut()
}
