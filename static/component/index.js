export default {
    template: `
<div class="container">
   
      <hr class="featurette-divider lh-3">

      <div class="row featurette">
        <div class="col-md-7">
          <h2 class="featurette-heading">Write Blogs And Express Your Thoughts</h2>
          <p class="lead">Share information about a given topic and become an expert in an industry.connect with like-minded people, and also share your thinking about certain issues. </p>
          <br><br>
          <h2 class="featurette-heading"><span class="text-muted">Get Started Now</span></h2>
          
          <a @click="goto('/register')" class="btn btn-secondary my-2 hand btn-lg">Join Now</a>
        </div>
        <div class="col-md-5">
          <img class="featurette-image img-fluid mx-auto" data-src="holder.js/500x500/auto" alt="500x500" style="width: 500px; height: 500px;" src="/static/images/1.png" data-holder-rendered="true">
        </div>
      </div>

      <hr class="featurette-divider">

      <div class="row featurette">
        <div class="col-md-7 order-md-2">
          <h2 class="featurette-heading">Write comments and get to know others.<span class="text-muted">Feature</span></h2>
          <p class="lead">Write Comments and Delete.</p>
        </div>
        <div class="col-md-5 order-md-1">
          <img class="featurette-image img-fluid mx-auto" data-src="holder.js/500x500/auto" alt="500x500" style="width: 500px; height: 500px;" src="/static/images/2.png" data-holder-rendered="true">
        </div>
      </div>

      <hr class="featurette-divider">

      <div class="row featurette">
        <div class="col-md-7">
          <h2 class="featurette-heading">Like Comments <span class="text-muted"> Feature</span></h2>
          <p class="lead">Like Blog Post and encourage writer to write more posts</p>
        </div>
        <div class="col-md-5">
          <img class="featurette-image img-fluid mx-auto" data-src="holder.js/500x500/auto" alt="500x500" style="width: 500px; height: 500px;" src="/static/images/3.png" data-holder-rendered="true">
        </div>
      </div>

      <hr class="featurette-divider">
      
      <div class="row featurette">
        <div class="col-md-7 order-md-2">
          <h2 class="featurette-heading">Oh yeah, it's that good. <span class="text-muted">See for yourself.</span></h2>
          <p class="lead">CK Editor with advanced styling features to write Blog Posts.</p>
        </div>
        <div class="col-md-5 order-md-1">
          <img class="featurette-image img-fluid mx-auto" data-src="holder.js/500x500/auto" alt="500x500" style="width: 500px; height: 500px;" src="/static/images/4.png" data-holder-rendered="true">
        </div>
      </div>

      <hr class="featurette-divider">

    


    <!-- FOOTER -->
    <footer class="container">
        <div class="container mb-3 pb-1" style="color: black;">
            <img src="/static/images/blog-black.png" width="30"
                height="30" class="d-inline-block align-top mr-3 mt-2" alt="">
            <span class="h1 fw-bold mb-0 ml-2" style="margin-left: 10px;">Blog Lite</span>
            <p style="float: right;" ><a href="#">Back to top</a></p>
        </div>
    </footer>
</div>
            
  
      `,

    data: {
    },

    methods: {
        goto(url) {
            this.$router.push(url)
          },
    }
}