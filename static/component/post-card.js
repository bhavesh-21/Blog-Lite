
export default {
    template: ` 
    <div>
           

            
    

    </div>   
              
        `,

    data: function () {
        return {
        }
    },

    methods: {
        goto(url) {
            this.$router.push(url).catch(() => { });
        },
        time(t) {
            const x = moment(t).fromNow()
            return x;
        },
    }
}