const express = require('express')
const mustacheExpress = require('mustache-express')

const createApp = async () => {
  const app = express()
  app.engine('mst', mustacheExpress())
  app.set('view engine', 'mst')
  app.set('views', __dirname + '/views')

  app.get('/', (req, res) => {
    return res.render('index.mst', {})
  })

  return app
}

module.exports = createApp
