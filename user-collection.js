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
    this.firstPage = !cursor
  }

  generateCursor(userPointer) {
    const { reputation, id } = userPointer
    return [reputation, id, this.timestamp]
  }

  async popularUsersForward(count = 10) {
    const users = await this.db.all(
      `
      select * from popular_users_forward
      where (reputation, id) < (?, ?)
      and created_at < ?
      and (deleted_at is null or deleted_at > ?)
      limit ?
      `,
      this.reputation,
      this.id,
      this.timestamp,
      this.timestamp,
      count + 1
    )

    const hasNextPage = users.length > count
    if (hasNextPage) users.splice(users.length - 1, 1)

    return {
      afterCursor: hasNextPage && this.generateCursor(users[users.length - 1]),
      beforeCursor: !this.firstPage && this.generateCursor(users[0]),
      users,
    }
  }

  async popularUsersBackward(count = 10) {
    const users = await this.db.all(
      `
      select * from popular_users_backward
      where (reputation, id) > (?, ?)
      and created_at < ?
      and (deleted_at is null or deleted_at > ?)
      limit ?
      `,
      this.reputation,
      this.id,
      this.timestamp,
      this.timestamp,
      count + 1
    )

    const hasNextPage = users.length > count
    if (hasNextPage) users.splice(users.length - 1, 1)
    users.reverse()

    return {
      beforeCursor: hasNextPage && this.generateCursor(users[0]),
      afterCursor: users.length && this.generateCursor(users[users.length - 1]),
      users,
    }
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
