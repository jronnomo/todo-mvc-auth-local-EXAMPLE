const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
const todoRoutes = require('./routes/todos')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')

require('dotenv').config({path: './config/.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Logging
if (process.env.NODE_ENV === 'development'){
  app.use(logger('dev'))
}

// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
  
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
  
app.use('/', mainRoutes)
app.use('/todos', todoRoutes)

const PORT = process.env.PORT || 2121
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))