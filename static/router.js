import Home from './component/Home.js'
import Profile from './component/Profile.js'
import Login from './component/Login.js'
import Register from './component/register.js'
import Index from './component/index.js'
import users from './component/users.js'
import feed from './component/feed.js'
import dashboard from './component/dashboard.js'
import post from './component/post.js'
import edit_post from './component/edit-post.js'
import _404 from './component/404.js'
const routes = [
  { path: '/', component: Index },
  { path: '/profile/:username', component: Profile },
  { path: '/followers/:username', component: users },
  { path: '/following/:username', component: users },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: dashboard },
  { path: '/add_post', component: edit_post },
  { path: '/edit_post/:id', component: edit_post },
  { path: '/update/:username', component: Register },
  { path: '/users', component: users },
  { path: '/feed', component: feed },
  { path: '/post/:id', component: post },
  { path: '*', component: _404 },
]

const router = new VueRouter({
  routes,
})

export default router
