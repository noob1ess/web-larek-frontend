import { IOrderResult } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class orderSuccess extends Component<IOrderResult> {
	protected orderTotal: HTMLElement;
	protected buttonClose: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.orderTotal = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);
		this.buttonClose = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);

		this.buttonClose.addEventListener('click', () => {
			this.container.closest('.modal').classList.remove('modal_active');
			this.events.emit('modal:close');
		});
	}

	set total(value: IOrderResult['total']) {
		this.setText(this.orderTotal, `Списано ${value} синапсов`);
	}
}
