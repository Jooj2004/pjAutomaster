const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mainRouter = require('./routes/main')
const reminderJob = require('./jobs/reminderJob')

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(mainRouter)

// Iniciar job de lembretes
reminderJob()

// Rota raiz para verificação
app.get('/', (req, res) => {
  res.send('API do PJ Automaster está rodando! 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor de agenda rodando em http://localhost:${PORT}`)
})