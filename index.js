const createApp = require('./app')

createApp().then(app =>
  app.listen(3000, () => console.log('Running at http://localhost:3000/'))
)
