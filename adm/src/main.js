import Vue from 'vue'
import App from './App.vue'
// import { MdButton, MdContent, MdTabs, MdToolbar, MdIcon, MdTooltip, MdCard, MdCheckbox, MdField, MdProgress, MdDialog, MdSwitch } from 'vue-material/dist/components'
// import 'vue-material/dist/vue-material.min.css'
// import 'vue-material/dist/theme/default.css'

import axios from 'axios'
import VueAxios from 'vue-axios'
import VueRouter from 'vue-router'

import Auto from './components/Auto.vue';
import Manual from './components/Manual.vue';
import Auth from './components/Auth.vue';
import Presentation from './components/Presentation.vue';
import Tech from './components/Tech.vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './styles.scss'

// Vue.use(MdButton)
// Vue.use(MdContent)
// Vue.use(MdTabs)
// Vue.use(MdToolbar)
// Vue.use(MdIcon)
// Vue.use(MdTooltip)
// Vue.use(MdCard)
// Vue.use(MdCheckbox)
// Vue.use(MdField)
// Vue.use(MdProgress)
// Vue.use(MdDialog)
// Vue.use(MdSwitch)
Vue.use(VueAxios, axios)
Vue.use(VueRouter)

Vue.use(ElementUI);

Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  routes: [
    // { path: '/',
    //   component: Scenarios,
    // },
    { path: '/auth',
      // You could also have named views at tho top
      component: Auth,
      // children: [{
      //   path: 'client/:id',
      //   component: MapView
      // }]
    },
    { path: '/manual',
      // You could also have named views at tho top
      component: Manual,
      props: { showDialog: true }
      // children: [{
      //   path: 'client/:id',
      //   component: MapView
      // }]
    },
    { path: '/auto',
      // You could also have named views at tho top
      component: Auto
      // children: [{
      //   path: 'client/:id',
      //   component: MapView
      // }]
    },
    { path: '/presentation',
      // You could also have named views at tho top
      component: Presentation
      // children: [{
      //   path: 'client/:id',
      //   component: MapView
      // }]
    },
    { path: '/tech',
      // You could also have named views at tho top
      component: Tech
      // children: [{
      //   path: 'client/:id',
      //   component: MapView
      // }]
    },
  ]
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
