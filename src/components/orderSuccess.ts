import { IOrderResult } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

interface ISuccessActions {
	onClick: () => void;
}

export class orderSuccess extends Component<IOrderResult> {
	protected orderTotal: HTMLElement;
	protected buttonClose: HTMLButtonElement;

	constructor(container: HTMLElement, protected action: ISuccessActions) {
		super(container);

		this.orderTotal = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);
		this.buttonClose = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);

		this.buttonClose.addEventListener('click', () => this.action.onClick());
	}

	set total(value: IOrderResult['total']) {
		this.setText(this.orderTotal, `Списано ${value} синапсов`);
	}
}
