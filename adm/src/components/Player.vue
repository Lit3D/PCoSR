<template>
<div class="player" :class="type">
    <el-card class="box-card">
        <div style="float: left">{{ title }}</div>
        <el-button @click="play()" class="player--play" icon="el-icon-video-play" circle></el-button>
        <!-- <el-progress class="player--small-progress" v-if="type=='small'" :percentage="percentage" :format="format"></el-progress> -->
        <!-- <el-button class="player--pause" icon="el-icon-circle-close" circle @click="askBeforeStop"></el-button> -->
        <!-- <el-button class="player--reload" icon="el-icon-refresh-right" circle></el-button> -->
    </el-card>

    <!-- <el-dialog
        :visible.sync="dialogVisible"
        width="30%">
        <span><i class="el-icon-warning"></i> Вы уверены, что хотите остановить текущий сеанс?</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">Нет</el-button>
            <el-button type="primary" @click="dialogVisible = false">Да</el-button>
        </span>
    </el-dialog> -->
</div>
</template>

<script>
import { QClient } from "../mqtt_connect.js"

export default {
  name: 'Player',
  props: {
    type: {type: String, default: "small"},
    target: {type: [String, Object], default: ""},
    options: {type: Object, default: function() { return {} }},
    title: {type: String, default: ""},
    dimLight: {type: Boolean, default: false}
  },
  data: function() {
    return {
        qClient: new QClient(),
        dialogVisible: false,
        result: {}
    }
  },
  computed: {

  },
  methods: {
    askBeforeStop: function() {
        this.dialogVisible = true;
    },

    play: function() {
        // let options = {
        //     id: index,
        //     muted: true
        // }
        if(this.dimLight) {
            this.qClient.set("/devices/wb-dac/controls/EXT1_O1/on", String(0))
            this.qClient.set("/devices/wb-dac/controls/EXT1_O2/on", String(0))
        }
        let target
        if(typeof this.target == 'string') {
            target = this.target
        }
        else {
            target = this.target.play
        }
        this.qClient.set(target, JSON.stringify(this.options))
    },
    pause: function() {
        let target
        if(typeof this.target == 'string') {
            return
        }
        else {
            target = this.target.pause
        }
        this.qClient.set(target, "1")
    },
    getMessage: function(topic, message) {
        console.log(topic, message)
        this.result = JSON.parse(String(message))
    },
    format: function() {
        if(!this.result.duration) {
            return '00:00'
        }
        else {
            let totalSeconds = this.result.duration - this.result.currentTime
            let minutes = Math.floor(totalSeconds / 60)
            let seconds = totalSeconds % 60
            return String(minutes) + ":" + String(seconds)
        }
    },
    percentage: function() {
        return Math.round(100 * this.result.currentTime / this.result.duration)
    },
  },
  mounted() {
        this.qClient.client.on("message", this.getMessage)
        this.qClient.client.subscribe(this.target, {qos: 0})
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .player {
        // margin: 40px 0;
    }
    .player.small button {
        // background-color: transparent;
        // border: 0;
        font-size: 26px;
    }

    .player.big button {
        // background-color: transparent;
        // border: 0;
        font-size: 30px;
    }

    .player.big .el-card {
        border-radius: 20px;
        width: auto;
        display: inline-block;
    }

    .player.small .el-card {
        border-radius: 6px;
        display: inline-block;
    }
    
    .player.big button.player--play {
        font-size: 100px;
    }
    .player.big button.player--pause {
        font-size: 60px;
    }
    .player--small-progress {
        display: inline-block;
        width: 300px;
        margin: 0 10px 0 20px;
    }

    .player .box-card {
        width: 100%;
    }

    .player .el-card .el-card__body {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
