export default {
  template: `<div>
  <section class="vh-91 bg-image">
  <div class="mask d-flex align-items-center h-100">
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-9 col-lg-7 col-xl-6">
          <div class="card mb-3" style="border-radius: 15px;">
            <div class="card-body p-5">
              <h2 v-if="this.$router.history.current.path.split('/')[1] === 'update'" class="text-uppercase text-center mb-3">Edit account Details</h2>
              <h2 v-else class="text-uppercase text-center mb-3">Create an account</h2>
    </div>          <form
                      id="app"
                      @submit="checkForm"
                      action="https://vuejs.org/"
                      method="post"
                      novalidate="true"
                    >
                    
                      <div v-if="this.$router.history.current.path.split('/')[1] === 'update'" class="form-group mb-3" style="margin-left:15px">
                        <h5 for="File1">Profile Pic</h5>
                        <input type="file" id="input_image" class="form-control-file" @change="onFileSelected">
                      </div>
                    
  
                    <div class="form-group mb-3 px-3">
                      <input type="test" class="form-control form-control-lg" id="name" placeholder="name" v-model='name'>
                    </div>
                    <div class="form-group mb-3 px-3">
                      <input type="text" class="form-control form-control-lg" id="username" placeholder="username" v-model='username'>
                    </div>
                    <div v-if="this.$router.history.current.path.split('/')[1] !== 'update'" class="form-group mb-3 px-3">
                      <input type="email" class="form-control form-control-lg" id="email" placeholder="email" v-model='email'>
                    </div>
                    
                    <div class="form-group mb-3 px-3">
                    <input type="password" class="form-control form-control-lg" id="password" placeholder="password" v-model='password'>
                    </div>
                    <div class="form-group mb-3 px-3">
                    <input type="password" class="form-control form-control-lg" id="reenter-password" placeholder="Renter Password" v-model='repassword' v-bind:class="cclass">
                    </div>
                    
                    <div v-if="this.$router.history.current.path.split('/')[1] === 'update'" class="form-group">
                      <textarea class="mx-3 mb-3 form-control form-control-lg" id="exampleFormControlTextarea1" placeholder="about" rows="3" style="width:93%;" v-model='about'></textarea>
                    </div>
                    <span style="margin-left: 15px; margin-bottom:10px" v-for="error in errors" class=" text-danger mt-2 d-block"><i  class="fa-sharp fa-solid fa-circle-xmark mr-4" style="color: #f23636; margin-right:10px"></i>{{error}}</span>
                        
                    <button v-if="this.$router.history.current.path.split('/')[1] === 'update'" class="mx-3 btn btn-success btn-block btn-lg gradient-custom-4 text-body" style="width:93%;">Update</button>
                    <button v-else class="mx-3 btn btn-success btn-block btn-lg gradient-custom-4 text-body" style="width:93%;">Register</button>
                    </form>
                    <p class="mb-1 pb-lg-2 text-center text-muted mt-3 mb-0" style="color: #393f81;">Have already an account? 
                    <a class="hand" @click="goto('/login')" style="color: #393f81;">Login here</a>
                  </p>

              </div >
            </div >
          </div >
        </div >
      </div >
   
  </section >
</div>
    `,

  data() {
    return {
      email: '',
      password: '',
      repassword: '',
      name: '',
      about: '',
      username: '',
      cclass: null,
      errors: [],
      selectedFile: null
    }
  },

  methods: {
    onFileSelected(event) {
      this.selectedFile = event.target.files[0]
    },
    checkForm: function (e) {
      e.preventDefault();
      this.errors = [];

      if (this.name === '') {
        this.errors.push('Name required.');
      }
      if (this.username === '') {
        this.errors.push('username required.');
      }
      if (this.email === '') {
        this.errors.push('email required.');
      }
      if (this.password === '') {
        this.errors.push('password required.');
      }
      if (this.password !== this.repassword) {
        this.errors.push('Passwords no match');
      }
      if (this.errors.length == 0) {
        if (this.$router.history.current.path.split('/')[1] === 'update') {
          console.log("sending...")
          const fd = new FormData();
          if (this.selectedFile!=null){
            fd.append('profile_pic', this.selectedFile)
            console.log("sss")
          }
          // axiox.post({
          //     method: 'post',
          //     url: '/update',
          //     data: fd,
          //     headers: {
          //       Authorization: `Bearer ${sessionStorage.getItem("access_token") ? sessionStorage.getItem("access_token") : localStorage.getItem("access_token")}`,
          //     }
          //   })
          //     .then(res => {
          //       console.log(res)
          //     })
          // fd.append('files', this.selectedFile)
          // fd.append('name', this.name)
          fd.append('username', this.username)
          fd.append('name', this.name)
          fd.append('password', this.password)
          fd.append('about', this.about)
          // axiox.post({
          //   method: 'post',
          //   url: '/update',
          //   data: fd,
          //   headers: {
          //     'Content-Type': `multipart/form-data;`,
          //   }
          // })
          //   .then(res => {
          //     console.log(res)
          //   })
          fetch('/update', {
            method: 'POST',
            body: fd,
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token") ? sessionStorage.getItem("access_token") : localStorage.getItem("access_token")}`,
            }
          })
            .then(r => r.json())
            .then(data => {
              console.log(data)
              
              console.log("fetch user")
              fetch("/current-user", {
                headers: { Authorization: `Bearer ${sessionStorage.getItem("access_token") ? sessionStorage.getItem("access_token") : localStorage.getItem("access_token")}` }
              }).then(response => { return response.json() }).then(u => {
                // const u = await response.json();
                this.password = u.password
                this.repassword = u.repassword
                this.name = u.name
                this.about = u.about
                this.username = u.username
                this.$store.state.user=u
                this.goto("/profile/"+this.username)
              })
                .catch(error =>
                  console.error(error))
            })
          // fetch("/api/user", {
          //   method: 'POST',
          //   headers: {
          //     'Accept': 'application/json',
          //     'Content-Type': 'application/json'
          //   },
          //   body: JSON.stringify({
          //     "name": this.name,
          //     "username": this.username,
          //     "email": this.email,
          //     "password": this.password,
          //   })
          // })
          //   .then(async res => {
          //     if (res.status === 201) {
          //       alert("Registration Secessfull !");
          //       this.goto("/login");
          //     } else if (res.status === 400) {
          //       let errorResponse = await res.json();

          //       this.errors.push(errorResponse.error_message);

          //     }
          //   });
        } else {
          fetch("/api/user", {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "name": this.name,
              "username": this.username,
              "email": this.email,
              "password": this.password,
            })
          })
            .then(async res => {
              if (res.status === 201) {
                alert("Registration Secessfull !");
                this.goto("/login");
              } else if (res.status === 400) {
                let errorResponse = await res.json();

                this.errors.push(errorResponse.error_message);

              }
            });
        }
      }
    },
    goto(url) {
      this.$router.push(url).catch(() => { })
    },
    register() {
      if (this.password !== this.repassword) {
        this.error[0] = "Passwords Don't Match"
      } else {
        fetch('/register', {
          credentials: 'include',
          method: 'POST',
          body: JSON.stringify({ email: this.email, password: this.password, name: this.name, username: this.username }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => {

            if (res.ok) {
              return res.json()
            }
          })
          .then((data) => {
            localStorage.setItem(
              'access_token',
              data.access_token
            )
            this.$router.push('/login')
          })
      }
    },
  },
  props: ['u'],
  mounted() {
    if (this.$router.history.current.path.split('/')[1] === 'update') {
      fetch("/current-user", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("access_token") ? sessionStorage.getItem("access_token") : localStorage.getItem("access_token")}` }
      }).then(response => { return response.json() }).then(u => {
        // const u = await response.json();
        this.email = u.email
        this.name = u.name
        this.about = u.about
        this.username = u.username
        if (this.$router.history.current.path.split('/')[2] !== u.username) {
          alert('You Can Edit Your Details only!')
          this.goto('/feed');
        } 
      })
        .catch(error =>
          console.error(error))
    } else {
      
      
  
    }
    

  },
  watch: {
    repassword(newp, old) {
      if (newp != this.password) {
        this.cclass = "border-danger"
      }
      else {
        this.cclass = "border-success"
      }
    }
  }
}










