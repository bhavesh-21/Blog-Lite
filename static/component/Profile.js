import feed from './feed.js'
export default {
  template: `
  <div class="container-fluid">
    <div class="card mb-10 mt-4">
      <div class="row g-0 ">

          <div class="col-sm-12 col-lg-3 d-flex justify-content-center align-items-center">
              <img class="profile-pic" :src="user.profile_pic" height="250px" width="250px"
                  style="object-fit: cover; object-position: center top">

          </div>
          <div class="col-sm-12 col-lg-3 card" style="border: none; border-width : 0;">
              <div class="card-body">
                  <h5 class="card-title fs-2">{{ user.name }}</h5>
                  <p class="card-text">
                      <strong>Username:</strong>
                      {{ user.username }}<br />

                      <strong>UserID:</strong>
                      {{ user.id }}<br />

                      <strong>Email:</strong>
                      {{ user.email }}<br />


                  <div v-if="user.about_author">
                      <strong>About:</strong>
                      {{ user.about_author.substring(0,70)}}
                  </div>

                  <div v-if="user.last_login">
                      <strong>Last Login:</strong>
                      {{ time(user.last_login) }}
                  </div>

                  </p>

              </div>
              <div class="card-footer">


                  <div v-if="!me(user.username)">

                      <a @click="logout()" class="btn btn-secondary btn-sm">Logout</a>

                      <a @click="goto('/update/'+user.username)" class="btn btn-secondary btn-sm">Edit</a>

                      

                      <a @click="delete_u(user.username)"  class="btn btn-danger btn-sm">Delete</a>

                      

                  </div>


                  <div v-else-if="!user.following">
                      <button @click="follow(user.username)" class="btn btn-success">Follow</button>
                  </div>

                  <div v-else>
                      <button @click="unfollow(user.username)" class="btn btn-danger">Unollow</button>
                  </div>

              </div>
          </div>
          <div class="col-sm-6 col-lg-3 p-4 col-6">
              <a @click="f1(user.username)">
                  <div class="card-body shadow d-flex justify-content-center align-items-center text-center fs-3"
                      style="background:rgb(238, 189, 149); height: 100%; width: 100%; border-radius: 3px; padding:auto 0 auto 0; color: rgb(65, 80, 80);">
                      <p style="margin-bottom: 0px; line-height: 2rem;">
                          {{ user.f1 }} <br> Followers
                      </p>
                  </div>
              </a>
          </div>
          <div class="col-sm-6 col-lg-3 p-4 col-6">
              <a @click="f2(user.username)">
                  <div class="card-body shadow d-flex justify-content-center align-items-center text-center fs-3"
                      style="background:rgb(199, 241, 199); height: 100%; width: 100%; border-radius: 3px; padding:auto 0 auto 0; color: rgb(65, 80, 80);">
                      <p style="margin-bottom: 0px; line-height: 2rem;">
                          {{ user.f2 }} <br> Following
                      </p>
                  </div>
              </a>
          </div>
      </div>
    </div>
  <feed :id="user.id" @f1="this.user.f1-=1"  @f2="this.user.f2-=1"/>

  </div>
      `,

  data:function() {
    return{
    user:null
    }
  },
  components:{
    feed
  },

  methods: {
    async delete_u(id){
      console.log("deleting...")
      const res2 = await fetch(`/delete/${id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem("access_token") ? sessionStorage.getItem("access_token") : localStorage.getItem("access_token")}`, 'Content-Type': 'application/json'
        },
      })
      if (res2.status === 200) {
        let jsonData = await res2.json();
        console.log(jsonData.msg)
        this.logout();
        this.goto('/feed')
      } else if (res2.status === 400) {
        let errorResponse = await res2.json();
        console.error(errorResponse.error);
      }
        
    },
    logout() {
      this.$store.commit("set_login_details", false)
      this.$store.state.user = {}
      fetch(`/logou`,{
        headers: { Authorization: `Bearer ${sessionStorage.getItem("access_token") ? sessionStorage.getItem("access_token") : localStorage.getItem("access_token")}` }
      })
        .then((r) => r.json())
        .then((d) => {
            console.log(d.msg)
        });
      this.$router.push('/').catch(e={})
      localStorage.removeItem('access_token')
      sessionStorage.removeItem('access_token')
    },
    delete_user(name){

    },
    f1(name){
      if(this.$store.state.user.username != name || this.user.f1==0){

      }else{
        this.goto('/followers/'+name)
      }
    },
    f2(name){
      if(this.$store.state.user.username != name || this.user.f2==0){

      }else{
        this.goto('/following/'+name)
      }
    },
    me(name) {
      return this.$store.state.user.username!=name;
    },
    goto(url) {
      this.$router.push(url).catch(()=>{});
    },
    time(t) {
      try{
        var x= moment(moment.tz(t, 'Asia/Maldives').utc().format()).fromNow(true);
        
      }
      catch{

      }
      return x;
    },
    follow: function (id) {
      fetch(`/follow/${id}`,{
        headers: { Authorization: `Bearer ${this.$store.getters.token}` }
      })
        .then((r) => r.json())
        .then((d) => {
          if(d.msg=="ok"){
              this.user.following =true;
              this.user.f1+=1;
          }
        });
    },
    unfollow: function (id) {
      fetch(`/unfollow/${id}`,{
        headers: { Authorization: `Bearer ${sessionStorage.getItem("access_token") ? sessionStorage.getItem("access_token") : localStorage.getItem("access_token")}` }
      })
        .then((r) => r.json())
        .then((d) => {
          if(d.msg=="ok"){
            this.user.following =false;
            this.user.f1-=1;
          }
        });
    },
  },
  computed: {
  
  },
  async mounted(){
      try {
        const response = await fetch(`/api/user/${this.$route.params.username}`,{headers: { Authorization: `Bearer ${this.$store.getters.token}`, 'Content-Type': 'application/json' }})
        const jsonData = await response.json();
        this.user=jsonData
      } catch (error) {
        console.error(error);
      }
    }
}