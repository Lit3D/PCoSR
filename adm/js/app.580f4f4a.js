(function(t){function e(e){for(var n,s,a=e[0],c=e[1],r=e[2],p=0,d=[];p<a.length;p++)s=a[p],Object.prototype.hasOwnProperty.call(o,s)&&o[s]&&d.push(o[s][0]),o[s]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(t[n]=c[n]);u&&u(e);while(d.length)d.shift()();return l.push.apply(l,r||[]),i()}function i(){for(var t,e=0;e<l.length;e++){for(var i=l[e],n=!0,a=1;a<i.length;a++){var c=i[a];0!==o[c]&&(n=!1)}n&&(l.splice(e--,1),t=s(s.s=i[0]))}return t}var n={},o={app:0},l=[];function s(e){if(n[e])return n[e].exports;var i=n[e]={i:e,l:!1,exports:{}};return t[e].call(i.exports,i,i.exports,s),i.l=!0,i.exports}s.m=t,s.c=n,s.d=function(t,e,i){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},s.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)s.d(i,n,function(e){return t[e]}.bind(null,n));return i},s.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="/";var a=window["webpackJsonp"]=window["webpackJsonp"]||[],c=a.push.bind(a);a.push=e,a=a.slice();for(var r=0;r<a.length;r++)e(a[r]);var u=c;l.push([0,"chunk-vendors"]),i()})({0:function(t,e,i){t.exports=i("56d7")},"034f":function(t,e,i){"use strict";var n=i("85ec"),o=i.n(n);o.a},1:function(t,e){},2:function(t,e){},"2c9e":function(t,e,i){"use strict";var n=i("7df8"),o=i.n(n);o.a},3:function(t,e){},4:function(t,e){},"457a":function(t,e,i){"use strict";var n=i("af2e"),o=i.n(n);o.a},"4c57":function(t,e,i){},5:function(t,e){},"56d7":function(t,e,i){"use strict";i.r(e);i("e260"),i("e6cf"),i("cca6"),i("a79d");var n=i("2b0e"),o=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"app"}},[i("el-container",[i("el-aside",{attrs:{width:"65px"}},[i("el-menu",{staticClass:"el-menu-vertical-demo",attrs:{collapse:!0,router:!0}},[i("el-menu-item",{attrs:{route:"/auto",index:"1"}},[i("i",{staticClass:"el-icon-magic-stick"})]),i("el-menu-item",{attrs:{route:"/manual",index:"2"}},[i("i",{staticClass:"el-icon-setting"})]),i("el-menu-item",{attrs:{route:"/presentation",index:"3"}},[i("i",{staticClass:"el-icon-s-platform"})]),i("el-menu-item",{attrs:{route:"/tech",index:"4"}},[i("i",{staticClass:"el-icon-s-operation"}),i("span",{attrs:{slot:"title"},slot:"title"},[t._v("Технические настройки")])])],1)],1),i("el-container",[i("el-main",[i("router-view")],1),i("el-footer",[i("div",{staticClass:"volume-container"},[i("span",[t._v("Volume: ")]),i("span",[i("el-slider",{staticStyle:{width:"500px"},attrs:{"show-tooltip":!1},model:{value:t.volume,callback:function(e){t.volume=e},expression:"volume"}})],1)])])],1)],1)],1)},l=[],s=(i("d3b7"),i("25f0"),i("d4ec")),a=i("bee2"),c=i("ade3"),r=i("e7fc"),u=function(){function t(){return Object(s["a"])(this,t),Object(c["a"])(this,"host","ws://wb.pcosr.local:18883/mqtt"),Object(c["a"])(this,"options",{keepalive:30,clientId:"Admin-"+Math.random().toString(16).substr(2,8),protocolId:"MQTT",protocolVersion:4,clean:!0,reconnectPeriod:1e3,connectTimeout:1e4,rejectUnauthorized:!1}),Object(c["a"])(this,1,void 0),void 0!==t.instance?t.instance:(this.init(),t.instance=this)}return Object(a["a"])(t,[{key:"init",value:function(){var t=this;this.client=Object(r["connect"])(this.host,this.options),this.client.on("error",(function(e){console.error(e),t.client.end()})),this.client.on("connect",(function(){console.log("MQTT hub [".concat(t.host,"] connected"))}))}},{key:"set",value:function(t,e){this.client.publish(t,e,{qos:0,retain:!1},(function(t){t&&console.error(t)}))}}]),t}();Object(c["a"])(u,"instance",void 0);var p={name:"app",components:{},data:function(){return{qClient:new u,authorized:!1,volume:50,volumeTargetSet:"/lit3d/slave/0/volume/set",volumeTargetGet:"/lit3d/slave/0/volume"}},methods:{getMessage:function(t,e){console.log(t,e)}},watch:{volume:function(t){this.skipWatch?this.skipWatch=!1:this.qClient.set(this.volumeTargetSet,JSON.stringify(t))}},mounted:function(){this.$router.push({path:"auto"}),this.qClient.client.on("message",this.getMessage)}},d=p,h=(i("034f"),i("2877")),v=Object(h["a"])(d,o,l,!1,null,null,null),m=v.exports,f=i("bc3a"),b=i.n(f),g=i("a7fe"),y=i.n(g),_=i("8c4f"),k=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"manual"},[i("h1",[t._v("Автоматический режим")]),t._m(0),i("el-row",[i("el-col",{attrs:{span:12}},[i("player",{attrs:{type:"big"}})],1),i("el-col",{attrs:{span:12}},[i("el-timeline",[i("el-timeline-item",{attrs:{type:"success"}},[t._v("Intro")]),i("el-timeline-item",{attrs:{type:"success"}},[t._v("Promo")]),i("el-timeline-item",{attrs:{type:"primary"}},[t._v("Инструкция ")]),i("el-timeline-item",[t._v("Видео")]),i("el-timeline-item",[t._v("Свободный доступ к экспонатам")]),i("el-timeline-item",[t._v("End")])],1)],1)],1)],1)},w=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticStyle:{"margin-bottom":"30px","font-size":"18px"}},[t._v("Длительность сеанса: "),i("strong",[t._v("15:23")])])}],C=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"player",class:t.type},[i("el-card",{staticClass:"box-card"},[i("div",{staticStyle:{float:"left"}},[t._v(t._s(t.title))]),i("el-button",{staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.play()}}})],1)],1)},T=[],S={name:"Player",props:{type:{type:String,default:"small"},target:{type:[String,Object],default:""},options:{type:Object,default:function(){return{}}},title:{type:String,default:""},dimLight:{type:Boolean,default:!1}},data:function(){return{qClient:new u,dialogVisible:!1,result:{}}},computed:{},methods:{askBeforeStop:function(){this.dialogVisible=!0},play:function(){var t;this.dimLight&&(this.qClient.set("/devices/wb-dac/controls/EXT1_O1/on",String(0)),this.qClient.set("/devices/wb-dac/controls/EXT1_O2/on",String(0))),t="string"==typeof this.target?this.target:this.target.play,this.qClient.set(t,JSON.stringify(this.options))},pause:function(){var t;"string"!=typeof this.target&&(t=this.target.pause,this.qClient.set(t,"1"))},getMessage:function(t,e){console.log(t,e),this.result=JSON.parse(String(e))},format:function(){if(this.result.duration){var t=this.result.duration-this.result.currentTime,e=Math.floor(t/60),i=t%60;return String(e)+":"+String(i)}return"00:00"},percentage:function(){return Math.round(100*this.result.currentTime/this.result.duration)}},mounted:function(){this.qClient.client.on("message",this.getMessage),this.qClient.client.subscribe(this.target,{qos:0})}},x=S,O=(i("b453"),Object(h["a"])(x,C,T,!1,null,"b4762aec",null)),q=O.exports,E={name:"Auto",components:{Player:q},props:{showDialog:{type:Boolean,default:!1}},data:function(){return{boolean:!1,radio1:""}},methods:{format:function(){return"2:35"}}},L=E,M=Object(h["a"])(L,k,w,!1,null,"533a5474",null),X=M.exports,A=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"manual"},[i("h1",[t._v("Ручной режим")]),i("div",{staticClass:"manual-container"},[i("div",{staticStyle:{position:"absolute",right:"20px",top:"20px"}},[t._m(0),t._v(" ВЫКЛ "),i("el-switch",{staticClass:"expo-switch",attrs:{width:80,"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:t.boolean,callback:function(e){t.boolean=e},expression:"boolean"}}),t._v(" ВКЛ ")],1),i("div",{staticStyle:{position:"absolute",right:"380px",top:"10px","text-align":"center"}},[i("h3",[t._v("Остановить видео")]),i("el-button",{staticClass:"player--pause",staticStyle:{"font-size":"30px"},attrs:{icon:"el-icon-circle-close",circle:""},on:{click:t.goToSplash}})],1),i("el-tabs",{attrs:{type:"card"}},[i("el-tab-pane",{attrs:{label:"Сценарные видео на большом экране"}},[i("h3",[t._v("Видео")]),i("div",{staticClass:"player-container"},[i("player",{attrs:{type:"small",dimLight:!0,title:"Сценарий 21 октября",target:t.ledTarget,options:{src:"/content/visual/combo-21_10_2020--led.mp4",muted:!1}}}),i("br"),i("br"),i("player",{attrs:{type:"small",dimLight:!0,title:"1. ИИ-Intro (pack-1-intro--led.mp4)",target:t.ledTarget,options:{src:"/content/visual/pack-1-intro--led.mp4",muted:!1}}}),i("player",{attrs:{type:"small",title:"2. ИИ перед основным роликом (pack-2-ural-before--led.mp4)",target:t.ledTarget,options:{src:"/content/visual/pack-2-ural-before--led.mp4",muted:!1}}}),i("player",{attrs:{type:"small",title:"ИИ 1 и 2 вместе (combo-1-2--led.mp4)",target:t.ledTarget,options:{src:"/content/visual/combo-1-2--led.mp4",muted:!1}}}),i("player",{attrs:{type:"small",title:"Ролик о свердловской области (main--led.mp4)",target:t.ledTarget,options:{src:"/content/visual/main--led.mp4",muted:!1}}}),i("player",{attrs:{type:"small",title:"3. ИИ после основного ролика (pack-3-ural-after--led.mp4)",target:t.ledTarget,options:{src:"/content/visual/pack-3-ural-after--led.mp4",muted:!1}}}),i("player",{attrs:{type:"small",title:"4. ИИ демонстрация экспонатов (pack-4-demo--led.mp4)",target:t.ledTarget,options:{src:"/content/visual/pack-4-demo--led.mp4",muted:!1}}}),i("player",{attrs:{type:"small",title:"ИИ 3 и 4 вместе (combo-1-2--led.mp4)",target:t.ledTarget,options:{src:"/content/visual/combo-1-2--led.mp4",muted:!1}}}),i("player",{attrs:{type:"small",title:"5.RU. ИИ Завершение RU (pack-5-final-ru--led.mp4)",target:t.ledTarget,options:{src:"/content/visual/pack-5-final-ru--led.mp4",muted:!1}}}),i("player",{attrs:{type:"small",title:"5.EN. ИИ Завершение EN (pack-5-final-en--led.mp4)",target:t.ledTarget,options:{src:"/content/visual/pack-5-final-en--led.mp4",muted:!1}}})],1)]),i("el-tab-pane",{attrs:{label:"Промо-ролики на большом экране"}},[i("h3",[t._v("Промо-ролики")]),i("div",{staticClass:"player-container"},t._l(t.presList,(function(e){return i("div",{key:e.id},[i("player",{attrs:{type:"small",title:e.id+". "+e.subtitle_ru,target:t.ledTargetSs,options:{id:e.id,muted:!1}}})],1)})),0)]),i("el-tab-pane",{attrs:{label:"Ручная активация экспонатов"}},[i("table",{staticClass:"exponates-table"},[i("tr",[i("td",[t._v("1 "),i("el-button",{ref:"p1",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(1,17)}}})],1),i("td",[t._v("3 "),i("el-button",{ref:"p3",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(2,20)}}})],1),i("td",[t._v("5 "),i("el-button",{ref:"p5",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(3,9)}}})],1),i("td",[t._v("7 "),i("el-button",{ref:"p7",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(4,13)}}})],1),i("td",[t._v("9 "),i("el-button",{ref:"p9",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(5,12)}}})],1),i("td",[t._v("11 "),i("el-button",{ref:"p11",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(6,10)}}})],1),i("td",[t._v("13 "),i("el-button",{ref:"p13",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(7,18)}}})],1),i("td",[t._v("15 "),i("el-button",{ref:"p15",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(8,21)}}})],1),i("td",[t._v("17 "),i("el-button",{ref:"p17",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(9,16)}}})],1),i("td",[t._v("19 "),i("el-button",{ref:"p19",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(10,3)}}})],1),i("td",[t._v("21 "),i("el-button",{ref:"p21",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(11,1)}}})],1),i("td",[t._v("23 "),i("el-button",{ref:"p23",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(12,6)}}})],1)]),i("tr",[i("td",[t._v("2 "),i("el-button",{ref:"p2",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(1,24)}}})],1),i("td",[t._v("4 "),i("el-button",{ref:"p4",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(2,14)}}})],1),i("td",[t._v("6 "),i("el-button",{ref:"p6",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(3,15)}}})],1),i("td",[t._v("8 "),i("el-button",{ref:"p8",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(4,11)}}})],1),i("td",[t._v("10 "),i("el-button",{ref:"p10",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(5,19)}}})],1),i("td",[t._v("12 "),i("el-button",{ref:"p12",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(6,7)}}})],1),i("td",[t._v("14 "),i("el-button",{ref:"p14",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(7,8)}}})],1),i("td",[t._v("16 "),i("el-button",{ref:"p16",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(8,1)}}})],1),i("td",[t._v("18 "),i("el-button",{ref:"p18",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(9,1)}}})],1),i("td",[t._v("20 "),i("el-button",{ref:"p20",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(10,4)}}})],1),i("td",[t._v("22 "),i("el-button",{ref:"p22",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(11,1)}}})],1),i("td",[t._v("24 "),i("el-button",{ref:"p24",staticClass:"player--play",attrs:{icon:"el-icon-video-play",circle:""},on:{click:function(e){return t.runVideoSmall(12,22)}}})],1)])])])],1)],1)])},V=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"clearfix"},[i("h3",[t._v("Заблокировать экспонаты")])])}],j={name:"Manual",components:{Player:q},props:{showDialog:{type:Boolean,default:!1}},data:function(){return{boolean:!1,qClient:new u,radio1:"",ledTarget:"/lit3d/slave/0/video",ledTargetSs:"/lit3d/slave/0/ss",ledTargetSpash:"/lit3d/slave/0/splash",presList:[{id:"1",subtitle_ru:"Авиационная логистика"},{id:"2",subtitle_ru:"Железнодорожная логистика"},{id:"3",subtitle_ru:"Образование"},{id:"4",subtitle_ru:"Наука"},{id:"5",subtitle_ru:"Комфортная среда"},{id:"6",subtitle_ru:"Международное сотрудничество и MICE"},{id:"7",subtitle_ru:"Чёрная металлургия"},{id:"8",subtitle_ru:"Цветная металлургия"},{id:"9",subtitle_ru:"Авиапромышленность"},{id:"10",subtitle_ru:"Химическая промышленность"},{id:"11",subtitle_ru:"Лесная промышленность"},{id:"12",subtitle_ru:"Машиностроение"},{id:"13",subtitle_ru:"IT-сфера"},{id:"14",subtitle_ru:"Приборостроение"},{id:"15",subtitle_ru:"Пищевая промышленность"},{id:"16",subtitle_ru:"Медицина"},{id:"17",subtitle_ru:"Лёгкая промышленность"},{id:"18",subtitle_ru:"Вагоностроение"},{id:"19",subtitle_ru:"Нефтегазовая отрасль"},{id:"20",subtitle_ru:"Танкостроение"},{id:"21",subtitle_ru:"Туризм"},{id:"22",subtitle_ru:"Инвестиционная политика"},{id:"23",subtitle_ru:"?"},{id:"24",subtitle_ru:"Строительные материалы"}]}},methods:{runVideoSmall:function(t,e){var i={id:e,muted:!0};this.qClient.set("/lit3d/slave/".concat(t,"/ss-play"),JSON.stringify(i))},getMessage:function(t,e,i){console.log(t,e,i)},goToSplash:function(){this.qClient.set(this.ledTargetSpash,"1")}},mounted:function(){this.qClient.client.on("message",this.getMessage);for(var t=1;t<=12;t++)this.qClient.client.subscribe("/lit3d/line/".concat(t),{qos:0})}},W=j,R=(i("c134"),Object(h["a"])(W,A,V,!1,null,"300785f0",null)),B=R.exports,P=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"login"},[i("el-card",[i("h2",[t._v("Войти")]),i("el-form",{ref:"form",staticClass:"login-form",attrs:{model:t.model,rules:t.rules},nativeOn:{submit:function(e){return e.preventDefault(),t.login(e)}}},[i("el-form-item",{attrs:{prop:"username"}},[i("el-input",{attrs:{placeholder:"Логин","prefix-icon":"fas fa-user"},model:{value:t.model.username,callback:function(e){t.$set(t.model,"username",e)},expression:"model.username"}})],1),i("el-form-item",{attrs:{prop:"password"}},[i("el-input",{attrs:{placeholder:"Пароль",type:"password","prefix-icon":"fas fa-lock"},model:{value:t.model.password,callback:function(e){t.$set(t.model,"password",e)},expression:"model.password"}})],1),i("el-form-item",[i("el-button",{staticClass:"login-button",attrs:{loading:t.loading,type:"primary","native-type":"submit",block:""}},[t._v("Войти")])],1)],1)],1)],1)},$=[],z=(i("96cf"),i("1da1")),H={name:"Auth",data:function(){return{validCredentials:{},model:{username:"",password:""},loading:!1,rules:{username:[{required:!0,message:"Username is required",trigger:"blur"},{min:4,message:"Username length should be at least 5 characters",trigger:"blur"}],password:[{required:!0,message:"Password is required",trigger:"blur"},{min:5,message:"Password length should be at least 5 characters",trigger:"blur"}]}}},methods:{simulateLogin:function(){return new Promise((function(t){setTimeout(t,800)}))},login:function(){var t=this;return Object(z["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.loading=!0,e.next=3,t.simulateLogin();case 3:t.loading=!1,t.$emit("authorized"),t.$router.push({path:"/auto"});case 6:case"end":return e.stop()}}),e)})))()}}},D=H,I=(i("457a"),i("2c9e"),Object(h["a"])(D,P,$,!1,null,"5459c673",null)),N=I.exports,J=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"manual"},[i("h1",[t._v("Режим презентации")]),i("div",{staticStyle:{position:"absolute",right:"20px",top:"20px"}},[t._m(0),t._v(" ВЫКЛ "),i("el-switch",{staticClass:"expo-switch",attrs:{width:"120","active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:t.boolean,callback:function(e){t.boolean=e},expression:"boolean"}}),t._v(" ВКЛ ")],1),i("p",[t._v("Подключить внешнее устройство по:")]),i("el-button",{staticClass:"share-btn",attrs:{type:"primary",round:""},on:{click:t.startHdmi}},[t._v("HDMI")]),i("el-button",{staticClass:"share-btn",attrs:{type:"primary",round:""}},[i("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"}},[i("path",{attrs:{d:"M22 17.607c-.786 2.28-3.139 6.317-5.563 6.361-1.608.031-2.125-.953-3.963-.953-1.837 0-2.412.923-3.932.983-2.572.099-6.542-5.827-6.542-10.995 0-4.747 3.308-7.1 6.198-7.143 1.55-.028 3.014 1.045 3.959 1.045.949 0 2.727-1.29 4.596-1.101.782.033 2.979.315 4.389 2.377-3.741 2.442-3.158 7.549.858 9.426zm-5.222-17.607c-2.826.114-5.132 3.079-4.81 5.531 2.612.203 5.118-2.725 4.81-5.531z"}})]),t._v(" AirPlay")]),i("el-button",{staticClass:"share-btn",attrs:{type:"primary",round:""}},[i("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"}},[i("path",{attrs:{d:"M6 8l.001 9.444c0 .861.696 1.556 1.557 1.556h.442v3.542c0 .804.707 1.458 1.51 1.458.806 0 1.49-.654 1.49-1.459v-3.541h2v3.542c0 .804.707 1.458 1.511 1.458.806 0 1.489-.654 1.489-1.459v-3.541l.444-.001c.858 0 1.556-.696 1.556-1.557v-9.442h-12zm16 1.471c0-.805-.695-1.471-1.5-1.471-.805-.001-1.5.667-1.5 1.472v6.106c0 .806.694 1.422 1.5 1.422.805 0 1.5-.615 1.5-1.422v-6.107zm-17 0c0-.805-.695-1.471-1.5-1.471-.805-.001-1.5.667-1.5 1.472v6.106c0 .806.694 1.422 1.5 1.422.805 0 1.5-.615 1.5-1.422v-6.107zm9.951-7.312l.94-1.859c.068-.132-.019-.3-.163-.3-.066 0-.13.038-.164.105l-.949 1.878c-1.531-.737-3.544-.812-5.229 0l-.95-1.878c-.033-.067-.097-.105-.164-.105-.144 0-.231.168-.163.3l.94 1.859c-1.845 1.034-3.049 2.584-3.049 4.84h12c0-2.256-1.204-3.806-3.049-4.84zm-5.45 2.841c-.276 0-.501-.224-.501-.5 0-.274.225-.5.501-.5s.499.226.499.5c0 .276-.223.5-.499.5zm4.998 0c-.276 0-.499-.224-.499-.5 0-.274.223-.5.499-.5s.501.226.501.5c0 .276-.225.5-.501.5z"}})]),t._v(" Android")])],1)},U=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"clearfix"},[i("h3",[t._v("Включить режим презентации")])])}],Q={name:"Presentation",props:{showDialog:{type:Boolean,default:!1}},data:function(){return{boolean:!1,radio1:"",qClient:new u,target:"/lit3d/slave/0/webcam"}},methods:{startHdmi:function(){this.qClient.set(this.target,JSON.stringify({hdmi:1}))}}},G=Q,F=Object(h["a"])(G,J,U,!1,null,"34ab9fa2",null),K=F.exports,Y=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"tech"},[i("h1",[t._v("Техническое управление")]),i("div",{staticClass:"block"},[i("span",{staticClass:"demonstration"},[t._v("Потолочный свет")]),i("el-slider",{model:{value:t.mainLight,callback:function(e){t.mainLight=e},expression:"mainLight"}}),i("button",{on:{click:function(e){t.mainLight=0}}},[t._v("0")]),i("button",{on:{click:function(e){t.mainLight=100}}},[t._v("100")])],1),i("div",{staticClass:"block"},[i("span",{staticClass:"demonstration"},[t._v("Ниша верхний свет")]),i("el-slider",{model:{value:t.nicheTopLight,callback:function(e){t.nicheTopLight=e},expression:"nicheTopLight"}}),i("button",{on:{click:function(e){t.nicheTopLight=0}}},[t._v("0")]),i("button",{on:{click:function(e){t.nicheTopLight=100}}},[t._v("100")])],1),i("div",{staticClass:"block"},[i("span",{staticClass:"demonstration"},[t._v("Ниша нижний свет")]),i("el-slider",{model:{value:t.nicheBottomLight,callback:function(e){t.nicheBottomLight=e},expression:"nicheBottomLight"}}),i("button",{on:{click:function(e){t.nicheBottomLight=0}}},[t._v("0")]),i("button",{on:{click:function(e){t.nicheBottomLight=100}}},[t._v("100")])],1),i("div",{staticClass:"block"},[i("span",{staticClass:"demonstration"},[t._v("Свет Европа-Азия")]),i("el-slider",{model:{value:t.europeAsiaLight,callback:function(e){t.europeAsiaLight=e},expression:"europeAsiaLight"}}),i("button",{on:{click:function(e){t.europeAsiaLight=0}}},[t._v("0")]),i("button",{on:{click:function(e){t.europeAsiaLight=100}}},[t._v("100")])],1),i("div",{staticStyle:{display:"flex",width:"100%","justify-content":"space-between"}},[i("div",[i("h3",[t._v("Наружный свет")]),i("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:t.lightOuter,callback:function(e){t.lightOuter=e},expression:"lightOuter"}})],1),i("div",[i("h3",[t._v("Наружные экспонаты")]),i("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:t.lightExponates,callback:function(e){t.lightExponates=e},expression:"lightExponates"}})],1),i("div",[i("h3",[t._v("Подсобка")]),i("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:t.lightRoom,callback:function(e){t.lightRoom=e},expression:"lightRoom"}})],1),i("div",[i("h3",[t._v("Приточка")]),i("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:t.ventilation,callback:function(e){t.ventilation=e},expression:"ventilation"}})],1),i("div",[i("h3",[t._v("Вытяжка")]),i("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:t.ventilationHood,callback:function(e){t.ventilationHood=e},expression:"ventilationHood"}})],1)])])},Z=[],tt=(i("a9e3"),i("25eb"),{name:"Tech",components:{},props:{showDialog:{type:Boolean,default:!1}},data:function(){return{mainLight:0,nicheTopLight:0,nicheBottomLight:0,europeAsiaLight:0,lightOuter:!1,lightExponates:!1,lightRoom:!1,ventilation:!1,ventilationHood:!1,qClient:new u,skipWatch:!1}},methods:{getMessage:function(t,e,i){var n;switch(console.log(this),console.log(t,e,i),this.skipWatch=!0,t){case"/devices/wb-dac/controls/EXT1_O1":case"/devices/wb-dac/controls/EXT1_O2":n=Math.round(this.convert(e)/100),n!=this.mainLight&&(this.mainLight=n);break;case"/devices/wb-dac/controls/EXT1_O3":n=Math.round(this.convert(e)/100),n!=this.nicheBottomLight&&(this.nicheBottomLight=n);break;case"/devices/wb-dac/controls/EXT1_O4":n=Math.round(this.convert(e)/100),n!=this.nicheTopLight&&(this.nicheTopLight=n);break;case"/devices/wb-dac/controls/EXT1_O5":n=Math.round(this.convert(e)/100),n!=this.europeAsiaLight&&(this.europeAsiaLight=n);break;case"/devices/wb-gpio/controls/EXT2_R3A4":n=Math.round(this.convert(e)),n!=this.ventilation&&(this.ventilation=n),this.skipWatch=!1;break;case"/devices/wb-gpio/controls/EXT2_R3A5":n=Math.round(this.convert(e)),n!=this.ventilationHood&&(this.ventilationHood=n),this.skipWatch=!1;break;case"/devices/wb-gpio/controls/EXT2_R3A3":n=Math.round(this.convert(e)),n!=this.lightOuter&&(this.lightOuter=n),this.skipWatch=!1;break;case"/devices/wb-gpio/controls/EXT2_R3A2":n=Math.round(this.convert(e)),n!=this.lightExponates&&(this.lightExponates=n),this.skipWatch=!1;break;case"/devices/wb-gpio/controls/EXT2_R3A1":n=Math.round(this.convert(e)),n!=this.lightRoom&&(this.lightRoom=n),this.skipWatch=!1;break;default:this.skipWatch=!1}},convert:function(t){var e=new TextDecoder("utf-8");return Number.parseInt(e.decode(t))}},watch:{mainLight:function(t){if(this.skipWatch)this.skipWatch=!1;else{var e=100*t;this.qClient.set("/devices/wb-dac/controls/EXT1_O1/on",String(e)),this.qClient.set("/devices/wb-dac/controls/EXT1_O2/on",String(e))}},nicheTopLight:function(t){if(this.skipWatch)this.skipWatch=!1;else{var e=100*t;this.qClient.set("/devices/wb-dac/controls/EXT1_O4/on",String(e))}},nicheBottomLight:function(t){if(this.skipWatch)this.skipWatch=!1;else{var e=100*t;this.qClient.set("/devices/wb-dac/controls/EXT1_O3/on",String(e))}},europeAsiaLight:function(t){if(this.skipWatch)this.skipWatch=!1;else{var e=100*t;this.qClient.set("/devices/wb-dac/controls/EXT1_O5/on",String(e))}},lightOuter:function(t){this.skipWatch?this.skipWatch=!1:this.qClient.set("/devices/wb-gpio/controls/EXT2_R3A3/on",String(~~t))},lightExponates:function(t){this.skipWatch?this.skipWatch=!1:this.qClient.set("/devices/wb-gpio/controls/EXT2_R3A2/on",String(~~t))},lightRoom:function(t){this.skipWatch?this.skipWatch=!1:(console.log(t),this.qClient.set("/devices/wb-gpio/controls/EXT2_R3A1/on",String(~~t)))},ventilation:function(t){this.skipWatch?this.skipWatch=!1:this.qClient.set("/devices/wb-gpio/controls/EXT2_R3A4/on",String(~~t))},ventilationHood:function(t){this.skipWatch?this.skipWatch=!1:this.qClient.set("/devices/wb-gpio/controls/EXT2_R3A5/on",String(~~t))}},mounted:function(){console.log(this),this.qClient.client.on("message",this.getMessage),this.qClient.client.subscribe("/devices/wb-dac/controls/EXT1_O1",{qos:0}),this.qClient.client.subscribe("/devices/wb-dac/controls/EXT1_O3",{qos:0}),this.qClient.client.subscribe("/devices/wb-dac/controls/EXT1_O4",{qos:0}),this.qClient.client.subscribe("/devices/wb-dac/controls/EXT1_O5",{qos:0}),this.qClient.client.subscribe("/devices/wb-gpio/controls/EXT2_R3A1",{qos:0}),this.qClient.client.subscribe("/devices/wb-gpio/controls/EXT2_R3A2",{qos:0}),this.qClient.client.subscribe("/devices/wb-gpio/controls/EXT2_R3A3",{qos:0}),this.qClient.client.subscribe("/devices/wb-gpio/controls/EXT2_R3A4",{qos:0}),this.qClient.client.subscribe("/devices/wb-gpio/controls/EXT2_R3A5",{qos:0})}}),et=tt,it=Object(h["a"])(et,Y,Z,!1,null,"1b25bdc6",null),nt=it.exports,ot=i("5c96"),lt=i.n(ot);i("0fae"),i("f843");n["default"].use(y.a,b.a),n["default"].use(_["a"]),n["default"].use(lt.a),n["default"].config.productionTip=!1;var st=new _["a"]({mode:"history",routes:[{path:"/auth",component:N},{path:"/manual",component:B,props:{showDialog:!0}},{path:"/auto",component:X},{path:"/presentation",component:K},{path:"/tech",component:nt}]});new n["default"]({render:function(t){return t(m)},router:st}).$mount("#app")},6:function(t,e){},"7df8":function(t,e,i){},"85ec":function(t,e,i){},af2e:function(t,e,i){},b360:function(t,e,i){},b453:function(t,e,i){"use strict";var n=i("b360"),o=i.n(n);o.a},c134:function(t,e,i){"use strict";var n=i("4c57"),o=i.n(n);o.a},f843:function(t,e,i){}});
//# sourceMappingURL=app.580f4f4a.js.map