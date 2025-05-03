import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected counterElement: HTMLElement;
	protected catalogElement: HTMLElement;
	protected basketElement: HTMLElement;
	protected wrapperElement: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.counterElement = ensureElement('.header__basket-counter');
		this.catalogElement = ensureElement('.gallery');
		this.wrapperElement = ensureElement('.page__wrapper');
		this.basketElement = ensureElement('.header__basket');

		this.basketElement.addEventListener('click', () => {
			this.events.emit('cart:open');
		});
	}

	set counter(value: number) {
		this.setText(this.counterElement, value);
	}

	set catalog(items: HTMLElement[]) {
		this.catalogElement.replaceChildren(...items);
	}

	set locked(value: boolean) {
		this.wrapperElement.classList.toggle('page__wrapper_locked', value);
	}
}
