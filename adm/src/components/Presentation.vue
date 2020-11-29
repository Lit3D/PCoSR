<template>
  <div class="manual">
    <!-- <router-link :to="'/scenarios'"><i class="el-icon-back"></i></router-link> -->
    <h1>Режим презентации</h1>
<!-- <div style="position: absolute; right: 20px; top: 20px;">
                    
                        <div class="clearfix">
                            <h3>Включить режим презентации</h3>
                        </div>
                    ВЫКЛ <el-switch class="expo-switch" :width="80" v-model="boolean" active-color="#13ce66"
                            inactive-color="#ff4949"> 
                        </el-switch> ВКЛ
                    
                </div> -->

                <div style="position: absolute; right: 380px; top: 10px; text-align: center">
                        <h3>Остановить презентацию</h3>
                        <el-button style="font-size:30px; margin-top:-10px" class="player--pause" icon="el-icon-circle-close" circle @click="goToSplash"></el-button>
                    
                </div>
    <p>Подключить внешнее устройство по:</p>
    <el-button class="share-btn" type="primary" round @click="startHdmi">HDMI</el-button>
    <el-button class="share-btn" type="primary" round><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22 17.607c-.786 2.28-3.139 6.317-5.563 6.361-1.608.031-2.125-.953-3.963-.953-1.837 0-2.412.923-3.932.983-2.572.099-6.542-5.827-6.542-10.995 0-4.747 3.308-7.1 6.198-7.143 1.55-.028 3.014 1.045 3.959 1.045.949 0 2.727-1.29 4.596-1.101.782.033 2.979.315 4.389 2.377-3.741 2.442-3.158 7.549.858 9.426zm-5.222-17.607c-2.826.114-5.132 3.079-4.81 5.531 2.612.203 5.118-2.725 4.81-5.531z"/></svg> AirPlay</el-button>
    <el-button class="share-btn" type="primary" round><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6 8l.001 9.444c0 .861.696 1.556 1.557 1.556h.442v3.542c0 .804.707 1.458 1.51 1.458.806 0 1.49-.654 1.49-1.459v-3.541h2v3.542c0 .804.707 1.458 1.511 1.458.806 0 1.489-.654 1.489-1.459v-3.541l.444-.001c.858 0 1.556-.696 1.556-1.557v-9.442h-12zm16 1.471c0-.805-.695-1.471-1.5-1.471-.805-.001-1.5.667-1.5 1.472v6.106c0 .806.694 1.422 1.5 1.422.805 0 1.5-.615 1.5-1.422v-6.107zm-17 0c0-.805-.695-1.471-1.5-1.471-.805-.001-1.5.667-1.5 1.472v6.106c0 .806.694 1.422 1.5 1.422.805 0 1.5-.615 1.5-1.422v-6.107zm9.951-7.312l.94-1.859c.068-.132-.019-.3-.163-.3-.066 0-.13.038-.164.105l-.949 1.878c-1.531-.737-3.544-.812-5.229 0l-.95-1.878c-.033-.067-.097-.105-.164-.105-.144 0-.231.168-.163.3l.94 1.859c-1.845 1.034-3.049 2.584-3.049 4.84h12c0-2.256-1.204-3.806-3.049-4.84zm-5.45 2.841c-.276 0-.501-.224-.501-.5 0-.274.225-.5.501-.5s.499.226.499.5c0 .276-.223.5-.499.5zm4.998 0c-.276 0-.499-.224-.499-.5 0-.274.223-.5.499-.5s.501.226.501.5c0 .276-.225.5-.501.5z"/></svg> Android</el-button>
  
    <div>
      <h3>Выбрать заставку</h3>

      <el-upload
  action="https://jsonplaceholder.typicode.com/posts/"
  list-type="picture-card"
  :multiple="false"
  :on-preview="handlePictureCardPreview"
  :on-remove="handleRemove"
  :on-change="handleUpload">
  <i class="el-icon-plus"></i>
</el-upload>
<el-dialog :visible.sync="dialogVisible">
  <img width="100%" :src="dialogImageUrl" alt="">
</el-dialog>
<br>
    <el-button class="share-btn" type="primary" round @click="changeSplashScreen">Заменить заставку на главном экране</el-button>
    <el-button class="share-btn" type="primary" round @click="resetSplashScreen">Заставка по умолчанию</el-button>

    </div>
  </div>
</template>

<script>
  import { QClient } from "../mqtt_connect.js"

  export default {
    name: 'Presentation',
    props: {
      showDialog: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
        boolean: false,
        radio1: "",
        qClient: null,
        target: `/lit3d/slave/0/webcam`,
        ledTargetSpash: `/lit3d/slave/0/splash`,
        imgTarget: "/lit3d/slave/led/image",
        dialogImageUrl: '',
        dialogVisible: false,
        file: null,
        URL: "/user_content",
        imgPath: ""
      }
    },
    methods: {
      startHdmi: function() {
        this.qClient.publish(this.target, {hdmi:1})
      },
      goToSplash() {
          this.qClient.publish(this.ledTargetSpash, 1)
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.file = null;
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
        
      },
      handleUpload(response, file, fileList) {
        console.log(response, file, fileList);
        if(response) {
          this.file = response;

                  const file = this.file.raw
          if (!file) return
          const fileReader = new FileReader()
          fileReader.filename = file.name
          fileReader.addEventListener("load", () => {
            const sData = fileReader.result
            const nBytes = sData.length
            const ui8Data = new Uint8Array(nBytes)
            for (let nIdx = 0; nIdx < nBytes; nIdx++) ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff
            const request = new XMLHttpRequest()
            this.imgPath = `${URL}/${fileReader.filename}`
            request.open("PUT", this.imgPath, false)
            request.send(ui8Data)
          })
          fileReader.readAsBinaryString(file)
        }
      },
      changeSplashScreen() {
        // if (!this.file) {
        //   console.log('Не загружен файл')
        //   return;
        // }
        // console.log(this.file)
        // let reader = new FileReader();
        // let type = this.file.raw.type;
        // reader.onload = function(e) {
        //     let blob = new Blob([new Uint8Array(e.target.result)], {type: type });
        //     console.log(blob);
        // };
        // reader.readAsArrayBuffer(this.file.raw);


        this.qClient.publish(this.imgTarget, { "src": this.imgPath })

      },
      resetSplashScreen() {
        this.qClient.publish(this.imgTarget, {})
      },
      uploadImage() {

      }
    },
    mounted() {
            this.qClient = new QClient()

        }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>