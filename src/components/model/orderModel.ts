import { IOrder, IProduct, IUserData, PaymentMethod } from '../../types';
import { IEvents } from '../base/events';

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export class OrderModel {
	protected orderData: IOrder = {
		items: [],
		total: 0,
		payment: null,
		address: '',
		email: '',
		phone: '',
	};

	protected formErrors: FormErrors = {};

	constructor(protected events: IEvents) {}

	set PaymentMethod(method: PaymentMethod) {
		this.orderData.payment = method;
	}

	set Address(address: IOrder['address']) {
		this.orderData.address = address;
	}

	set Email(email: IOrder['email']) {
		this.orderData.email = email;
	}

	set Phone(phone: IOrder['phone']) {
		this.orderData.phone = phone;
	}

	get listIdProductInCart(): IOrder['items'] {
		return this.orderData.items;
	}

	get countProductInCart(): number {
		return this.orderData.items.length;
	}

	get totalInCart(): IOrder['total'] {
		return this.orderData.total;
	}

	get userData(): IUserData {
		return {
			payment: this.orderData.payment,
			address: this.orderData.address,
			email: this.orderData.email,
			phone: this.orderData.phone,
		};
	}

	getOrderData(): IOrder {
		return this.orderData;
	}

	checkProductInCart(id: IProduct['id']): boolean {
		return this.orderData.items.some((item) => item === id);
	}

	addProductInCart(id: IProduct['id'], price: IProduct['price']) {
		this.orderData.items.push(id);
		this.orderData.total += price;
	}

	delProductInCart(id: IProduct['id'], price: IProduct['price']) {
		this.orderData.items = this.orderData.items.filter((item) => item !== id);
		this.orderData.total -= price;
	}

	clearOrder() {
		this.orderData = {
			items: [],
			total: 0,
			payment: null,
			address: '',
			email: '',
			phone: '',
		};
	}

	validateOrder(type: string) {
		const errors: Partial<Record<keyof IUserData, string>> = {};

		if (type === 'payment' || type === 'address') {
			if (!this.orderData.payment) {
				errors.payment = 'Выберите тип оплаты';
			}
			if (!this.orderData.address) {
				errors.address = 'Необходимо указать адрес';
			}
		}
		if (type === 'email' || type === 'phone') {
			if (!this.orderData.email) {
				errors.email = 'Необходимо указать email';
			}
			if (!this.orderData.phone) {
				errors.phone = 'Необходимо указать телефон';
			}
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
