import { IProduct } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class ProductCard extends Component<IProduct> {
	private productCard: HTMLButtonElement;
	protected productTitle: HTMLElement;
	protected productCategory: HTMLElement;
	protected productImg: HTMLImageElement;
	protected productPrice: HTMLElement;
	protected productId: string;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.productCard = this.container as HTMLButtonElement;
		this.productTitle = ensureElement('.card__title', this.container);
		this.productCategory = ensureElement('.card__category', this.container);
		this.productImg = ensureElement(
			'.card__image',
			this.container
		) as HTMLImageElement;
		this.productPrice = ensureElement('.card__price', this.container);

		this.productCard.addEventListener('click', (evt) => {
			const target = evt.target as HTMLElement;

			if (
				target.closest('.gallery__item') ||
				target.classList.contains('gallery__item')
			) {
				this.events.emit('item:selected', { id: this.productId });
			}
		});
	}

	set id(id: IProduct['id']) {
		this.productId = id;
	}

	get id(): string {
		return this.productId || '';
	}

	set title(title: IProduct['title']) {
		this.setText(this.productTitle, title);
	}

	set category(category: IProduct['category']) {
		this.setText(this.productCategory, category);
	}

	set image(imgSrc: IProduct['image']) {
		this.setImage(this.productImg, imgSrc, this.productTitle.textContent);
	}

	set price(value: IProduct['price']) {
		this.setText(
			this.productPrice,
			value === null ? 'Бесценно' : `${value} синапсов`
		);
	}
}

export class ProductCardPreview extends ProductCard {
	protected productTitle: HTMLElement;
	protected productCategory: HTMLElement;
	protected productImg: HTMLImageElement;
	protected productPrice: HTMLElement;
	protected productDescription: HTMLElement;
	protected productAddInCartButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container, events);
		this.productTitle = ensureElement('.card__title', this.container);
		this.productCategory = ensureElement('.card__category', this.container);
		this.productImg = ensureElement(
			'.card__image',
			this.container
		) as HTMLImageElement;
		this.productPrice = ensureElement('.card__price', this.container);
		this.productDescription = ensureElement('.card__text', this.container);
		this.productAddInCartButton = ensureElement(
			'.card__button',
			this.container
		) as HTMLButtonElement;

		this.productAddInCartButton.addEventListener('click', () =>
			this.events.emit('item:addInCart', { id: this.productId })
		);
	}

	set description(text: IProduct['description']) {
		this.setText(this.productDescription, text);
	}

	changeActiveButton(value: boolean) {
		if (value) {
			this.productAddInCartButton.disabled = true;
			this.setText(this.productAddInCartButton, 'Уже в корзине');
		} else {
			this.productAddInCartButton.disabled = false;
			this.setText(this.productAddInCartButton, 'В корзину');
		}
	}
}
