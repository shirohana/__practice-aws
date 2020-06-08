const AWS = require('aws-sdk')

const { Friendship } = require('../application/entities')

AWS.config.update({ region: 'ap-northeast-1' })

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

const USERNAME = 'haroldwatkins'

async function find_following_for_user (username) {
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

  return res.Items.map(data => new Friendship(data))
}

async function execute () {
  const follows = await find_following_for_user(USERNAME)

  console.log(follows)
}

execute()
