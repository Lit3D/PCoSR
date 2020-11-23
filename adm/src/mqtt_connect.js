import { connect } from 'mqtt';
//const HOST = ${window.location.origin.replace(/^http/,"ws")}/mqtt
export class QClient {
    static instance = undefined
    host = "ws://wb.pcosr.local:18883/mqtt"
    //host = `${window.location.origin.replace(/^http/,"ws")}/mqtt`
    options = {
        keepalive: 30,
        clientId: "Admin-" + Math.random().toString(16).substr(2, 8),
        protocolId: "MQTT",
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 10 * 1000,
        rejectUnauthorized: false
      }

    constructor() {
        if(QClient.instance !== undefined) return QClient.instance
        this.init()
        return QClient.instance = this
    }

    init() {
        this.client = connect(this.host, this.options)
        this.client.on('error', err => {
            console.error(err)
            this.client.end()
        })
        this.client.on("connect", () =>{
            console.log(`MQTT hub [${this.host}] connected`)
        })
    }

    set(path, value) {
        this.client.publish(path, value, { qos: 0, retain: false}, err => {
            if (err) console.error(err)
        })
    }
1}