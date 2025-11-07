const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mainRouter = require('./routes/main')

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(mainRouter)

app.listen(PORT, () => {
  console.log(`Servidor de agenda rodando em http://localhost:${PORT}`)
})