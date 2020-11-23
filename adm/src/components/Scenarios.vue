<template>
  <div class="scenarios">
    <el-card class="box-card">
        <div class="md-primary scenarios__mode scenarios__mode--auto">
          <button class="btn btn--play btn--big"><i class="el-icon-video-play"></i></button>
          <h1>Автоматический режим</h1>
        </div>
    </el-card>
    <el-card class="box-card">
        <div class="md-primary scenarios__mode scenarios__mode--auto">
          <router-link :to="'/manual'"><button class="btn btn--play btn--big"><i class="el-icon-s-tools"></i></button></router-link>
          <h1>Ручной режим</h1>
        </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Scenarios',
  props: {
    msg: String,
  },
  data: function() {
    return {
      
    }
  },
  methods: {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
