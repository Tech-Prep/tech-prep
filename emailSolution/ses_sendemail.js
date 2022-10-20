exports.handler = async (event) => {
    console.log('LOG NUMBER 1', event);

    const AWS = require('aws-sdk');
    AWS.config.update({region: 'us-east-2'});
    
    // let params = {
    //     Destination: {
    //         ToAddresses: ['Jack011601@gmail.com']
    //     },
    //     Message: {
    //         Body: {
    //             Text: {
    //                 Charset: 'UTF-8',
    //                 Data: 'Test email'
    //             }
    //         }
    //     },
    //     Source: 'Jack011601@gmail.com',
    // };
    
    let sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
    
    sendPromise
        .then(data => console.log('JACKS LOG---------------------', data.MessageId))
        .catch(err => console.error(err, err.stack));
    
    
    
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
