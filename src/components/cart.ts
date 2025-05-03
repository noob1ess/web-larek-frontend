import { IProduct } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export interface IBasketItem {
	index: number;
	title: IProduct['title'];
	price: IProduct['price'];
}

export interface IBasket {
	productList: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasket> {
	protected basketListElement: HTMLUListElement;
	protected basketTotalElement: HTMLElement;
	protected buyButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.basketListElement = ensureElement(
			'.basket__list',
			this.container
		) as HTMLUListElement;
		this.basketTotalElement = ensureElement('.basket__price', this.container);
		this.buyButton = ensureElement(
			'.button',
			this.container
		) as HTMLButtonElement;

		this.buyButton.addEventListener('click', () => {
			this.events.emit('cart:buy');
		});
	}

	set total(value: number) {
		this.setText(this.basketTotalElement, `${value} синапсов`);
		this.setDisabled(this.buyButton, value === 0);
	}

	set productList(items: HTMLElement[]) {
		this.basketListElement.replaceChildren(...items);
	}
}

export class ProductCardInBasket extends Component<IBasketItem> {
	protected itemIndex: HTMLElement;
	protected itemTitle: HTMLElement;
	protected itemPrice: HTMLElement;
	protected itemDeleteButton: HTMLButtonElement;
	protected itemId: IProduct['id'];

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.itemIndex = ensureElement('.basket__item-index', this.container);
		this.itemTitle = ensureElement('.card__title', this.container);
		this.itemPrice = ensureElement('.card__price', this.container);
		this.itemDeleteButton = ensureElement(
			'.basket__item-delete',
			this.container
		) as HTMLButtonElement;

		this.itemDeleteButton.addEventListener('click', () => {
			this.events.emit('item:deleteFromCart', { id: this.itemId });
		});
	}

	set index(value: number) {
		this.setText(this.itemIndex, value + 1);
	}

	set title(value: IProduct['title']) {
		this.setText(this.itemTitle, value);
	}

	set price(value: IProduct['price']) {
		this.setText(
			this.itemPrice,
			value === null ? 'Бесценно' : `${value} синапсов`
		);
	}

	set id(value: IProduct['id']) {
		this.itemId = value;
	}
}
