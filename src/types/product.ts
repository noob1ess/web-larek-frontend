import { ApiProduct } from './api';

export interface ProductWithCartStatus extends ApiProduct {
	/** Добавлен ли товар в корзину */
	inCart: boolean;
}

export interface IProductCardView {
	/** Отображает информацию о товаре */
	render(product: ProductWithCartStatus): void;
	/** Устанавливает обработчик добавления товара в корзину */
	onAddToCart(callback: () => void): void;
	/** Устанавливает состояние кнопки "Купить" */
	setButtonState(inCart: boolean): void;
}

export interface IProductPresenter {
	/** Инициализирует карточку товара */
	init(productId: string): void;
	/** Обрабатывает добавление товара в корзину */
	handleAddToCart(): void;
}

export interface IProductModel {
	/** Загружает данные о товаре */
	fetchProduct(productId: string): Promise<ProductWithCartStatus>;
	/** Возвращает данные о товаре */
	getProduct(): ProductWithCartStatus;
}
