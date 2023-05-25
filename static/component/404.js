export default {
    template: `
    <div class="container" style="text-align: center; margin-top: 180px;">
    <div class="_404">404</div>
    <h2>Blog not found</h2>
    <p>The Blog you are trying to read either doesn't exit or is deleted by user.</p>
    <button type="button" class="btn btn-dark hand"  @click="goto('/')">Go Home</button>
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