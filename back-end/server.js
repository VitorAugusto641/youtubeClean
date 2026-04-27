const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// Domínios permitidos (sua app no Netlify)
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim())

app.use(cors({
  origin: (origin, callback) => {
    // Permite se origin for de um domínio permitido OU se não houver origin (ex: testes locais via curl)
    if (!origin || ALLOWED_ORIGINS.some(allowed => origin.includes(allowed))) {
      callback(null, true)
    } else {
      callback(new Error('Origem não permitida: ' + origin))
    }
  }
}))

// Middleware de proteção dupla: origin + app-key
function protect(req, res, next) {
  const origin = req.headers.origin || ''
  const appKey = req.headers['x-app-key']

  const originOk = !origin || ALLOWED_ORIGINS.some(allowed => origin.includes(allowed))
  const keyOk = appKey === process.env.APP_KEY

  if (!originOk || !keyOk) {
    return res.status(403).json({ error: 'Acesso negado.' })
  }

  next()
}

// Rota de busca de vídeos
app.get('/api/videos', protect, async (req, res) => {
  const { q, maxResults = 8 } = req.query

  if (!q) {
    return res.status(400).json({ error: 'Parâmetro "q" é obrigatório.' })
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q)}&type=video&maxResults=${maxResults}&key=${process.env.YOUTUBE_API_KEY}`
    const response = await fetch(url)
    const data = await response.json()

    if (data.error) {
      return res.status(500).json({ error: data.error.message })
    }

    res.json(data.items)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar vídeos.' })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
