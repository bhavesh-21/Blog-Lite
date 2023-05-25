
export default {
  template: ` <div>
              
              <a  id="divfix" type="button" data-mdb-ripple-color="info" class="btn btn-outline-light rounded-circle p-0  btn-lg border-0" v-on:click="goto('/add_post')">
              <img src="/static/images/plus.svg" width="80">
              </a>
              

  <div v-if="posts.length==0 && q===null" class="container" style="text-align: center; margin-top: 180px;">
  <h2>There aren't any post to see</h2>
  <p>There are no posts in your feed. <br> Connect with other users to see what they are posting.</p>
  <a class="btn btn-dark" @click="goto('users')">Connect</a>
  </div>

  <div v-else class="container-fluid">
    <nav aria-label="Page navigation example mb-0">
      <div class="float-left text-black mt-2 my-4" >

        

        <h2 v-if="this.$router.history.current.path==='/feed'" class="" style="font-size: 1.5rem;">Feed ( {{posts.length}} )</h2>
        <h2 v-else class="" style="font-size: 1.5rem;">Posts ( {{posts.length}} )</h2>
        <i class="fa-solid fa-magnifying-glass fa-xl float-end mt-3" style="color: #0091ff;"></i>
          <input style="float:right; width: auto; margin-right:10px" type="search" class="form-control" id="q" placeholder="Search" v-model='q'>
       
          <div v-if="q.length>0">
          <h2 v-if="posts.length==0" class="text-break text-primary" style="font-size: 1.5rem;">Sorry, your search term: <strong class="text-danger">' {{ q }} '</strong> was not found...</h2>
          <h2 v-else class="text-break text-primary" style="font-size: 1.5rem;">Search Result for : <strong class="text-success">' {{ q }} '</strong> with {{posts.length}} matching results.</h2>
        </div>


      </div>
    </nav>
  
    
    <div class="row row-cols-1 row-cols-lg-2 row-cols-xl-3 row-cols-sm-1 row-cols-md-2 g-4 mb-4 mt-0">


    <div v-for="post in posts" class="col">

        <div class="card h-100">

            <a @click="goto('/post/'+post.id)">
                <img :src="post.thumbnail" class="card-img-top" alt="Skyscrapers" height="300px"
                    style="object-fit: cover; object-position: center top" />
            </a>
            <div class="card-body">
                <div style="margin: 2px;padding-top: 10px;margin-bottom: 0;">
                    <a class="as" style="line-height: 28px;
              color: rgb(56, 55, 55);
              font-size: 25px; font-weight: 650; padding-top: 10px;" @click="goto('/post/'+post.id)">
                        {{post.title.substring(0, 88)}}</a>
                    <p class="mb-0 mt-2 as">{{ post.slug.substring(1, 144) }}</p>

                </div>

            </div>

            <div class="card-footer border-0">
                <a @click="goto('/profile/'+post.poster.username)" class="d-flex align-items-center">
                    <div class="mr-2">
                        <img class="profile-pic" :src="post.poster.profile_pic" width="40px" height="40px"
                            style="object-fit: cover; object-position: center top">
                    </div>
                    <div style="margin:0px 15px 0px 15px">
                        <strong class="author_name">{{post.poster.name}}</strong>
                        <span class="date">{{ time(post.timestamp) }}</span>
                    </div>

                </a>
            </div>
            <div class="card-footer border-0">
                <div class="d-flex justify-content-end ms-auto" style="margin-bottom: 0; ">



                    <div v-if="check(post)" style="margin-right:auto;">
                        <a v-if="post.liked===true" @click="like_post(post.id)" class="btn btn-sm"
                            style="margin:0px 0px 0px 4px ;padding-left: 0px; padding-right: 2px;">
                            <img class="mb-1" src="/static/images/like.svg" width="20">
                            {{post.lik}}
                        </a>
                        <a v-else @click="like_post(post.id)" class="btn btn-sm"
                            style="margin:0px 0px 0px 4px ;padding-left: 0px; padding-right: 2px;">
                            <img class="mb-1" src="/static/images/like-white.svg" width="20">
                            {{post.lik}}
                        </a>
                        <a @click="goto('/post/'+post.id)" class="btn btn-sm"
                            style="margin:0px auto 0px 4px ; padding-left: 0px;">
                            <img class="mb-1" src="/static/images/comment.svg" width="20">
                            {{post.commen}}
                        </a>
                    </div>

                    <div v-else style="margin-right:auto;">
                        <div class="inline" style="margin:0px 0px 0px 4px  ;padding-left: 0px; padding-right: 2px;">
                            <img class="mb-1" src="/static/images/my-like.svg" width="20">
                            {{post.lik}}
                            </a>
                        </div>
                        <div class="inline" style="margin:0px auto 0px 5px; padding-left: 0px;">
                            <img class="mb-1" src="/static/images/comment.svg" width="20">
                            {{post.commen}}
                        </div>
                    </div>

                    <div v-if="check(post)">
                        <a style="padding-left: 3px; margin-right: 5px;" @click="goto('/post/'+post.id)"
                            class="btn btn-outline-secondary btn-sm">
                            <img class="mb-1" src="/static/images/read.svg" width="20"> Read
                            Post
                        </a>
                    </div>

                    <div v-else>
                        <a style="padding-left: 3px; margin-right: 5px;" @click="goto('/edit_post/'+post.id)"
                            class="btn btn-outline-secondary btn-sm">
                            <img class="mb-1" src="/static/images/edit.svg" width="20">Edit
                            Post
                        </a>

                        <a style="padding-left: 1px; margin-left: 5px;" @click="delete_post(post.id)"
                            class="btn btn-outline-danger btn-sm">
                            <img class="mb-1" src="/static/images/d.svg" width="20">Delete
                            Post
                        </a>
                    </div>






                </div>
            </div>
        </div>
    </div>

</div>
          

  
  
  
  
  
  
  </div>
</div>   
            
      `,

  data: function () {
    return {
      q: "",
      p: [],
      posts: [],
      saved: false
    }
  },

  methods: {

    async delete_post(id) {
      const res2 = await fetch(`/posts/delete/${id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem("access_token") ? sessionStorage.getItem("access_token") : localStorage.getItem("access_token")}`, 'Content-Type': 'application/json'
        },
      })
      if (res2.status === 200) {
        let jsonData = await res2.json();
        console.log(jsonData.msg)
        const res = await fetch(`/api/feed`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem("access_token") ? sessionStorage.getItem("access_token") : localStorage.getItem("access_token")}`, 'Content-Type': 'application/json'
          },
        })

        if (res.status === 200) {
          let jsonData = await res.json();
          this.posts = jsonData;
          console.log(this.posts)
        } else if (res.status === 400) {
          let errorResponse = await res.json();
          console.error(errorResponse.error);
        }
      } else if (res2.status === 400) {
        let errorResponse = await res2.json();
        console.error(errorResponse.error);
      }

    },
    check(post) {
      console.log("my id ", this.$store.state.user.username);
      return post.poster.username != this.$store.state.user.username;
    },
    goto(url) {
      this.$router.push(url).catch(() => { });
    },
    time(t) {
      try{
        var x= moment(moment.tz(t, 'Asia/Maldives').utc().format()).fromNow(true);
        
      }
      catch{

      }
      return x;
    },
    me(name) {
      return this.$store.state.user.username != name;
    },
    like_post(id) {
      console.log("liked")
      fetch(`/like-post/${id}`, {
        headers: { Authorization: `Bearer ${this.$store.getters.token}` }
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.msg == "ok") {
            for (var i = 0; i < this.posts.length; i++) {

              console.log(this.posts[i].title)
              if (this.posts[i].id == id) {
                if (!this.posts[i].liked) {
                  this.posts[i].lik += 1
                } else {
                  this.posts[i].lik -= 1
                }
                this.posts[i].liked = !this.posts[i].liked
                console.log(this.posts[i].liked)
              }

            }

          }
        });
    }

  },
  computed: {

  },
  props: ['id'],
  async mounted() {
    if (this.$router.history.current.path === '/feed') {
      var x = "feed"
    } else {
      var x = "my-posts?id=" + this.id
    }
    const res = await fetch(`/api/${x}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem("access_token") ? sessionStorage.getItem("access_token") : localStorage.getItem("access_token")}`, 'Content-Type': 'application/json'
      },
    })

    if (res.status === 200) {
      let jsonData = await res.json();
      this.posts = jsonData;
      console.log(this.posts)
    } else if (res.status === 400) {
      let errorResponse = await res.json();
      console.error(errorResponse.error);
    }


    // try {
    //   const response = await fetch('/api/posts',{headers: { Authorization: `Bearer ${this.$store.getters.token}`, 'Content-Type': 'application/json' }})
    //   const jsonData = await response.json();
    //   this.users=jsonData
    // } catch (error) {
    //   console.error(error);
    // }

  },
  watch: {
    q(n, o) {
      if (n.length > 0) {
        if (this.$router.history.current.path === '/feed') {
          var x = "feed?"
        } else {
          var x = "my-posts?id=" + this.id+"&"
        }
        console.log("searching feed")
        fetch(`/api/search/${x}` + new URLSearchParams({
          query: this.q
        }), {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem("access_token") ? sessionStorage.getItem("access_token") : localStorage.getItem("access_token")}`, 'Content-Type': 'application/json'
          },
        }).then(res => {
          if (res.status === 200) {
            return res.json();
          }
        }).then(jsonData => {
          console.log(jsonData);
          if (this.saved == false) {
            this.p = this.posts;
            console.log("saving:", this.p)
            this.saved = true
          }
          this.posts = jsonData;
          console.log(this.posts)
        })
      } else {
        this.posts = this.p;
        console.log("restore:", this.p)
        this.p = [];
        this.saved = false
      }
    }
  }
}



