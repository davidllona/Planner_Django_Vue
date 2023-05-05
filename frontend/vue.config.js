module.exports = {
  publicPath: '/',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // La dirección donde se encuentra el proyecto de Django
        changeOrigin: true
      }
    }
  }
}

