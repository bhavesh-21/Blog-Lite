import router from './router.js'
const store = new Vuex.Store({
  state: {
    login: false,
    user: {},
    searchtype:null,
    query:null,
    token:null
  },
  getters: {
    
  getT: state => {
    return state.searchtype;
  },
  getd: state => {
    return state.query;
  },
    token(state, getters) {
      if (localStorage.getItem("access_token") === null && sessionStorage.getItem("access_token") !== null) {
        state.token=sessionStorage.getItem("access_token")
        return sessionStorage.getItem("access_token")
      } else if (localStorage.getItem("access_token") !== null && sessionStorage.getItem("access_token") === null) {
        state.token=localStorage.getItem("access_token")
        return localStorage.getItem("access_token")
      }
    }
  },
  mutations: {
    reset_search(state){
      store.query=null
      store.searchtype=null
    },
    set_login_details(state, login) {
      state.login = login
      console.log("mut", login)
      
      if (login === true) {
        store.dispatch("fetch_logged_user_deatails")

      }
      else if (login === false) {
        store.commit("set_user_details", {})
        localStorage.removeItem('access_token')
        sessionStorage.removeItem('access_token')
        
      }
      
    },
    set_user_details(state, user) {
      state.user = user
    },
    search(state,query){
      var route=router.history.current.path
      if (route === "/users") {
        state.searchtype= "user"
      } else if (route === "/profile") {
        state.searchtype= "posts"
      } else {
        state.searchtype= "feed"
      }
      state.query=query
    }
    
  },
  actions: {
    async fetch_logged_user_deatails(context) {
      console.log("fetch user")
      context.commit("set_user_details", {})
      try {
        const response = await fetch("/current-user", {
          headers: { Authorization: `Bearer ${store.getters.token}` }
        });
        const jsonData = await response.json();
        context.commit("set_user_details", jsonData)
      } catch (error) {
        console.error(error);
      }
    }
  },
    async jj(context) {
      console.log("jj jj")
    }
  },
  
)
export default store;