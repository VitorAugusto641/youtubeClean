const API_KEY = 'AIzaSyATXwk6P56Jw-W6TUsyn7lIZ5GQMd2tv9I'

async function buscarVideos(query) {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${API_KEY}`
  )
  const data = await res.json()
  return data.items
}