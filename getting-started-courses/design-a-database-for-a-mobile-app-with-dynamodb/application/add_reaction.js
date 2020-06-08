const AWS = require('aws-sdk')

AWS.config.update({ region: 'ap-northeast-1' })

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

const REACTING_USER = 'kennedyheather'
const REACTION_TYPE = 'sunglasses'
const PHOTO_USER = 'ppierce'
const PHOTO_TIMESTAMP = '2019-04-14T08:09:34'

async function add_reaction_to_photo (reacting_user, reaction_type, photo_user, photo_timestamp) {
  const reaction = `REACTION#${reacting_user}#${reaction_type}`
  const photo = `PHOTO#${photo_user}#${photo_timestamp}`
  const user = `USER#${photo_user}`

  const res = await new Promise((resolve, reject) => {
    ddb.transactWriteItems({
      TransactItems: [
        {
          Put: {
            TableName: 'quick-photos',
            Item: {
              'PK': { 'S': reaction },
              'SK': { 'S': photo },
              'reactingUser': { 'S': reacting_user },
              'reactionType': { 'S': reaction_type },
              'photo': { 'S': photo },
              'timestamp': { 'S': new Date().toISOString() }
            },
            ConditionExpression: 'attribute_not_exists(SK)',
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
          }
        },
        {
          Update: {
            TableName: 'quick-photos',
            Key: { 'PK': { 'S': user }, 'SK': { 'S': photo } },
            UpdateExpression: 'SET reactions.#t = reactions.#t + :i',
            ExpressionAttributeNames: {
              '#t': reaction_type
            },
            ExpressionAttributeValues: {
              ':i': { 'N': '1' }
            },
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
  try {
    const result = await add_reaction_to_photo(REACTING_USER, REACTION_TYPE, PHOTO_USER, PHOTO_TIMESTAMP)

    console.log(result)
  } catch (err) {
    console.error('Could not add reaction to photo')
  }
}

execute()
