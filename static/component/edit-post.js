export default {
  template: `
<div>
      
<br>
<div class="d-flex justify-content-center">

	<h2 v-if="this.$router.history.current.path.split('/')[1] === 'add_post'" class="col-md-9" style="margin-left: 10px; margin-bottom: 20px;">CREATE NEW POST</h2>
	<h2 v-else class="col-md-9" style="margin-left: 10px; margin-bottom: 20px;">EDIT POST</h2>
</div>
<div class="container-flex d-flex justify-content-center">
	<div class="shadow p-3 mb-5 col-md-9 bg-body rounded">

  <form
  id="app"
  @submit="checkForm"
  method="post"
  novalidate="true"
>
			<a @click="goto('/feed')" class="btn btn-outline-secondary btn-sm "
				style="margin:0px 0px 0px 0px ;"><img src="/static/images/back.svg"
					width="24"> Back To Feed</a>
					
			<div class="reply"><button type="submit" class="btn btn-success" style="width:93%;">Submit</button>
			</div>
      <span style="margin-left: 15px; margin-bottom:10px" v-for="error in errors" class=" text-danger mt-2 d-block"><i  class="fa-sharp fa-solid fa-circle-xmark mr-4" style="color: #f23636; margin-right:10px"></i>{{error}}</span>
			<h5 class="mt-4">Thumbnail</h5>
			<input type="file" id="input_image" class="form-control mb-3" @change="onFileSelected">
			
			
			<img id="preview" :src="thumbnail" alt=""
				class="img-fluid" style="border-radius: 0.8%;">
			
			
			<br>
			<br>
			<h5 class="inline pb-2 form-title">Title</h5>
			<input type="text" class="form-control form-control-lg" id="title" placeholder="Title" v-model='title'>
			<h5 class="inline pb-2 form-title">Slug</h5>
			<input type="text" class="form-control form-control-lg" id="title" placeholder="slug" v-model='slug'>
			<h5 class="form-title mt-3">Content </h5>
			<textarea class="mb-3 form-control form-control-lg" placeholder="Write Post here ..." rows="3" style="width:100%;" v-model='content'></textarea>

		</form>


	</div>
	</div>
</div>
      `,

  data() {
    return {
      title: '',
      content: '',
      slug: '',
      thumbnail: '',
      selectedFile: null,
      errors: []
    }
  },

  methods: {
    onFileSelected(event) {
      this.selectedFile = event.target.files[0]
      this.thumbnail = URL.createObjectURL(this.selectedFile)
    },
    checkForm: function (e) {
      e.preventDefault();
      this.errors = [];
      if (this.title === '') {
        this.errors.push('title required.');
      }
      if (this.slug === '') {
        this.errors.push('slug required.');
      }
      if (this.content === '') {
        this.errors.push('content required.');
      }
      if (this.errors.length == 0) {
        if (this.$router.history.current.path.split('/')[1] === 'add_post') {
          console.log("adding...")
          const fd = new FormData();
          if (this.selectedFile != null) {
            fd.append('thumbnail', this.selectedFile)
          }
          fd.append('title', this.title)
          fd.append('slug', this.slug)
          fd.append('content', this.content)

          console.log(this.title, "title", this.slug)
          fetch('/add-post', {
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
              this.goto('/feed')
            })
        }else{
          console.log("editing...")
          const fd = new FormData();
          if (this.selectedFile != null) {
            fd.append('thumbnail', this.selectedFile)
          }
          fd.append('title', this.title)
          fd.append('slug', this.slug)
          fd.append('content', this.content)

          console.log(this.title, "title", this.slug)
          fetch(`/edit-post/${this.$router.history.current.path.split("/")[2]}`, {
            method: 'POST',
            body: fd,
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token") ? sessionStorage.getItem("access_token") : localStorage.getItem("access_token")}`,
            }
          })
            .then(r => r.json())
            .then(data => {
              console.log(data)
              this.goto(`/post/${this.$router.history.current.path.split("/")[2]}`)
            })
        }
      }
    },
    goto(url) {
      this.$router.push(url).catch(() => { })
    },

  },
  async mounted() {
    if (this.$router.history.current.path.split("/")[1] === "edit_post") {

      const res = await fetch(`/api/post/${this.$router.history.current.path.split("/")[2]}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem("access_token") ? sessionStorage.getItem("access_token") : localStorage.getItem("access_token")}`, 'Content-Type': 'application/json'
        },
      })
      if (res.status === 200) {
        let jsonData = await res.json();
        
        this.title = jsonData.title;
        this.slug = jsonData.slug;
        this.content = jsonData.content;
        this.thumbnail = jsonData.thumbnail;

      } else if (res.status === 400) {
        let errorResponse = await res.json();
        console.error(errorResponse.error);
      }

    }else{
      this.thumbnail='/static/images/default_thumbnail.jpg'
    }
  }
}







