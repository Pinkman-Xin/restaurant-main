import Vue from 'vue'
import Router from 'vue-router'
import Pos from '../view/Pos.vue'
import Login from '../view/Login.vue'
import Register from '../view/Register.vue'
Vue.use(Router)


  const routes= [
    {
      path: '/',
      name: 'pos',
      redirect: '/Login',
      component: Login
    },
    {
      path:'/pos',
      component:Pos
    },
    {
      path: '/login',
      name: 'login',
      meta:{isPublic:true},
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      meta:{isPublic:true},
      component: Register
    }
  ]

const router = new Router({
  routes
})
router.beforeEach((to,from,next)=>{
  if(!to.meta.isPublic && !localStorage.token){
    return next('/login')
  }
  next()
})
export default router