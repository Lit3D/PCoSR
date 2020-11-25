<template>
    <div class="tech">

        <h1>Техническое управление</h1>

        <div class="block">
            <span class="demonstration">Потолочный свет</span>
            <el-slider v-model="mainLight"></el-slider>
            <div class="btns">
                <el-button type="primary" round @click="mainLight = 0">0%</el-button>
                <el-button type="primary" round @click="mainLight = 100">100%</el-button>
            </div>
        </div>

        <div class="block">
            <span class="demonstration">Ниша верхний свет</span>
            <el-slider v-model="nicheTopLight"></el-slider>
                        <div class="btns">
                <el-button type="primary" round @click="nicheTopLight = 0">0%</el-button>
                <el-button type="primary" round @click="nicheTopLight = 100">100%</el-button>
            </div>

        </div>

        <div class="block">
            <span class="demonstration">Ниша нижний свет</span>
            <el-slider v-model="nicheBottomLight"></el-slider>
            <div class="btns">
                <el-button type="primary" round @click="nicheBottomLight = 0">0%</el-button>
                <el-button type="primary" round @click="nicheBottomLight = 100">100%</el-button>
            </div>
        </div>

        <div class="block">
            <span class="demonstration">Свет Европа-Азия</span>
            <el-slider v-model="europeAsiaLight"></el-slider>
                        <div class="btns">
                <el-button type="primary" round @click="europeAsiaLight = 0">0%</el-button>
                <el-button type="primary" round @click="europeAsiaLight = 100">100%</el-button>
            </div>
        </div>

        <div style="display: flex; width: 100%; justify-content: space-between;">
            <div>
            <h3>Наружный свет</h3>
            <el-switch
  v-model="lightOuter"
  active-color="#13ce66"
  inactive-color="#ff4949">
</el-switch>
</div>
<div>
<h3>Наружные экспонаты</h3>
<el-switch
  v-model="lightExponates"
  active-color="#13ce66"
  inactive-color="#ff4949">
</el-switch>
</div>
<div>
<h3>Подсобка</h3>
<el-switch
  v-model="lightRoom"
  active-color="#13ce66"
  inactive-color="#ff4949">
</el-switch>
</div>
<div>
<h3>Приточка</h3>
<el-switch
  v-model="ventilation"
  active-color="#13ce66"
  inactive-color="#ff4949">
</el-switch>
</div>
<div>
<h3>Вытяжка</h3>
<el-switch
  v-model="ventilationHood"
  active-color="#13ce66"
  inactive-color="#ff4949">
</el-switch>
</div>

        </div>

    </div>


</template>

