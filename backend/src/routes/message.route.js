import express from 'express'
// import { signup, login, logout, updateProfile } from '../controllers/auth.controller.js'



const router = express.Router()


router.get('/message',(req,res)=>{
  res.send(`Hello from message`)
})


export default router