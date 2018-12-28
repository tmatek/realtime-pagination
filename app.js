const express = require('express')
const mustacheExpress = require('mustache-express')
const sqlite = require('sqlite')
const moment = require('moment')
const UserCollection = require('./user-collection')

const createApp = async () => {
  const app = express()
  app.engine('mst', mustacheExpress())
  app.set('view engine', 'mst')
  app.set('views', __dirname + '/views')

  // setup database
  const db = await sqlite.open('./db.sqlite')
  await db.migrate({ force: 'last' })

  app.get('/', async (req, res) => {
    const collection = new UserCollection(db)
    const { users } = await collection.popularUsersForward()

    return res.render('index.mst', {
      users: users.map(user => ({
        ...user,
        created_at: moment.utc(user.created_at).fromNow(),
      })),
    })
  })

  return app
}

module.exports = createApp
