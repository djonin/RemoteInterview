import AppDispatcher from '../dispatcher/dispatcher.js';
import EventEmitter from 'events';

var products = [];
var shoppingBag = {
  products:[],
  quantities:{}
};

var sendBag = function() {
  $.ajax({
    url: hostname+'/api/bag',
    type: 'POST',
    data: JSON.stringify({ shoppingBag: shoppingBag}),
    contentType: 'application/json',
    headers: {"Access-Control-Allow-Origin": '*'},
    success: function(data) {
    },
    error: function(err) {
      console.error('Error sending bag products:', err);
    },
    complete: function() {
    }
	});
}

var addToBag = function(product) {
  if(shoppingBag.quantities[product.name]) {
    shoppingBag.quantities[product.name]++;
  } else {
    shoppingBag.products.push(product);
    shoppingBag.quantities[product.name] = 1;
  }
  sendBag();
}

var removeFromBag = function(product) {
  if(shoppingBag.quantities[product.name] > 1) {
    shoppingBag.quantities[product.name]--;
  } else {
    delete shoppingBag.quantities[product.name];
    var index = shoppingBag.products.indexOf(product);
  	if(index > -1) {
  		shoppingBag.products.splice(index, 1);
  	}
  }
  sendBag();
}

var updateProducts = function() {
  $.ajax({
     url: hostname+'/api/products',
     type: 'GET',
     contentType: 'application/json',
     headers: {"Access-Control-Allow-Origin" : "*"},
     success: function(data) {
       data = JSON.parse(data);
       //check if it's an array
       if(data.length) {
         products = data;
       }
     },
     error: function(err) {
       console.error('Error loading products:', err);
     },
     complete: function() {
     }
   });
}

var updateBagProducts = function() {
  $.ajax({
       url: hostname+'/api/bag',
       type: 'GET',
       contentType: 'application/json',
       headers: {"Access-Control-Allow-Origin" : "*"},
       success: function(data) {
         data = JSON.parse(data);
         //check format
         if(data.products.length && data.quantities) {
           shoppingBag = data;
         }
       },
       error: function(err) {
         console.error('Error loading bag products:', err);
       },
       complete: function() {
       }
   });
}

class ShoppingStore extends EventEmitter {

	getProducts() {
		return products;
	}

	getBagProducts() {
    for(var i; i<shoppingBag.products.length; i++) {
      shoppingBag.products[i].quantity = shoppingBag.quantities[shoppingBag.products[i].name];
    }
		return shoppingBag.products;
	}

	emitChange() {
		this.emit('change');
	}

	addChangeListener(callback) {
		this.on('change', callback);
	}

	removeChangeListener(callback) {
		this.removeListener('change', callback);
	}

}

var shoppingStore = new ShoppingStore();

//stub login
//login shouldnt be on the api or in the store but this is just a stub
$.ajax({
  url: hostname+'/api/stublogin',
  type: 'POST',
  data: JSON.stringify({username: "spiderguy"}),
  contentType: 'application/json',
  headers: {"Access-Control-Allow-Origin": '*'},
  success: function(data) {
  },
  error: function(err) {
    console.error('Error logging in', err);
  },
  complete: function() {
  }
});


updateProducts();
updateBagProducts();

export default shoppingStore;

AppDispatcher.register(function(action) {
	switch(action.actionType) {
		case 'addToBag' :
			addToBag(action.product);
			shoppingStore.emitChange();
			break;
		case 'removeFromBag' :
			removeFromBag(action.product);
			shoppingStore.emitChange();
			break;
	}
});
