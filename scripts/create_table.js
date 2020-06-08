const AWS = require('aws-sdk')

AWS.config.update({ region: 'ap-northeast-1' })

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

ddb.createTable({
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
  KeySchema: [
    {
      AttributeName: 'PK',
      KeyType: 'HASH'
    },
    {
      AttributeName: 'SK',
      KeyType: 'RANGE'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
}, (err, data) => {
  if (err) {
    console.error('Could not create table, Error:', err)
    return
  }
  console.log('Tbable created successfully.', data)
})
