import { ApiProduct } from './api';

export interface ICartView {
	/** Отображает содержимое корзины */
	render(cartItems: ApiProduct[], totalPrice: number): void;
	/** Устанавливает обработчик удаления товара */
	onRemoveItem(callback: (productId: string) => void): void;
	/** Устанавливает обработчик оформления заказа */
	onCheckout(callback: () => void): void;
	/** Устанавливает состояние кнопки "Оформить" */
	setCheckoutButtonState(enabled: boolean): void;
}

export interface ICartPresenter {
	/** Инициализирует корзину */
	init(): void;
	/** Обрабатывает удаление товара */
	handleRemoveItem(productId: string): void;
	/** Обрабатывает оформление заказа */
	handleCheckout(): void;
}

export interface ICartModel {
	/** Добавляет товар в корзину */
	addItem(product: ApiProduct): void;
	/** Удаляет товар из корзины */
	removeItem(productId: string): void;
	/** Возвращает список товаров в корзине */
	getCartItems(): ApiProduct[];
	/** Возвращает общую стоимость товаров */
	getTotalPrice(): number;
	/** Проверяет, пуста ли корзина */
	isCartEmpty(): boolean;
}
