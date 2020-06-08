const AWS = require('aws-sdk')

const { Photo, Reaction } = require('../application/entities')

AWS.config.update({ region: 'ap-northeast-1' })

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

const USER = 'david25'
const TIMESTAMP = '2019-03-02T09:11:30'

async function fetch_photo_and_reactions (username, timestamp) {
  const res = await new Promise((resolve, reject) => {
    ddb.query({
      TableName: 'quick-photos',
      IndexName: 'InvertedIndex',
      KeyConditionExpression: 'SK = :sk AND PK BETWEEN :reactions AND :user',
      ExpressionAttributeValues: {
        ':sk': { 'S': `PHOTO#${username}#${timestamp}` },
        ':reactions': { 'S': 'REACTION#' },
        ':user': { 'S': 'USER$' }
      },
      ScanIndexForward: true
    }, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })

  const items = res.Items.reverse()

  return {
    photo: new Photo(items[0]),
    reactions: items.slice(1).map(data => new Reaction(data))
  }
}

async function execute () {
  const { photo, reactions } = await fetch_photo_and_reactions(USER, TIMESTAMP)

  console.log(photo)
  console.log(reactions)
}

execute()
