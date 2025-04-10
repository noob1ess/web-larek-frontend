import { PaymentMethod } from './order';

export interface ApiProduct {
	/** ID товара */
	id: string;
	/** Описание товара*/
	description: string;
	/** URL на изображение товара*/
	image: string;
	/** Название товара */
	title: string;
	/** Категория товара*/
	category: string;
	/** Стоимость товара*/
	price: number | null;
}

export interface ApiOrder {
	/** Способ оплаты */
	payment: PaymentMethod;
	/** Почта */
	email: string;
	/** Номер телефона */
	phone: string;
	/** Адрес доставки */
	address: string;
	/** Общая стоимость */
	total: number;
	/** Список ID товаров в корзине */
	items: string[];
}
