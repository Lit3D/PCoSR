<template>
  <div class="manual">
    <!-- <router-link :to="'/scenarios'"><i class="el-icon-back"></i></router-link> -->
    <h1>Автоматический режим</h1>
    <!-- <div style="margin-bottom: 30px; font-size: 18px">Длительность сеанса: <strong>15:23</strong></div> -->
    <el-row>
      <el-col :span="12">
        <player type="big" :target="scenario" :options="{id: 'visitors_1'}"></player>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import Player from './Player.vue'
  import { QClient } from "../mqtt_connect.js"

  export default {
    name: 'Auto',
    components: {
      Player
    },
    props: {
      showDialog: {
        type: Boolean,
        default: false,
      }
    },
    data: function () {
      return {
        boolean: false,
        radio1: "",
        scenario: `/lit3d/master/scenario`,
        qClient: new QClient()
      }
    },
    methods: {
      format() {
        return "2:35";
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>