import router from './router.js'
import store from './store.js'
import navbar from './component/navbar.js'
new Vue({
  el: '#app',
  template: `<div> 
  <navbar :key="this.$store.state.login"/>
  
  <router-view :key="this.$store.getters.getd"></router-view>
  </div>
  
  `,
  router,
  store,
  methods: {
    
    l(){
      console.log("in l")
      // this.$store.state.count=true
      this.$store.commit("set_login_details",false)
    }
  },
   mounted() {
    
    if (localStorage.getItem("access_token") === null && sessionStorage.getItem("access_token") === null) {
      this.$store.commit("set_login_details",false)
      this.$router.push('/')
    }
    else {
      this.$store.commit("set_login_details",true)
      this.$router.push('/feed')
    }
  },
  components:{
    navbar
  },
  Updated() {
    this.$store.commit("alert")=null
  },
  watch: {
    $route(newp, old) {
      var r=this.$router.history.current.path
      if (r==="/feed" || r==="/profile" || r==="/users"|| r==="/add_post" || r==="/dashboard"){
        if(this.$store.state.login==false){
        this.$router.push('/').catch(() => { })
      }
      }
      
    }
  }
})
