const moment = require('moment')
const { encode, decode } = require('base64-url')

const encodeCursor = array => {
  // convert date-time to unix timestamp
  const clone = [...array]
  const dt = clone.pop()
  clone.push(moment(dt).format('X'))

  // return base64 string
  return encode(clone.join(','))
}

const decodeCursor = str => {
  // convert unix timestamp to ISO date time
  const array = decode(str).split(',')
  const clone = [...array]
  const ts = clone.pop()
  clone.push(moment(ts, 'X').toISOString())

  // return cursor array
  return clone
}

module.exports = {
  encodeCursor,
  decodeCursor,
}
