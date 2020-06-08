const { readFileSync } = require('fs')
const AWS = require('aws-sdk')

const { resolveAttributeItem } = require('./utils')

AWS.config.update({ region: 'ap-northeast-1' })

const BATCH_LIMIT = 25

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

const items = readFileSync('./scripts/items.json')
  .toString('utf-8')
  .split('\n')
  .map(text => text && JSON.parse(text))
  .filter(notEmpty => notEmpty)

for (let i = 0, len = items.length; i < len; i += BATCH_LIMIT) {
  ddb.batchWriteItem({
    RequestItems: {
      'quick-photos': items.slice(i, i + BATCH_LIMIT).map((item) => {
        return {
          PutRequest: {
            Item: resolveAttributeItem(item)
          }
        }
      })
    },
    ReturnConsumedCapacity: 'TOTAL'
  }, (err, data) => {
    if (err) {
      console.error('Could not bulk load table, Error:', err)
      return
    }
    console.log('Table loaded successfully.', data)
  })
}
