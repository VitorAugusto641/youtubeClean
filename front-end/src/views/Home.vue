<template>
  <div class="container">
    <h1>Busca YouTube</h1>

    <div class="search-box">
      <input
        v-model="query"
        @keyup.enter="buscar"
        placeholder="Digite algo..."
      />
      <button @click="buscar" :disabled="carregando">
        {{ carregando ? 'Buscando...' : 'Buscar' }}
      </button>
    </div>

    <p v-if="erro" class="erro">{{ erro }}</p>

    <div class="videos">
      <div v-for="video in videos" :key="video.id.videoId" class="video-card">
        <iframe
          :src="`https://www.youtube-nocookie.com/embed/${video.id.videoId}?rel=0&modestbranding=1`"
          allowfullscreen
        ></iframe>
        <h3>{{ video.snippet.title }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
// URL do seu backend hospedado (Railway, Render, etc.)
// Troque pela URL real após hospedar
const BACKEND_URL = process.env.VUE_APP_BACKEND_URL || 'http://localhost:3000'
const APP_KEY = process.env.VUE_APP_KEY || ''

export default {
  name: 'App',
  data() {
    return {
      query: '',
      videos: [],
      carregando: false,
      erro: null
    }
  },
  methods: {
    async buscar() {
      if (!this.query.trim()) return
  console.log('BACKEND_URL:', BACKEND_URL)
  console.log('APP_KEY:', APP_KEY)
      this.carregando = true
      this.erro = null
      this.videos = []

      try {
        const res = await fetch(
          `${BACKEND_URL}/api/videos?q=${encodeURIComponent(this.query)}&maxResults=8`,
          {
            headers: {
              'x-app-key': APP_KEY
            }
          }
        )

        if (!res.ok) {
          throw new Error(`Erro ${res.status}: acesso negado ou servidor indisponível.`)
        }

        const data = await res.json()
        this.videos = data
      } catch (err) {
        this.erro = err.message || 'Erro ao buscar vídeos.'
      } finally {
        this.carregando = false
      }
    }
  }
}
</script>

<style>
.container {
  max-width: 900px;
  margin: auto;
  font-family: Arial;
}

.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 10px;
}

button {
  padding: 10px 20px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.erro {
  color: red;
  margin-bottom: 10px;
}

.videos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.video-card iframe {
  width: 100%;
  height: 150px;
}
</style>
