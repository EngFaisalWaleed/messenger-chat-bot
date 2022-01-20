const processPostback = require('../processes/postback');
const processMessage = require('../processes/messages');

module.exports = function(app, chalk){
  app.get('/webhook', function(req, res) {
     console.log('req.query', req.query['hub.verify_token']);
     console.log('hub.verify_token', req.query['hub.verify_token']);
     console.log('process.env.VERIFY_TOKEN', process.env.VERIFY_TOKEN);
    if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN){
       res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error('verification failed. Token mismatch.');
        res.sendStatus(403);
     }
  });
  
  app.post('/webhook', function(req, res) {
    //checking for page subscription.
    if (req.body.object === 'page'){
       
       /* Iterate over each entry, there can be multiple entries 
       if callbacks are batched. */
       req.body.entry.forEach(function(entry) {
       // Iterate over each messaging event
          entry.messaging.forEach(function(event) {
          console.log(event);
          if (event.postback){
             processPostback(event);
          } else if (event.message){
             processMessage(event);
          }
      });
    });
    res.sendStatus(200);
   }
  });
}