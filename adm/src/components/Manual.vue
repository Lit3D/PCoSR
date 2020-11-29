<template>
    <div class="manual">

        <h1>Ручной режим</h1>

        <!-- <el-alert
    type="warning"
    :closable="false">
    Чтобы управлять в ручном режиме, остановите автоматическое проигрывание в разделе меню Автоматический режим
  </el-alert> -->
        <div class="manual-container">

                <div style="position: absolute; right: 20px; top: 10px;">
                    
                        <div class="clearfix">
                            <h3>Заблокировать экспонаты</h3>
                        </div>
                    ВЫКЛ <el-switch class="expo-switch" :width="80" active-color="#13ce66" v-model="expoSwitch"
                            inactive-color="#ff4949"> 
                        </el-switch> ВКЛ
                    
                </div>

                <!-- <div style="position: absolute; right: 380px; top: 10px; text-align: center">
                        <h3>Остановить видео</h3>
                        <el-button style="font-size:30px; margin-top:-10px" class="player--pause" icon="el-icon-circle-close" circle @click="goToSplash"></el-button>
                    
                </div> -->

            <!-- <h2>Сценарии @tab-click="handleClick"</h2> -->
            <el-tabs type="card">

                <el-tab-pane label="Сценарные видео на большом экране (ru)">

                    <div class="player-container">
                        
                        <player type="small" :dimLight="true" title="Делегат 1" :target="scenario" :options="{id: 'visitors_1'}"></player>
                        <player type="small" :dimLight="true" title="Делегат 2" :target="scenario" :options="{id: 'visitors_2'}"></player>

<br><br>
                        <player type="small" :dimLight="true" title="1. ИИ-Intro" :target="ledTarget" :options="{ 'id': 'pack_1', 'lang': 'ru' }"></player>
                        
                        <player type="small" title="2. ИИ перед основным роликом" :target="ledTarget" :options="{ 'id': 'pack_2', 'lang': 'ru' }"></player>

                        <player type="small" title="Ролик о свердловской области" :target="ledTarget" :options="{ 'id': 'main', 'lang': 'ru' }"></player>
                        
                        <player type="small" title="3. ИИ после основного ролика" :target="ledTarget" :options="{ 'id': 'pack_3', 'lang': 'ru' }"></player>

                        <player type="small" title="4. ИИ демонстрация экспонатов" :target="ledTarget" :options="{ 'id': 'pack_4', 'lang': 'ru' }"></player>

                        <player type="small" title="5.RU. ИИ Завершение RU" :target="ledTarget" :options="{ 'id': 'pack_5', 'lang': 'ru' }"></player>


                    </div>
                </el-tab-pane>

                <el-tab-pane label="Сценарные видео на большом экране (en)">

                            <div class="player-container">
                                <player type="small" :dimLight="true" title="Delegate 1" :target="scenario" :options="{id: 'visitors_1', 'lang': 'en'}"></player>
                        <player type="small" :dimLight="true" title="Delegate 2" :target="scenario" :options="{id: 'visitors_2', 'lang': 'en'}"></player>

