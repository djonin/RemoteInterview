import React from 'react';
import ReactDOM from 'react-dom';
import ShoppingStore  from './store/store.js';
import ShoppingActions from './actions/actions.js';
import { Router, Route, Link, browserHistory } from 'react-router'

//Es6 is inconvenient with react for now since you have to explicitly bind every method to this.
//Have to wait until es7 to use arrows.
//Meanwhile using the old createClass syntax.

var App = React.createClass ({

  //For simplicity, keep the entire state in App class for now.
  //React will update DOM as needed from virtual DOM changes anyway.
  getInitialState: function() {
    return { products: ShoppingStore.getProducts(),  bagProducts: ShoppingStore.getBagProducts() };
  },

  componentWillMount: function() {
    //load the data from server
    var productsPromise = ShoppingStore.getProducts(true);
    var bagProductsPromise = ShoppingStore.getBagProducts(true);
    var that = this;
    Promise.all([productsPromise, bagProductsPromise]).then(function(res) {
      that.setState({products : res[0], bagProducts: res[1]});
    });
  },

  componentDidMount: function() {
		ShoppingStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		ShoppingStore.removeChangeListener(this._onChange);
	},

	_onChange: function() {
    //re-render virtual DOM
		this.setState({ products: ShoppingStore.getProducts(),  bagProducts: ShoppingStore.getBagProducts() });
	},

  render: function() {
    return (
      <div>
        <h1 className='title'>Remote interview application</h1>
        <ShoppingBag products={this.state.bagProducts}/>
        <ProductsList products={this.state.products}/>
      </div>
    )
  }
});

var BagProduct = React.createClass ({

	clickEvent: function() {
		ShoppingActions.removeFromBag(this.props.product);
	},

	render: function() {
		return (
      <li className="list-group-item" onClick={this.clickEvent}>
        <h4 className="productName">
          {this.props.product.name}
        </h4>
        <span className="productId">
          ({this.props.product.id})
        </span>
        <span className="productPrice">
          price:£{this.props.product.price}
        </span>
        <span className="productQty">
          qty:{this.props.product.quantity}
        </span>
      </li>
    );
	}
});

var ShoppingBag = React.createClass ({

	render: function() {
		var elems = [];
		var products = this.props.products;
    if(products && products.length) {
  		for (var i = 0; i < products.length; i++) {
  			elems.push(<BagProduct key={i} product={products[i]} />);
  		}
    }
		return  (
      //use affix to make shopping bag sticky
      <div data-spy='affix' id='shoppingBag'>
        <h3>Shopping bag</h3>
        <ul className='list-group'>
          {elems}
        </ul>
      </div>
    );
	}

});


var Product = React.createClass ({

  //add to bag on click
	clickEvent: function(evt) {
		ShoppingActions.addToBag(this.props.product);
	},

	render: function() {
		return (
      <li className="productEntry list-group-item" onClick={this.clickEvent}>
        <h4 className="productName">
          {this.props.product.name}
        </h4>
        <span className="productId">
          ({this.props.product.id})
        </span>
        <span className="productPrice">
          £{this.props.product.price}
        </span>
      </li>
    );
	}
});

var ProductsList = React.createClass ({

  render: function() {
    var elems = [];
    var products = this.props.products;
    if(products && products.length) {
      for (var i = 0; i < products.length; i++) {
        elems.push(<Product key={i} product={products[i]} />);
      }
    }
    return (
      <div id='products'>
        <h3>Products</h3>
        <ul className='list-group'>
          {elems}
        </ul>
      </div>
    );
  }
});

ReactDOM.render (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
    </Route>
  </Router>,
  document.getElementById('reactContainer')
);
