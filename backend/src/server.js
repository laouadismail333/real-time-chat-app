// const express = require('express')
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import { connectDB } from '../src/lib/db.js'
import authRoute from './routes/auth.route.js'
import messageRoute from './routes/message.route.js'
import cors from 'cors'
import { app,server } from './lib/socket.js'

dotenv.config()


const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use(cors(
  {
    origin: 'http://localhost:5173',
    credentials: true,
  }
))

app.use('/api/auth', authRoute)
app.use('/api/messages', messageRoute)

server.listen(3000, () => {
  console.log(`Server runs on PORT: ${PORT}`);
  connectDB()
})