<template>
  <div id="app">
    <el-container>
      <el-aside width="65px">
        <el-menu class="el-menu-vertical-demo" :collapse="true" :router="true">

          <el-menu-item route="/auto" index="1">
            <i class="el-icon-magic-stick"></i>
            <!-- <span slot="title">Автоматический режим</span> -->
          </el-menu-item>
          <el-menu-item route="/manual" index="2">
            <i class="el-icon-setting"></i>
            <!-- <span slot="title">Ручной режим</span> -->
          </el-menu-item>
          <el-menu-item route="/presentation" index="3">
            <i class="el-icon-s-platform"></i>
            <!-- <span slot="title">Режим презентации</span> -->
          </el-menu-item>

          <el-menu-item route="/tech" index="4">
            <i class="el-icon-s-operation"></i>
            <span slot="title">Технические настройки</span>
          </el-menu-item>

        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <!-- <auth v-if="!authorized" @authorized="authorized = true"></auth> -->
          <router-view></router-view>
        </el-main>

        <!-- <el-footer>
          <div>Текущий режим: <router-link to="/auto"><strong style="text-decoration:underline"><i
                  class="el-icon-magic-stick"></i> Автоматический</strong></router-link>
          </div>
          <div>Сеанс идет: <strong>15:23</strong></div>
          <div>Сейчас: <strong>Intro -2:35</strong></div>
          <div>Дальше: <strong>Promo</strong></div>
          <div>Экспонаты: <strong>Выкл.</strong></div>
        </el-footer> -->

        <el-footer>
          <div class="volume-container"><span>Volume: </span><span><el-slider v-model="volume" :show-tooltip="false" style="width: 500px;"></el-slider></span></div>
          
          <div>
            <span>Остановить видео</span>&nbsp;&nbsp;
            <el-button style="font-size:20px;" class="player--pause" icon="el-icon-circle-close" circle @click="goToSplash"></el-button>          
          </div>

          <!-- <div class="on-off-container"><el-button class="player--play" icon="el-icon-switch-button" style="font-size: 20px" circle></el-button></div> -->

        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  //import Auth from './components/Auth.vue'
  import { QClient } from "./mqtt_connect.js"

  export default {
    name: 'app',
    components: {

    },
    data: function () {
      return {
        qClient: null,
        authorized: false,
        volume: 50,
        volumeTargetSet: "/lit3d/slave/led/volume/set",
        volumeTargetGet: "/lit3d/slave/0/volume",
        ledTargetSpash: `/lit3d/slave/led/splash`,
      }
    },
    methods: {
      getMessage: function(topic, message) {
        console.log(topic, message)
      },
      runVideoSmall: function(lineNum, index) {
          let options = {
              id: index,
              muted: true
          }
          this.qClient.publish(`/lit3d/slave/${lineNum}/ss-play`, options)
      },
      goToSplash() {
          this.qClient.publish(this.ledTargetSpash, {})
      }
    },
    watch: {
      volume: function(val) {
          if(this.skipWatch) {
              this.skipWatch = false
              return
          }
          this.qClient.publish(this.volumeTargetSet, val)
      }
    },
    mounted() {
      this.qClient = new QClient();
      this.$router.push({ path: 'auto' });


        //this.qClient.client.on("message", this.getMessage)
        this.qClient.subscribe(this.volumeTargetGet, {qos: 0})
    },
    beforeDestroy() {
      this.qClient.unsubscribe(this.volumeTargetGet)
    }
  }
</script>

<style>
  /* body {
  -md-theme-default-primary: rgb(74 139 118 / 1);
  background-color: rgb(59 59 59 / 1);
} */

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .container {
    padding: 40px;
    max-width: 1366px;
    margin: 0 auto;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter,
  .fade-leave-to

  /* .fade-leave-active до версии 2.1.8 */
    {
    opacity: 0;
  }
</style>