<br><br>
                        <player type="small" :dimLight="true" title="1. ИИ-Intro" :target="ledTarget" :options="{ 'id': 'pack_1', 'lang': 'en' }"></player>
                        
                        <player type="small" title="2. ИИ перед основным роликом" :target="ledTarget" :options="{ 'id': 'pack_2', 'lang': 'en' }"></player>

                        <player type="small" title="Ролик о свердловской области" :target="ledTarget" :options="{ 'id': 'main', 'lang': 'en' }"></player>
                        
                        <player type="small" title="3. ИИ после основного ролика" :target="ledTarget" :options="{ 'id': 'pack_3', 'lang': 'en' }"></player>

                        <player type="small" title="4. ИИ демонстрация экспонатов" :target="ledTarget" :options="{ 'id': 'pack_4', 'lang': 'en' }"></player>

                        <player type="small" title="5.RU. ИИ Завершение RU" :target="ledTarget" :options="{ 'id': 'pack_5', 'lang': 'en' }"></player>
                            </div>
                        </el-tab-pane>

                <el-tab-pane label="Промо-ролики на большом экране">
                    <h3>Промо-ролики</h3>
                        <!-- <tr v-for="index in 24" :key="index">
                            <td>{{ index }}</td>
                            <td>
                                <player type="small" :target="ledTargetSs" :options="{id: index, muted: false}"></player>
                            </td>
                        </tr> -->
                        <div class="player-container">
                            <div v-for="pres in presList" :key="pres.id">
                                <!-- <td>{{ pres.id }}. {{ pres.subtitle_ru }}</td> -->
                                <span>
                                    <player type="small" :title="pres.id + '. ' + pres.subtitle_ru" :target="ledTargetSs" :options="{id: pres.id}"></player>
                                </span>
                            </div>
                        </div>
                </el-tab-pane>
                <el-tab-pane label="Ручная активация экспонатов">
                     <table class="exponates-table">
                        <tr>
                            <td><span class="exponate_title">{{ getTitle(17) }}</span><el-button @click="runVideoSmall(1, 17)" ref="p1" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                            <td><span class="exponate_title">{{ getTitle(20) }}</span> <el-button @click="runVideoSmall(2, 20)" ref="p3" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                            <td><span class="exponate_title">{{ getTitle(9) }}</span> <el-button @click="runVideoSmall(3, 9)" ref="p5" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                            <td><span class="exponate_title">{{ getTitle(13) }}</span> <el-button @click="runVideoSmall(4, 13)" ref="p7" class="player--play" icon="el-icon-video-play" circle></el-button></td>

                            <td><span class="exponate_title">{{ getTitle(12) }}</span><el-button @click="runVideoSmall(5, 12)" ref="p9" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                            <td><span class="exponate_title">{{ getTitle(10) }}</span><el-button @click="runVideoSmall(6, 10)" ref="p11" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                            <td><span class="exponate_title">{{ getTitle(18) }}</span><el-button @click="runVideoSmall(7, 18)" ref="p13" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                            <td><span class="exponate_title">{{ getTitle(21) }}</span><el-button @click="runVideoSmall(8, 21)" ref="p15" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                            <td><span class="exponate_title">{{ getTitle(16) }}</span><el-button @click="runVideoSmall(9, 16)" ref="p17" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                            <td><span class="exponate_title">{{ getTitle(3) }}</span><el-button @click="runVideoSmall(10, 3)" ref="p19" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                            <td><span class="exponate_title">{{ getTitle(1) }}</span><el-button @click="runVideoSmall(11, 1)" ref="p21" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                            <td><span class="exponate_title">{{ getTitle(6) }}</span><el-button @click="runVideoSmall(12, 6)" ref="p23" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                        </tr>
                        <tr>
                            <td><span class="exponate_title">{{ getTitle(24) }}</span><el-button @click="runVideoSmall(1, 24)" ref="p2" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                            <td><span class="exponate_title">{{ getTitle(14) }}</span><el-button @click="runVideoSmall(2, 14)" ref="p4" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                            <td><span class="exponate_title">{{ getTitle(15) }}</span><el-button @click="runVideoSmall(3, 15)" ref="p6" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                            <td><span class="exponate_title">{{ getTitle(11) }}</span><el-button @click="runVideoSmall(4, 11)" ref="p8" class="player--play" icon="el-icon-video-play" circle></el-button></td>

                            <td><span class="exponate_title">{{ getTitle(19) }}</span><el-button @click="runVideoSmall(5, 19)" ref="p10" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                            <td><span class="exponate_title">{{ getTitle(7) }}</span><el-button @click="runVideoSmall(6, 7)" ref="p12" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                            <td><span class="exponate_title">{{ getTitle(8) }}</span><el-button @click="runVideoSmall(7, 8)" ref="p14" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                            <td><span class="exponate_title">{{ getTitle(23) }}</span><el-button @click="runVideoSmall(8, 23)" ref="p16" class="player--play" icon="el-icon-video-play" circle></el-button></td>

                            <td><span class="exponate_title">{{ getTitle(5) }}</span><el-button @click="runVideoSmall(9, 5)" ref="p18" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                            <td><span class="exponate_title">{{ getTitle(4) }}</span><el-button @click="runVideoSmall(10, 4)" ref="p20" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                            <td><span class="exponate_title">{{ getTitle(2) }}</span><el-button @click="runVideoSmall(11, 2)" ref="p22" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                            <td><span class="exponate_title">{{ getTitle(22) }}</span><el-button @click="runVideoSmall(12, 22)" ref="p24" class="player--play" icon="el-icon-video-play" circle></el-button></td>
                        </tr>
                    </table>
                </el-tab-pane>
                
            </el-tabs>
        </div>

    </div>
