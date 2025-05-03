import { Api, ApiListResponse } from './base/api';
import { IOrder, IOrderResult } from '../types';

export interface IProductServer {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IApiLarek {
	getProductList: () => Promise<IProductServer[]>;
	getProductItem: (id: string) => Promise<IProductServer>;
	postOrder: (order: IOrder) => Promise<IOrderResult>;
}

export class larekAPI extends Api implements IApiLarek {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProductServer[]> {
		return this.get('/product').then((data: ApiListResponse<IProductServer>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getProductItem(id: string): Promise<IProductServer> {
		return this.get(`/product/${id}`).then((item: IProductServer) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	postOrder(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
