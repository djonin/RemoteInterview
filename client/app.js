import React from 'react';
import ReactDOM from 'react-dom';
import ShoppingStore  from './store/store.js';
import ShoppingActions from './actions/actions.js';

//Es6 is inconvenient with react for now since you have to explicitly bind every method to this.
//Have to wait until es7 to use arrows.
//Meanwhile using the old createClass syntax.

var App = React.createClass ({

  //For simplicity, keep the entire state in App class for now.
  //React will update DOM as needed from virtual DOM changes anyway.
  getInitialState: function() {
    return { products: ShoppingStore.getProducts(),  bagProducts: ShoppingStore.getBagProducts() };
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
        <h1 className='title'>Shopping Bag</h1>
          <ShoppingBag />
          <ProductsList />
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
          {this.props.produt.name}
        </h4>
        <span className="productId">
          ({this.props.produt.id})
        </span>
        <span className="productPrice">
          £{this.props.produt.price}
        </span>
        <span className="productQty">
          {this.props.produt.quantity}
        </span>
      </li>
    );
	}
});

var ShoppingBag = React.createClass ({

	render: function() {
		var elems = [];
		var products = ShoppingStore.getBagProducts();
		for (var i = 0; i < products.length; i++) {
			elems.push(<BagProduct key={i} product={products[i]} />);
		}
		return  (
      //use affix to make shopping bag sticky
      <ul data-spy='affix' id='shoppingBag' className='list-group'>
        {elems}
      </ul>
    );
	}

});


var Product = React.createClass ({

  //add to bag on click
	onClickEvent: function(evt) {
		ShoppingActions.addToBag(this.props.product);
	},

	render: function() {
		return (
      <li className="productEntry" onClick={this.clickEvent}>
        <h4 className="productName">
          {this.props.produt.name}
        </h4>
        <span className="productId">
          ({this.props.produt.id})
        </span>
        <span className="productPrice">
          £{this.props.produt.price}
        </span>
      </li>
    );
	}
});

var ProductsList = React.createClass ({

  render: function() {
    var elems = [];
    var products = ShoppingStore.getProducts();
    for (var i = 0; i < products.length; i++) {
      elems.push(<Product key={i} product={products[i]} />);
    }
    return (
      <ul id='products' className='list-group'>
        {elems}
      </ul>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('reactContainer'));
