const casual = require('casual')

const insertUserLoop = (db, interval) => {
  setInterval(async () => {
    const user = {
      name: casual.full_name,
      reputation: casual.integer(1, 10),
    }
    await db.run(
      'insert into users (name, reputation) values (?, ?)',
      user.name,
      user.reputation
    )
    console.log('A new user was inserted: \x1b[32m%s\x1b[0m', user.name)
  }, interval)
}

const deleteUserLoop = (db, interval) => {
  setInterval(async () => {
    const { id, name } = await db.get(
      'SELECT * FROM users where deleted_at is null ORDER BY RANDOM() LIMIT 1'
    )
    await db.run(
      "update users set deleted_at = strftime('%Y-%m-%dT%H:%M:%S', 'now') where id = ?",
      id
    )
    console.log('A user was marked as removed: \x1b[31m%s\x1b[0m', name)
  }, interval)
}

const updateUserLoop = (db, interval) => {
  setInterval(async () => {
    const { id, name, reputation } = await db.get(
      'SELECT * FROM users where deleted_at is null ORDER BY RANDOM() LIMIT 1'
    )
    await db.run(
      `update users set deleted_at = strftime('%Y-%m-%dT%H:%M:%S', 'now')
      where id = ?`,
      id
    )
    const rep = casual.integer(1, 10)
    await db.run(
      `insert into users (name, reputation) values (?, ?)`,
      name,
      rep
    )
    console.log(
      "User's reputation was changed (%d -> %d): \x1b[33m%s\x1b[0m",
      reputation,
      rep,
      name
    )
  }, interval)
}

module.exports = {
  insertUserLoop,
  deleteUserLoop,
  updateUserLoop,
}
