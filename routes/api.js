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
    id : "LN332",
    price: 32
  },
  {
    name : "Deco Delight Bra",
    id : "FY158",
    price: 34
  },
  {
    name : "Sienna Bra",
    id : "FY158",
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
  console.log('asdsad');
  req.session.regenerate(function() {
    //doesn't work for some reason
    req.session.cookie.user = encrypt(req.body.username);
    res.redirect('/');
  })
});

//post shopping bag to keep it between sessions
router.post('/bag', function(req,res) {
	var data = '';
	req.on('data', function(d) {
		data+=d;
	});

	req.on('end', function() {
		var body = JSON.parse(data);
		var bag = body.shoppingBag;
    //doesn't work for some reason
    /*
		if(req.session.cookie.user) {
			userCode = decrypt(req.session.cookie.user);
		} else {
      res.send(400, 'No login found');
    }*/
    userCode = "spiderguy"
		if(bag.products.length && bag.quantities) {
			bagStorage[userCode] = bag;
		} else {
      res.send(400, 'Incorrect shopping bag format');
    }
    res.send(200);
	})
});

//check out what is in your bag
router.get('/bag', function(req, res) {
console.log(req.session);
  //doesn't work for some reason
  /*
  if(req.session.cookie.user) {
    userCode = decrypt(req.session.cookie.user);
  } else {
    res.send(400, 'No login found');
    return;
  }*/
  userCode = "spiderguy";
  if(!bagStorage[userCode]) {
    bagStorage[userCode] = {
      products : [],
      quantities: {}
    }
  }
	res.send(200, JSON.stringify(bagStorage[userCode]));
});

//check out products list
router.get('/products', function(req, res) {
	res.send(200, JSON.stringify(productStorage));
});


module.exports = router;
