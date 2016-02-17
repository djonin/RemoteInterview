import AppDispatcher from '../dispatcher/dispatcher.js';

export default class Actions {

		static addToBag(p) {
			AppDispatcher.dispatch({
				actionType: 'addToBag',
        product: p
			});
		}

		static removeFromBag(p) {
			AppDispatcher.dispatch({
				actionType: 'removeFromBag',
				product: p
			});
		}
}
