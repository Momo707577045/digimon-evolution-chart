const start_time = "2022-09-02 13:58:41"
const end_time = "2022-09-09 13:59:00"
let startTime = new Date(start_time)
let endTime = new Date(end_time)

console.log(Math.ceil((endTime - startTime) / (1000 * 24 * 60 * 60)))