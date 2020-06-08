const AWS = require('aws-sdk')

const { User } = require('../application/entities')

AWS.config.update({ region: 'ap-northeast-1' })

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

const USERNAME = 'haroldwatkins'

async function find_and_enrich_following_for_user (username) {
  const res = await new Promise((resolve, reject) => {
    ddb.query({
      TableName: 'quick-photos',
      IndexName: 'InvertedIndex',
      KeyConditionExpression: 'SK = :sk',
      ExpressionAttributeValues: {
        ':sk': { 'S': `#FRIEND#${username}` }
      },
      ScanIndexForward: true
    }, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })

  const keys = res.Items.map(item => ({
    'PK': { 'S': `USER#${item.followedUser.S}` },
    'SK': { 'S': `#METADATA#${item.followedUser.S}` },
  }))

  const friends = await new Promise((resolve, reject) => {
    ddb.batchGetItem({
      RequestItems: {
        'quick-photos': {
          Keys: keys
        }
      }
    }, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })

  return friends.Responses['quick-photos'].map(data => new User(data))
}

async function execute () {
  const follows = await find_and_enrich_following_for_user(USERNAME)

  console.log(follows)
}

execute()
