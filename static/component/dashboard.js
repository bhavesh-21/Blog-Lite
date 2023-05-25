export default {
    template: `<div>
                            <section class="vh-91 mt-0">
                            <div class="container py-5 h-100">
                              <div class="row d-flex justify-content-center align-items-center h-100">
                                <div class="col col-xl-10">
                                  <div class="card" style="border-radius: 1rem;">
                                  <div class="row g-0">
                                  <button type="button" class="btn btn-primary" @click="csv(true)">Export My Post as CSV</button>
                                  <button type="button" class="btn btn-primary" @click="csv(false)">Export My Feed as CSV</button>
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

        }
    },

    methods: {
        csv(me) {

            fetch(`/trigger-celery-job?me=${me}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem("access_token") ? sessionStorage.getItem("access_token") : localStorage.getItem("access_token")}`, 'Content-Type': 'application/json'
                    },
                }
            ).then(r => r.json()
                    ).then(d => {
                        console.log("Celery Task Details:", d);
                        let interval = setInterval(() => {
                            fetch(`/status/${d.Task_ID}`).then(r => r.json()
                            ).then(d => {
                                if (d.Task_State === "SUCCESS") {
                                    console.log("task finished")
                                    clearInterval(interval);
                                    window.location.href = "/download-csv";
                                }
                                else {
                                    console.log("task still executing")
                                }
                            })
                        }, 5000)
                    })
        },

    

    },
    mounted() {
    }
}
