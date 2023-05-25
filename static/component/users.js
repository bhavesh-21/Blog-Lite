export default {
  template: `
  <div class="container-fluid">
    <div v-if="s" >

    <h2 v-if="users.length!=0" class="text-break text-primary" style="font-size: 1.5rem;">Search Result for : <strong class="text-success">' {{this.$store.state.query}} '</strong> with {{users.length}} matching results.</h2>

<h2 v-else class="text-break text-primary" style="font-size: 1.5rem;">Sorry, your search term: <strong class="text-danger">' {{this.$store.state.query}} '</strong> was not found...</h2>
    </div>
    <h2 v-if="this.$router.history.current.path.split('/')[1]!=='users'" class="mt-3" style="font-size: 1.5rem;">{{this.$router.history.current.path.split("/")[1]}}</h2>
    <div class="mt-2 row row-cols-1 row-cols-lg-2 row-cols-sm-1 row-cols-1 row-cols-md-1 g-4 mb-4">
    <div v-for="user in users" class="col">
        <div class="card h-100">
            <div class="card-body" style="padding-bottom: 2px;">
                <a @click="goto('/profile/'+user.username)" class="about-author d-flex align-items-center m-0 p-1">
                    <div class="col-md-4 p-1">
                        <img class="profile-pic"
                        :src="user.profile_pic" width="195px"
                            height="195px" style="object-fit: cover; object-position: center top">
                    </div>
                    <div class="col-md-8 " style="margin-left: 15px;">
                        <h5 class="card-title">{{user.name}}</h5>
                        <small>{{user.username}}</small>
                        <p class="card-text text-break">
                            {{user.about_author}}
                        </p>
                        <p class="card-text">
                            <small class="text-muted">Last Seen : {{time(user.last_login)}}</small>
                        </p>
                    </div>
                </a>
            </div>
            <div class="card-footer">
                <div v-if="user.following==false"  >
                    <button v-if="me(user.username)" @click="follow(user.username)" class="btn btn-success btn-block btn-lg gradient-custom-4 text-body">Follow</button>
                    <button v-if="c()" @click="block(user.username)" class="btn btn-danger btn-block btn-lg gradient-custom-4 text-body">Block</button>
                    <div style="float: right;">
                        {{user.f1}} Followers {{user.f2}} Following
                    </div>
                </div>
                <div v-else>
                    <button v-if="me(user.username)" @click="unfollow(user.username)" class="btn btn-danger btn-block btn-lg gradient-custom-4 text-body">Unollow</button>
                    <button v-if="c()" @click="block(user.username)" class="btn btn-danger btn-block btn-lg gradient-custom-4 text-body">Block</button>
                    <div style="float: right;">
                        {{user.f1}} Followers {{user.f2}} Following
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    </div>
      `,

  data:function() {
    return{
    s: false,
    users:null
    }
  },

  methods: {
    getImgUrl(u){
      return " data:image/png;base64, "+u;
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
            this.users.find(x =>{ if(x.username==id){
              x.following =true;
              x.f1+=1;
              
            }
            })
            this.users.find(x =>{ if(x.username==this.$store.state.user.username){
              
              x.f2+=1;
              
            }
            })
          }
        });
    },
    unfollow: function (id) {
      fetch(`/unfollow/${id}`,{
        headers: { Authorization: `Bearer ${this.$store.getters.token}` }
      })
        .then((r) => r.json())
        .then((d) => {
          if(d.msg=="ok"){
            this.users.find(x =>{ if(x.username==id){
              x.following =false;
              x.f1-=1;
              if(this.$router.history.current.path.split("/")[1]==="following"){
              var index = this.users.indexOf(x);
              if (index !== -1) {
                this.users.splice(index, 1);
              }}
              $emit('f1')
            }
            
            })
            this.users.find(x =>{ if(x.username==this.$store.state.user.username){
              
              x.f2-=1;
              
            }
            })
          }
        });
    },
    c(){
      return this.$router.history.current.path.split('/')[1]==='followers'
    },
    block: function (id) {
      fetch(`/block/${id}`,{
        headers: { Authorization: `Bearer ${this.$store.getters.token}` }
      })
        .then((r) => r.json())
        .then((d) => {
          if(d.msg=="ok"){
            this.users.find(x =>{ if(x.username==id){
              if(this.$router.history.current.path.split("/")[1]==="followers"){
              var index = this.users.indexOf(x);
              if (index !== -1) {
                this.users.splice(index, 1);
              }}
              $emit('f1')
            }
            
            })
          }
        });
    },
    me(name) {
      return this.$store.state.user.username!=name;
    },
  },
  computed: {
    userss(){
      get:{

        console.log(this.users)
        return this.users
      }
    },
    search() {
      this.close;
      return this.$store.getters.getd && this.$store.state.searchtype==null;
    },
    
    
    async query() {
      console.log("g")
      var x = this.$store.getters.getd
      console.log(x,"searchin...")
      try {
        const response = await fetch('/api/search/user?' + new URLSearchParams({
          query: x
        }),{headers: { Authorization: `Bearer ${this.$store.getters.token}`, 'Content-Type': 'application/json' }})
        const jsonData = await response.json();
        this.users=jsonData
        
      } catch (error) {
        console.error(error);
      }
     
      return x;
    }
  },
  async mounted(){
    
      var x = this.$store.getters.getd
      console.log(x)
      if(this.$router.history.current.path=='/users'){
        var x="/user"
      }else{
        var x=this.$router.history.current.path
      }
      try {
        const response = await fetch(`/api${x}`,{headers: { Authorization: `Bearer ${this.$store.getters.token}`, 'Content-Type': 'application/json' }})
        const jsonData = await response.json();
        this.users=jsonData
      } catch (error) {
        console.error(error);
      }
      if(this.$store.state.query){
        try {
          var x=this.$store.state.query
          const response = await fetch('/api/search/user?' + new URLSearchParams({
            query: x
          }),{headers: { Authorization: `Bearer ${this.$store.getters.token}`, 'Content-Type': 'application/json' }})
          const jsonData = await response.json();
          
          this.users=jsonData
          
        } catch (error) {
          console.error(error);
        }
        this.s=true
      }
    },
    watch:{
      $store (newd,old) {
        if ($store.state.query){
          this.query=null
        }
      }
    }
}