</template>

<script>
    import Player from './Player.vue'
    import { QClient } from "../mqtt_connect.js"

    export default {
        name: 'Manual',
        components: {
            Player
        },
        props: {
            showDialog: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                boolean: false,
                qClient: null,
                radio1: "",
                expoSwitch: false,
                ledTarget: `/lit3d/master/visual`,
                ledTargetSs: `/lit3d/slave/led/ss`,
                ledTargetSpash: `/lit3d/slave/led/splash`,
                scenario: `/lit3d/master/scenario`,
                exhibits: `/lit3d/master/exhibits`,
                presList: [{
                    id: 1,
                    subtitle_ru: "Авиационная логистика"
                },{
                    id: 2,
                    subtitle_ru: "Железнодорожная логистика"
                },{
                    id: 3,
                    subtitle_ru: "Образование"
                },{
                    id: 4,
                    subtitle_ru: "Наука"
                },{
                    id: 5,
                    subtitle_ru: "Комфортная среда"
                },{
                    id: 6,
                    subtitle_ru: "Международное сотрудничество и MICE"
                },{
                    id: 7,
                    subtitle_ru: "Чёрная металлургия"
                },{
                    id: 8,
                    subtitle_ru: "Цветная металлургия"
                },{
                    id: 9,
                    subtitle_ru: "Авиапромышленность"
                },{
                    id: 10,
                    subtitle_ru: "Химическая промышленность"
                },{
                    id: 11,
                    subtitle_ru: "Лесная промышленность"
                },{
                    id: 12,
                    subtitle_ru: "Машиностроение"
                },{
                    id: 13,
                    subtitle_ru: "IT-сфера"
                },{
                    id: 14,
                    subtitle_ru: "Приборостроение"
                },{
                    id: 15,
                    subtitle_ru: "Пищевая промышленность"
                },{
                    id: 16,
                    subtitle_ru: "Медицина"
                },{
                    id: 17,
                    subtitle_ru: "Лёгкая промышленность"
                },{
                    id: 18,
                    subtitle_ru: "Вагоностроение"
                },{
                    id: 19,
                    subtitle_ru: "Нефтегазовая отрасль"
                },{
                    id: 20,
                    subtitle_ru: "Танкостроение"
                },{
                    id: 21,
                    subtitle_ru: "Туризм"
                },{
                    id: 22,
                    subtitle_ru: "Инвестиционная политика"
                },{
                    id: 23,
                    subtitle_ru: "Универсиада"
                },{
                    id: 24,
                    subtitle_ru: "Строительные материалы"
                }
                ]
            }
        },
        methods: {
            runVideoSmall: function(lineNum, index) {
                //let lineNum = Math.ceil(index / 2)
                //let playFlag = "0";
                // if(this.$refs["p"+index].icon == "el-icon-video-play") {
                //     this.$refs["p"+index].icon = "el-icon-video-pause"
                // }
                // else {
                //     this.$refs["p"+index].icon = "el-icon-video-play"
                // }
                let options = {
                    id: index,
                    muted: true
                }
                this.qClient.publish(`/lit3d/slave/line/${lineNum}/ss`, options)
            },
            getMessageExpo: function(topic, message, packet) {
                console.log(topic, message, packet)

                this.expoSwitch = topic.allow
            },
            getTitle(id) {
                //return id + ". " + this.presList.filter(item => item.id == id)[0].subtitle_ru
                return id
            },

        },
        watch: {
            expoSwitch: function(val) {
                //console.log(val)
                this.qClient.publish(this.exhibits, { allow: val })
            }
        },
        mounted() {
            this.qClient = new QClient()
            this.qClient.subscribe(this.exhibits, this.getMessageExpo)
            for(let i=1;i<=12;i++) {
                this.qClient.subscribe(`/lit3d/line/${i}`, {qos: 0})
            }
        },
        beforeDestroy() {
            this.qClient.unsubscribe(this.exhibits, this.getMessageExpo)
          for(let i=1;i<=12;i++) {
                this.qClient.unsubscribe(`/lit3d/line/${i}`)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.show-video-container {
    display: flex;
    flex-direction: row;
    margin-bottom: 40px;
}
.show-video-container > div {
    width: 50%;
}
.exponate_title {
    display: block;
    font-size: 12px;
}
</style>