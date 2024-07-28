import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import "dotenv/config"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
// app config
const app = express()
const port = 4000

// middleware => request is parsed
app.use(express.json())
// using this we can access backend from frontend
// This function is from the cors package, a middleware for Express that allows the server to handle requests from different origins.
app.use(cors())

// db connection
connectDB();

// api endpoints
app.use("/api/food",foodRouter)
app.use("/image",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req, res)=>{

    res.send("API working")
})

// running the express server
app.listen(port,()=>{
    console.log(`server started on http://localhost:${port}`)
})
