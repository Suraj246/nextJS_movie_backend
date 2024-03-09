import express from "express"
import dotenv from 'dotenv'
import mongoose from "mongoose"
import cors from 'cors'
import movieRoutes from "./routes/movieRoutes.js"

const port = process.env.PORT || 4000
dotenv.config({path:'./config.env'})


const app = express()
app.use('/uploads', express.static('uploads'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())


mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE)
    .then((res) => { console.log("> database connected") })
    .catch((err) => console.log("failed to connect database", err))

// Routes
app.use("/movieData",movieRoutes)

app.use((error, req, res, next) => {
  console.log("error", error.field)
})

app.get('/login', (req, res) => {
    
   res.status(200).json({loginDetails:{email:process.env.EMAIL,password:process.env.PASSWORD}})
})
app.listen(port, () => {
    console.log("server is running on " + port)
})