import 'dotenv/config'

import connectDB from "./db/mongoose.connect.js"
import app from "./app.js"

const port = process.env.PORT;
connectDB().then(()=>{
    app.listen(port,()=>{
        console.log(`Server started at http://localhost:${port}`)
    })
}).catch((error)=>{
    console.log("Error in connecting", error.message)
})

