
export default {
  template: ` 
<div>
    <div class="container d-flex justify-content-center">



    <div class="shadow p-3 mb-5 bg-body rounded col-md-9  mb40" style="box-sizing: border-box;">

        <img :src="post.thumbnail" alt="" class="img-fluid" style="border-radius: 0.8%;">
        <div class="post-content pt-4">
            <h2 class="as">{{ post.title }}</h2>
            <div class="mb-3">
                <div class="inline">
                    <img class="mb-1" src="/static/images/author.svg" width="20">{{post.poster.name }}
                </div>
                |
                <div class="inline">
                    <img class="mb-1" src="/static/images/cal.svg" width="20">
                    {{time(post.timestamp)}}
                </div>

            </div>
            <div>
                <div class="d-flex justify-content-end ms-auto mb-3">
                    <div v-if="check(post)">
                        <a @click="goto('/feed')" class="btn btn-outline-secondary btn-sm "
                            style="margin:0px 0px 0px 0px ;"><img src="/static/images/back.svg" width="24"> Back To
                            Feed</a>

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


                        <a href="#comment-box" class="btn btn-sm" style="margin:0px auto 0px 4px ; padding-left: 0px;">
                            <img class="mb-1" src="/static/images/comment.svg" width="20">
                            {{post.commen}}
                        </a>


                    </div>
                    <div v-else>

                        <a @click="goto('/feed')" class="btn btn-outline-secondary btn-sm "
                            style="margin:0px 0px 0px 0px ;"><img src="/static/images/back.svg" width="24"> Back To
                            Feed</a>
                        

                        <div class="inline" style="margin:0px 0px 0px 4px  ;padding-left: 0px; padding-right: 2px;">
                            <img class="mb-1" src="/static/images/my-like.svg" width="20">
                            {{post.lik}}
                            </a>
                        </div>

                        <div class="inline" style="margin:0px auto 0px 5px; padding-left: 0px;">
                            <img class="mb-1" src="/static/images/comment.svg" width="20">
                            {{post.commen}}
                        </div>

                        <a @click="goto('/edit_post/'+post.id)" class="btn btn-outline-secondary btn-sm" style="
                        margin-right: 5px;
                    "><img class="mb-1" src="/static/images/edit.svg" width="20"> Edit
                            Post</a>

                        <a  @click="delete_post(post.id)" class="btn btn-outline-danger btn-sm"><img
                                class="mb-1" src="/static/images/d.svg" width="20">Delete
                            Post</a>

                    </div>
                </div>

            </div>
            <h6 class="as">{{post.slug}}</h6>

            <div v-html="span(post.content)" /> 

            <hr class="mb-3">
            <h4>About Author</h4>
            <a @click="goto('/profile/'+post.poster.username)"  class="about-author d-flex align-items-center">
                <img class="profile-pic"
                    :src="post.poster.profile_pic" width="160"
                    height="160" style="object-fit: cover; object-position: center top">

                <div style="margin-left: 20px;" class="com">
                    <h5>{{ post.poster.name }}</h5>
                    
                    <span v-if="post.poster.about_author!='None'">

                        {{ post.poster.about_author }}
                    </span>
                    <span v-else>

                        Author has no about profile yet...
                    </span>
                    
                </div>
            </a>
            <hr class="mb-3">

            <h4 id="comment-box">Comments</h4>

          
            <p v-if="post.comments.length==0">No Comments Yet ...</p>
          

            

            <div v-for="comment in post.comments" class="about-author mb-4">
            
                <img class="profile-pic"
                    :src="comment.user_profile_pic" width="80"
                    height="80" style="object-fit: cover; object-position: center top">
                <div class="reply-body container">
                    <h5>
                        <a v-if="c(comment.author)" @click="remove_comment(comment.id)"
                            class="btn btn-outline-danger btn-sm reply"><img class="mb-1"
                                src="/static/images/d.svg" width="20">Delete
                            Comment</a>
                        {{ comment.user_name }}
                    </h5><span class="com"> {{ comment.text }}</span>
                </div>
            </div>

            

            <hr style="margin-top: 40px;">


            <h4 style=" margin-bottom: 15px;">Post a comment</h4>
            <form @click.prevent="comment_do(post.id)" >
                <div class="form-group">
                    <textarea class="mb-3 form-control form-control-lg" id="exampleFormControlTextarea1" placeholder="Write comment here ..." rows="3" style="width:100%;" v-model='comment'></textarea>
                  </div>
                  <button class=" btn btn-primary btn-block btn-lg gradient-custom-4 text-body" >Comment</button>
            </form>
        </div>
    </div>
    </div>
</div>   
            
      `,

  data: function () {
    return {
      post: '',
      comment: ''
    }
  },

  methods: {
    span(text) {
      return `<span> ${text} </span>`
     },
    async delete_post(id){
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
        this.goto('/feed')
      } else if (res2.status === 400) {
        let errorResponse = await res2.json();
        console.error(errorResponse.error);
      }
        
    },
    async remove_comment(id) {
      const res2 = await fetch(`/remove-comment/${id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem("access_token") ? sessionStorage.getItem("access_token") : localStorage.getItem("access_token")}`, 'Content-Type': 'application/json'
        },
      })
      if (res2.status === 200) {
        let jsonData = await res2.json();
        console.log(jsonData.msg)
        const res = await fetch(`/api/comments/post/${this.post.id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem("access_token") ? sessionStorage.getItem("access_token") : localStorage.getItem("access_token")}`, 'Content-Type': 'application/json'
          },
        })
        if (res.status === 200) {
          let jsonData = await res.json();
          this.post.comments = jsonData;
          this.post.commen-=1
          console.log(this.post)
        } else if (res.status === 400) {
          let errorResponse = await res.json();
          console.error(errorResponse.error);
        }
        console.log(this.post)
      } else if (res2.status === 400) {
        let errorResponse = await res2.json();
        console.error(errorResponse.error);
      }
    },
    async comment_do(id) {
      if (this.comment.length > 0) {
        const res2 = await fetch(`/comment/${id}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem("access_token") ? sessionStorage.getItem("access_token") : localStorage.getItem("access_token")}`, 'Content-Type': 'application/json'
          },
          body: JSON.stringify({ comment: this.comment })
        })
        if (res2.status === 200) {
          let jsonData = await res2.json();
          console.log(jsonData)
          const res = await fetch(`/api/comments/post/${this.post.id}`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem("access_token") ? sessionStorage.getItem("access_token") : localStorage.getItem("access_token")}`, 'Content-Type': 'application/json'
            },
          })
          if (res.status === 200) {
            let jsonData = await res.json();
            this.post.comments = jsonData;
            this.post.commen+=1
            this.comment=''
            console.log(this.post)
          } else if (res.status === 400) {
            let errorResponse = await res.json();
            console.error(errorResponse.error);
          }
          console.log(this.post)

        } else if (res.status === 400) {
          let errorResponse = await res.json();
          console.error(errorResponse.error);
        }
      }

    },
    c(a) {
      var x = a == this.$store.state.user.id
      var y = this.post.poster.id == this.$store.state.user.id
      console.log("user", a, "made a comment", x, y, this.post.poster.id, this.$store.state.user.id, x || y)
      return x || y
    },
    check(post) {
      console.log("my id ", this.$store.state.user.username);
      return post.poster.username != this.$store.state.user.username;
    },
    goto(url) {
      this.$router.push(url).catch(() => { });
    },
    time(t) {
      const x = moment(t).fromNow()
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
            console.log(this.post.title)
            if (!this.post.liked) {
              this.post.lik += 1
            } else {
              this.post.lik -= 1
            }
            this.post.liked = !this.post.liked
            console.log(this.post.liked)
          }
        });
    }
  },
  computed: {
  },
  async mounted() {
    const res = await fetch(`/api${this.$router.history.current.path}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem("access_token") ? sessionStorage.getItem("access_token") : localStorage.getItem("access_token")}`, 'Content-Type': 'application/json'
      },
    })
    if (res.status === 200) {
      let jsonData = await res.json();
      this.post = jsonData;

      const res2 = await fetch(`/api/comments/post/${this.post.id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem("access_token") ? sessionStorage.getItem("access_token") : localStorage.getItem("access_token")}`, 'Content-Type': 'application/json'
        },
      })
      if (res2.status === 200) {
        let jsonData = await res2.json();
        this.post.comments = jsonData;
        console.log(this.post)
      } else if (res2.status === 400) {
        let errorResponse = await res2.json();
        console.error(errorResponse.error);
      }
      console.log(this.post)

    } else if (res.status === 400) {
      let errorResponse = await res.json();
      console.error(errorResponse.error);
    }
  }
}


