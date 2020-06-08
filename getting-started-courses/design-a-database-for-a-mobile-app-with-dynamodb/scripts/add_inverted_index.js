const AWS = require('aws-sdk')

AWS.config.update({ region: 'ap-northeast-1' })

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

ddb.updateTable({
  TableName: 'quick-photos',
  AttributeDefinitions: [
    {
      AttributeName: 'PK',
      AttributeType: 'S'
    }, {
      AttributeName: 'SK',
      AttributeType: 'S'
    }
  ],
  GlobalSecondaryIndexUpdates: [
    {
      Create: {
        IndexName: 'InvertedIndex',
        KeySchema: [
          {
            AttributeName: 'SK',
            KeyType: 'HASH'
          }, {
            AttributeName: 'PK',
            KeyType: 'RANGE'
          }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }
    }
  ]
}, (err, data) => {
  if (err) {
    console.error('Could not update table, Error:', err)
    return
  }
  console.log('Table updated successfully.', data)
})
