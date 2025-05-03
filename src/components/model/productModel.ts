import { IProduct } from '../../types';
import { IEvents } from '../base/events';
import { IProductServer } from '../larekAPI';

export class ProductModel {
	protected productList: IProduct[];

	constructor(protected events: IEvents) {}

	setProducts(products: IProductServer[]) {
		this.productList = products.map((product) => ({
			...product,
			inCart: false,
		}));
		this.events.emit('items:changed');
	}

	getProducts(): IProduct[] {
		return this.productList;
	}

	getProduct(id: IProduct['id']): IProduct | undefined {
		return this.productList.find((product) => product.id === id);
	}

	toggleInCart(id: IProduct['id']) {
		const product = this.productList.find((product) => product.id === id);
		if (product) {
			product.inCart = !product.inCart;
		}
	}
}
