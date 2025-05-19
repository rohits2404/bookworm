import cron from "cron";
import https from "https"

const job = new cron.CronJob("*/14 * * * *",function () {
    https.get(process.env.API_URL,(res) => {
        if(res.statusCode === 200) console.log("GET Request Sent Successfully!")
        else console.log("Get Request Failed!",res.statusCode);
    }).on("error",(e)=>console.error("Error While Sending Request!",e))
})

export default job;