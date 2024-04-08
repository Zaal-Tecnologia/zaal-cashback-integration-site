module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://1290-200-164-236-60.ngrok-free.app/api/v1/:path*', // Coloque o URL do seu backend aqui
      },
    ]
  },
}
