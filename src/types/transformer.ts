import { ApiProduct } from './api';
import { ProductWithCartStatus } from './product';

export interface ProductTransformer {
	/** Преобразует объект товара с сервера в объект с дополнительным полем `inCart`. */
	transform(apiProduct: ApiProduct): ProductWithCartStatus;
}
