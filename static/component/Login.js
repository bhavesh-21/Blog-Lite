export default {
  template: `<div>
                          <section class="vh-91 mt-0">
                          <div class="container py-5 h-100">
                            <div class="row d-flex justify-content-center align-items-center h-100">
                              <div class="col col-xl-10">
                                <div class="card" style="border-radius: 1rem;">
                                  <div class="row g-0">
                                    <div class="col-md-6 col-lg-5 d-none d-md-block">
                                      <img src="/static/images/A.png" alt="login form" class="img-fluid"
                                        style="border-radius: 1rem 0 0 1rem; width:100%; height: 100%;" />
                                    </div>
                                    <div class="col-md-6 col-lg-7 d-flex align-items-center">
                                      <div class="card-body p-4 p-lg-5 text-black">

                                        <form @submit.prevent="login">

                                          <div class="d-flex align-items-center mb-3 pb-1">
                                            <img src="/static/images/blog-black.png" width="30" height="30"
                                              class="d-inline-block align-top mr-3" alt="">
                                            <span class="h1 fw-bold mb-0 ml-2" style="margin-left: 10px;">Blog Lite</span>
                                          </div>

                                          <h5 class="fw-normal mb-3 pb-3" style="letter-spacing: 1px;">Sign into your account
                                          </h5>

                                          <div class="form-group">
                                            <input type="email" class="form-control" id="email" placeholder="Enter email" v-model='email'>
                                            
                                          </div>
                                          <div class="form-group mt-2">
                                            <input type="password" class="form-control" id="password" placeholder="Password" v-model='password'>
                                          </div>
                                          <span class="text-danger mt-2">{{error}}</span>
                                          <div class="form-check mt-2">
                                            <input type="checkbox" class="form-check-input" id="Check" v-model='remember'>
                                            <label class="form-check-label" for="Check">  Remember Me</label>
                                          </div>
                                          <button class="btn btn-dark btn-lg btn-block pt-1 my-4" style="width:100%">Login</button>

                                          <p class="mb-1 pb-lg-2" style="color: #393f81;">Don't have an account? 
                                            <a class="hand" @click="gotoregister()" style="color: #393f81;">Register here</a>
                                          </p>
                                        </form>

                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
    </div>
    

    `,

  data() {
    return {
      email: null,
      password: null,
      remember: false,
      error:null
    }
  },

  methods: {
    gotoregister() {
      this.$router.push('/register')
    },
    async fetc() {
      console.log("fetch user")
      try {
        const response = await fetch("/current-user", {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        const jsonData = await response.json();
        this.$store.commit("set_user_details", jsonData)
      } catch (error) {
        console.error(error);
      }
    },
    async login() {
      console.log("login")
      const res=await fetch('/log', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ email: this.email, password: this.password }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.status === 200) {
        let data = await res.json();
        if (this.remember) {
          localStorage.setItem(
            'access_token',
            data.access_token
          )
        } else {
          sessionStorage.setItem(
            'access_token',
            data.access_token
          )
        }
        this.$store.commit("set_login_details", true)
        this.$router.push('/feed')
      } else {
        let errorResponse = await res.json();
        this.error=errorResponse.msg
      }

        
    },
  },
  mounted(){
    if(this.$store.state.login==true){
      this.$router.push('/feed')
    }
  }
}