<script>
import { QClient } from "../mqtt_connect.js"

    // function getMessage(topic, message, packet) {
    //             console.log(this)
    //             console.log(topic, message, packet)
    //         }

    export default {
        name: 'Tech',
        components: {
        },
        props: {
            showDialog: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                mainLight: 0,
                nicheTopLight: 0,
                nicheBottomLight: 0,
                europeAsiaLight: 0,
                lightOuter: false,
                lightExponates: false,
                lightRoom: false,
                ventilation: false,
                ventilationHood: false,
                qClient: new QClient(),
                skipWatch: false
            }
        },
        methods: {
            getMessage: function(topic, message, packet) {
                console.log(this)
                console.log(topic, message, packet)
                let tempLight
                this.skipWatch = true
                switch (topic) {
                    case '/devices/wb-dac/controls/EXT1_O1':
                    case '/devices/wb-dac/controls/EXT1_O2': 
                        tempLight = Math.round(this.convert(message) / 100)
                        if(tempLight != this.mainLight) {
                            this.mainLight = tempLight
                        }
                        break
                    case '/devices/wb-dac/controls/EXT1_O3':
                        tempLight = Math.round(this.convert(message) / 100)
                        if(tempLight != this.nicheBottomLight) {
                            this.nicheBottomLight = tempLight
                        }
                        break
                    case '/devices/wb-dac/controls/EXT1_O4': 
                        tempLight = Math.round(this.convert(message) / 100)
                        if(tempLight != this.nicheTopLight) {
                            this.nicheTopLight = tempLight
                        }
                        break
                    case '/devices/wb-dac/controls/EXT1_O5': 
                        tempLight = Math.round(this.convert(message) / 100)
                        if(tempLight != this.europeAsiaLight) {
                            this.europeAsiaLight = tempLight
                        }
                        break
                    case '/devices/wb-gpio/controls/EXT2_R3A4': 
                        tempLight = Math.round(this.convert(message))
                        if(tempLight != this.ventilation) {
                            this.ventilation = tempLight
                        }
                        this.skipWatch = false
                        break
                    case '/devices/wb-gpio/controls/EXT2_R3A5': 
                        tempLight = Math.round(this.convert(message))
                        if(tempLight != this.ventilationHood) {
                            this.ventilationHood = tempLight
                        }
                        this.skipWatch = false
                        break
                    case '/devices/wb-gpio/controls/EXT2_R3A3': 
                        tempLight = Math.round(this.convert(message))
                        if(tempLight != this.lightOuter) {
                            this.lightOuter = tempLight
                        }
                        this.skipWatch = false
                        break
                    case '/devices/wb-gpio/controls/EXT2_R3A2': 
                        tempLight = Math.round(this.convert(message))
                        if(tempLight != this.lightExponates) {
                            this.lightExponates = tempLight
                        }
                        this.skipWatch = false
                        break
                    case '/devices/wb-gpio/controls/EXT2_R3A1': 
                        tempLight = Math.round(this.convert(message))
                        if(tempLight != this.lightRoom) {
                            this.lightRoom = tempLight
                        }
                        this.skipWatch = false
                        break
                    default:
                        this.skipWatch = false
                }
            },
            convert: function(/*byte[]*/byteArray) {
                const enc = new TextDecoder("utf-8")
                return Number.parseInt(enc.decode(byteArray))
            }
        },
        watch: {
            mainLight: function(val) {
                if(this.skipWatch) {
                    this.skipWatch = false
                    return
                }
                const value = val * 100
                this.qClient.publish("/devices/wb-dac/controls/EXT1_O1/on", value)
                this.qClient.publish("/devices/wb-dac/controls/EXT1_O2/on", value)
            },
            nicheTopLight: function(val) {
                if(this.skipWatch) {
                    this.skipWatch = false
                    return
                }
                const value = val * 100
                this.qClient.publish("/devices/wb-dac/controls/EXT1_O4/on", value)
            },
            nicheBottomLight: function(val) {
                if(this.skipWatch) {
                    this.skipWatch = false
                    return
                }
                const value = val * 100
                this.qClient.publish("/devices/wb-dac/controls/EXT1_O3/on", value)
            },
            europeAsiaLight: function(val) {
                if(this.skipWatch) {
                    this.skipWatch = false
                    return
                }
                const value = val * 100
                this.qClient.publish("/devices/wb-dac/controls/EXT1_O5/on", value)
            },
            lightOuter: function(val) {
                if(this.skipWatch) {
                    this.skipWatch = false
                    return
                }
                this.qClient.publish("/devices/wb-gpio/controls/EXT2_R3A3/on", ~~val)
            },
            lightExponates: function(val) {
                if(this.skipWatch) {
                    this.skipWatch = false
                    return
                }
                this.qClient.publish("/devices/wb-gpio/controls/EXT2_R3A2/on", ~~val)
            },
            lightRoom: function(val) {
                if(this.skipWatch) {
                    this.skipWatch = false
                    return
                }
                console.log(val)
                this.qClient.publish("/devices/wb-gpio/controls/EXT2_R3A1/on", ~~val)
            },
            ventilation: function(val) {
                if(this.skipWatch) {
                    this.skipWatch = false
                    return
                }
                this.qClient.publish("/devices/wb-gpio/controls/EXT2_R3A4/on", ~~val)
            },
            ventilationHood: function(val) {
                if(this.skipWatch) {
                    this.skipWatch = false
                    return
                }
                this.qClient.publish("/devices/wb-gpio/controls/EXT2_R3A5/on", ~~val)
            }
        },
        mounted() {
            console.log(this)
            //this.qClient.client.on("message", this.getMessage)
            this.qClient.subscribe("/devices/wb-dac/controls/EXT1_O1", {qos: 0})
            //this.qClient.subscribe("/devices/wb-dac/controls/EXT1_O2", {qos: 0})
            this.qClient.subscribe("/devices/wb-dac/controls/EXT1_O3", {qos: 0})
            this.qClient.subscribe("/devices/wb-dac/controls/EXT1_O4", {qos: 0})
            this.qClient.subscribe("/devices/wb-dac/controls/EXT1_O5", {qos: 0})
            this.qClient.subscribe("/devices/wb-gpio/controls/EXT2_R3A1", {qos: 0})
            this.qClient.subscribe("/devices/wb-gpio/controls/EXT2_R3A2", {qos: 0})
            this.qClient.subscribe("/devices/wb-gpio/controls/EXT2_R3A3", {qos: 0})
            this.qClient.subscribe("/devices/wb-gpio/controls/EXT2_R3A4", {qos: 0})
            this.qClient.subscribe("/devices/wb-gpio/controls/EXT2_R3A5", {qos: 0})
        }
    }


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.btns {
    display: flex;
    justify-content: space-between;
}
.block {
    margin-bottom: 10px;
}
</style>