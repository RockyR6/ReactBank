const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors');



const app = express()

app.use(cors({
    origin:[ 'http://localhost:5173', 'https://first-bank-liard.vercel.app' ],
    credentials: true
}));

app.use(express.json())
app.use(cookieParser())

//Routes Import
const authRouter = require('./routes/auth.routes.js')
const  accountRouter = require('./routes/account.route.js')
const transactionRouter = require('./routes/transaction.route.js') 

//use Routes

app.get('/', (req, res) => {
    res.send('Ledger Service is up and running')
})

app.use('/api/auth', authRouter)
app.use('/api/account', accountRouter)
app.use('/api/transactions', transactionRouter)
module.exports = app