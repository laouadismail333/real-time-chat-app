import express from 'express'
// import { signup, login, logout, updateProfile } from '../controllers/auth.controller.js'



const router = express.Router()


router.get('/signup',(req,res)=>{
  res.send(`Hello from signup`)
})
router.get('/login',(req,res)=>{
  res.send(`Hello from login`)
})
router.get('/logout',(req,res)=>{
  res.send(`Hello from logout`)
})
// router.post('/login',login)
// router.post('/logout',logout)

// router.put('/update-profile',updateProfile)

export default router