var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';

var productStorage = [
  {
    name : "Isla Bra",
    id : "LN332",
    price: 29
  },
  {
    name : "Nordic Rose Bra",
    id : "LN336",
    price: 30
  },
  {
    name : "Zentangle Bra",
    id : "FY240",
    price: 34
  },
  {
    name : "Clara Bra",
    id : "temp_id1",
    price: 32
  },
  {
    name : "Deco Delight Bra",
    id : "FY158",
    price: 34
  },
  {
    name : "Sienna Bra",
    id : "temp_id2",
    price: 32
  }
];
var bagStorage = {};
var password = "bobandalice";

//methods for encrypting user password, session token and other sensisitve info before sending or storing it
function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

//stub login
//login shouldnt be on the api but this is just a stub
router.post('/stublogin', function(req, res) {
  req.session.regenerate(function() {
    req.session.user = encrypt(req.body.username);
    res.status(200).send();
    console.log('Logged in '+req.body.username);
  })
});

//post shopping bag to keep it between sessions
router.post('/bag', function(req,res) {
  if(req.session.user) {
    userCode = decrypt(req.session.user);
  } else {
    res.status(400).send('No login found');
    return;
  }
	var bag = req.body.shoppingBag;
	if(bag.length !== undefined) {
		bagStorage[userCode] = bag;
    console.log('post bag', bagStorage);
	} else {
    res.status(400, 'Incorrect shopping bag format').send();
  }
  res.status(200).send();
});

//check out what is in your bag
router.get('/bag', function(req, res) {
  if(req.session.user) {
    userCode = decrypt(req.session.user);
  } else {
    res.send(400, 'No login found');
    return;
  }
  console.log('get bag ', bagStorage[userCode]);
  if(!bagStorage[userCode]) {
    bagStorage[userCode] = [];
  }
	res.status(200).send(JSON.stringify(bagStorage[userCode]));
});

//check out products list
router.get('/products', function(req, res) {
	res.status(200).send(JSON.stringify(productStorage));
});


module.exports = router;
