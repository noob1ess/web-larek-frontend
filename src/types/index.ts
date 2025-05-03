//Интерфейс товара
export interface IProduct {
	id: string; // Уникальный идентификатор
	description: string; // Описание
	image: string; // URL изображения
	title: string; // Название
	category: string; // Категория
	price: number | null; // Цена
	inCart: boolean; // Флаг, указывающий, находится ли товар в корзине
}
// Тип для способов оплаты
export type PaymentMethod = 'card' | 'cash';

// Данные пользователя
export interface IUserData {
	payment: PaymentMethod; // Выбранный способ оплаты
	email: string; // Email
	phone: string; // Номер телефона
	address: string; // Адрес доставки
}

//Данные для заказа, расширяет IUserData
export interface IOrder extends IUserData {
	total: number; // Общая стоимость заказа
	items: string[]; // Список идентификаторов товаров в заказе
}

//Результат заказа с сервера
export interface IOrderResult {
	id: string; // Уникальный идентификатор заказа
	total: number; // Общая стоимость заказа
}
