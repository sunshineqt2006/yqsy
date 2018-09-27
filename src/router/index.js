import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/index.vue'
// Common
import Login from '@/views/common/login/index.vue'
import CinemaLogin from '@/views/common/cinema_login/index.vue'
import ScreenSelect from '@/views/common/screen_select/index.vue'
import CinemaScreenSelect from '@/views/common/cinema_screen_select/index.vue'
import Error from '@/views/common/error/index.vue'
// 平台
import Screen from '@/views/platform/screen/index.vue'
import ScreenNew from '@/views/platform/screen/edit/index.vue'
import Preview from '@/views/platform/screen/preview/index.vue'
import Game from '@/views/platform/game/index.vue'
import GameNew from '@/views/platform/game/edit/index.vue'
import Wechat from '@/views/platform/wechat/index.vue'
import Cinema from '@/views/platform/cinema/index.vue'
import Account from '@/views/platform/account/index.vue'
// 影院
import CinemaScreen from '@/views/cinema/screen/index.vue'
// import CinemaJoin from '@/views/cinema/join/index.vue'
// import CinemaJoinNew from '@/views/cinema/join/edit/index.vue'
import CinemaStatistics from '@/views/cinema/statistics/index.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/platform',
      component: Layout,
      redirect: '/platform/screen',
      meta: {title: '平台管理'},
      children: [
        { path: 'screen', component: Screen, name: 'screen', meta: {title: '映游模版配置'} },
        { path: 'screen_new', component: ScreenNew, name: 'screen_new', meta: {title: '新建映游模版'} },
        { path: 'game', component: Game, name: 'game', meta: {title: '游戏配置'} },
        { path: 'game_new', component: GameNew, name: 'game_new', meta: {title: '新建游戏'} },
        { path: 'wechat', component: Wechat, name: 'wechat', meta: {title: '公众号接入'} },
        { path: 'cinema', component: Cinema, name: 'cinema', meta: {title: '影院接入'} },
        { path: 'account', component: Account, name: 'account', meta: {title: '账号管理'} }
        // { path: 'join_new', component: CinemaJoinNew, name: 'cinema_join_new', meta: {title: '新建影院'} },
      ]
    },
    {
      path: '/cinema',
      component: Layout,
      redirect: '/cinema/screen',
      meta: {title: '影院管理'},
      children: [
        { path: 'screen', component: CinemaScreen, name: 'cinema_screen', meta: {title: '映游配置'} },
        { path: 'screen_new', component: ScreenNew, name: 'cinema_screen_new', meta: {title: '新建映游模版', cinema: true} },
        { path: 'statistics', component: CinemaStatistics, name: 'cinema_statistics', meta: {title: '运营统计'} }
      ]
    },
    { path: '/screen_select', component: ScreenSelect, name: 'screen_select', meta: {title: '银幕选择'} },
    { path: '/preview', component: Preview },
    { path: '/play', component: Preview },
    { path: '/login', component: Login },
    { path: '/cinema_login', component: CinemaLogin },
    { path: '/cinema_screen_select', component: CinemaScreenSelect },
    { path: '/error', component: Error },
    { path: '/', redirect: '/screen_select' }
  ]
})
