const moment = require('moment')

class UserCollection {
  constructor(db, cursor) {
    this.db = db
    const [reputation, id, timestamp] = cursor || [
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      moment().toISOString(),
    ]
    this.reputation = reputation
    this.id = id
    this.timestamp = timestamp
  }

  async popularUsersForward(count = 10) {
    const users = await this.db.all(
      `
      select * from popular_users_forward
      where (reputation, id) < (?, ?)
      and created_at < ?
      and (deleted_at is null or deleted_at > ?)
      limit ?`,
      this.reputation,
      this.id,
      this.timestamp,
      this.timestamp,
      count + 1
    )

    const hasNextPage = users.length > count
    if (hasNextPage) users.splice(users.length - 1, 1)
    return { hasNextPage, users }
  }

  async popularUsersBackward(count = 10) {
    const users = await this.db.all(
      `
      select * from popular_users_backward
      where (reputation, id) > (?, ?)
      and created_at < ?
      and (deleted_at is null or deleted_at > ?)
      limit ?`,
      this.reputation,
      this.id,
      this.timestamp,
      this.timestamp,
      count + 1
    )

    const hasNextPage = users.length > count
    if (hasNextPage) users.splice(users.length - 1, 1)
    users.reverse()
    return { hasNextPage, users }
  }

  async isCollectionStale() {
    const result = await db.get(
      'select id from users where created_at > ? or deleted_at > ? limit 1',
      this.timestamp,
      this.timestamp
    )
    return !!result
  }
}

module.exports = UserCollection
