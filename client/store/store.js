import AppDispatcher from '../dispatcher/dispatcher.js';
import EventEmitter from 'events';

var products = [];
var shoppingBag = [];

var productsCached = false;
var bagCached = false;

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

var findInBag = function(productId) {
  for (var i = 0; i<shoppingBag.length; i++) {
    if(shoppingBag[i].id == productId) {
      return shoppingBag[i];
    }
  }
  return null;
}

var addToBag = function(product) {
  var bagProduct = findInBag(product.id);
  if(bagProduct !== null) {
    bagProduct.quantity++;
  } else {
    //deep copy a product from products list
    var newProduct = jQuery.extend(true, {}, product);
    newProduct.quantity = 1;
    shoppingBag.push(newProduct);
  }
  sendBag();
}

var removeFromBag = function(product) {
  var bagProduct = findInBag(product.id);
  if(bagProduct !== null) {
    if(bagProduct.quantity > 1) {
      bagProduct.quantity--;
    } else {
      var index = shoppingBag.indexOf(bagProduct);
    	shoppingBag.splice(index, 1);
    }
  }
  sendBag();
}

var updateProducts = function() {
  var promise = new Promise(function (resolve, reject) {
    $.ajax({
       url: hostname+'/api/products',
       type: 'GET',
       contentType: 'application/json',
       headers: {"Access-Control-Allow-Origin" : "*"},
       success: function(data) {
         data = JSON.parse(data);
         //check if it's an array
         if(data.length !== undefined) {
           products = data;
           resolve(products);
         } else {
           console.error('Invalid products received');
           reject('Invalid products received');
         }
       },
       error: function(err) {
         console.error('Error loading products:', err);
         reject('Error loading products:');
       },
       complete: function() {
       }
     });
   })
   return promise;
}

var updateBagProducts = function() {
  var promise = new Promise(function (resolve, reject) {
    $.ajax({
         url: hostname+'/api/bag',
         type: 'GET',
         contentType: 'application/json',
         headers: {"Access-Control-Allow-Origin" : "*"},
         success: function(data) {
           data = JSON.parse(data);
           //check format
           if(data.length !== undefined) {
             shoppingBag = data;
             resolve(shoppingBag);
           } else {
             console.error('Invalid bag products received');
             reject('Invalid bag products received');
           }
         },
         error: function(err) {
           console.error('Error loading bag products:', err);
           reject('Invalid bag products received');
         }
     });
   })
   return promise;
}

class ShoppingStore extends EventEmitter {

	getProducts(update) {
    if(update) {
      return updateProducts();
    } else {
      return products;
    }
  }

	getBagProducts(update) {
    if(update) {
      return updateBagProducts();
    } else {
      return shoppingBag;
    }
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
