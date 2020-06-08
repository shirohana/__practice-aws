const AWS = require('aws-sdk')

const { User, Photo } = require('../application/entities')

AWS.config.update({ region: 'ap-northeast-1' })

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

const USER = 'jacksonjason'

async function fetch_user_and_photos (username) {
  const res = await new Promise((resolve, reject) => {
    ddb.query({
      TableName: 'quick-photos',
      KeyConditionExpression: 'PK = :pk AND SK BETWEEN :metadata AND :photos',
      ExpressionAttributeValues: {
        ':pk': { 'S': `USER#${username}` },
        ':metadata': { 'S': `#METADATA#${username}` },
        ':photos': { 'S': 'PHOTO$' }
      },
      ScanIndexForward: true
    }, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })

  return {
    user: new User(res.Items[0]),
    photos: res.Items.slice(1).map(data => new Photo(data))
  }
}

async function execute () {
  const { user, photos } = await fetch_user_and_photos(USER)

  console.log(user)
  console.log(photos)
}

execute()
