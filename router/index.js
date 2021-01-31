import Vue from 'vue'
import Router from 'vue-router'

import Login from '../src/components/Login'

Vue.use(Router)

const routes = [
    {
        name: 'home',
        path: '/',
        component: Login,
    }
]

const router = new Router({ routes })

export default router