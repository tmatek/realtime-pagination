const express = require('express')
const mustacheExpress = require('mustache-express')
const sqlite = require('sqlite')
const moment = require('moment')
const UserCollection = require('./user-collection')
const { encodeCursor, decodeCursor } = require('./utils')
const { insertUserLoop, deleteUserLoop, updateUserLoop } = require('./crud')

const createApp = async () => {
  const app = express()
  app.engine('mst', mustacheExpress())
  app.set('view engine', 'mst')
  app.set('views', __dirname + '/views')

  // setup database
  const db = await sqlite.open('./db.sqlite')
  await db.migrate({ force: 'last' })

  // setup random crud generators
  insertUserLoop(db, 20000)
  deleteUserLoop(db, 35000)
  updateUserLoop(db, 10000)

  app.get('/', async (req, res) => {
    const { after, before } = req.query

    const cursor = after
      ? decodeCursor(after)
      : before
      ? decodeCursor(before)
      : null

    const collection = new UserCollection(db, cursor)
    const pageSize = 5
    const { users, afterCursor, beforeCursor } = await (before
      ? collection.popularUsersBackward(pageSize)
      : collection.popularUsersForward(pageSize))

    const isStale = await collection.isCollectionStale()

    return res.render('index.mst', {
      users: users.map(user => ({
        ...user,
        created_at: moment.utc(user.created_at).fromNow(),
      })),
      after: afterCursor && encodeCursor(afterCursor),
      before: beforeCursor && encodeCursor(beforeCursor),
      isStale,
    })
  })

  return app
}

module.exports = createApp
