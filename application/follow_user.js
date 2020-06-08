const AWS = require('aws-sdk')

AWS.config.update({ region: 'ap-northeast-1' })

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

const FOLLOWED_USER = 'tmartinez'
const FOLLOWING_USER = 'john42'

async function follow_user (followed_user, following_user) {
  const user = `USER#${followed_user}`
  const friend = `#FRIEND#${following_user}`
  const user_metadata = `#METADATA#${followed_user}`
  const friend_user = `USER#${followed_user}`
  const friend_metadata = `#METADATA#${following_user}`

  const res = await new Promise((resolve, reject) => {
    ddb.transactWriteItems({
      TransactItems: [
        {
          Put: {
            TableName: 'quick-photos',
            Item: {
              PK: { 'S': user },
              SK: { 'S': friend },
              followedUser: { 'S': followed_user },
              followingUser: { 'S': following_user },
              timestamp: { 'S': new Date().toISOString() }
            },
            ConditionExpression: 'attribute_not_exists(SK)',
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
          }
        }, {
          Update: {
            TableName: 'quick-photos',
            Key: { 'PK': { 'S': user }, 'SK': { 'S': user_metadata } },
            UpdateExpression: 'SET followers = followers + :i',
            ExpressionAttributeValues: { ':i': { 'N': '1' }},
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
          }
        }, {
          Update: {
            TableName: 'quick-photos',
            Key: { 'PK': { 'S': friend_user }, 'SK': { 'S': friend_metadata } },
            UpdateExpression: 'SET following = following + :i',
            ExpressionAttributeValues: { ':i': { 'N': '1' }},
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
          }
        }
      ]
    }, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })

  return res
}

async function execute () {
  const result = await follow_user(FOLLOWED_USER, FOLLOWING_USER)

  console.log(result)
}

execute()
