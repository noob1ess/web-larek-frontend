export type PaymentMethod = 'cash' | 'online';

export interface IOrderData {
	/** Способ оплаты */
	payment: PaymentMethod;
	/** Адрес доставки */
	address: string;
	/** Почта */
	email: string;
	/** Номер телефона */
	phone: string;
	/** Валидность данных */
	validation: Record<'address' | 'email' | 'phone', boolean>;
}

export interface IOrder extends IOrderData {
	/** Список ID товаров в корзине */
	items: string[];
	/** Общая стоимость */
	total: number;
}

export interface IOrderResult {
	/** ID заказа */
	id: string;
	/** Общая стоимость */
	total: number;
}
