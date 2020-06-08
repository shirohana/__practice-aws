const AWS = require('aws-sdk')

AWS.config.update({ region: 'ap-northeast-1' })

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

ddb.deleteTable({
  TableName: 'quick-photos'
}, (err, data) => {
  if (err) {
    console.error('Error', err)
    return
  }
  console.log('Deleted', data)
})
