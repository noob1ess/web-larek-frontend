import { IUserData } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Form } from './form';

export class orderPaymentForm extends Form<
	Pick<IUserData, 'payment' | 'address'>
> {
	protected buttonCard: HTMLButtonElement;
	protected buttonCash: HTMLButtonElement;
	protected inputAddress: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.buttonCard = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			container
		);
		this.buttonCash = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			container
		);
		this.inputAddress = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			container
		);

		this.buttonCard.addEventListener('click', () => {
			this.events.emit('order.payment:change', {
				field: 'payment',
				value: 'card',
			});
		});

		this.buttonCash.addEventListener('click', () => {
			this.events.emit('order.payment:change', {
				field: 'payment',
				value: 'cash',
			});
		});
	}

	set payment(value: IUserData['payment']) {
		this.buttonCard.classList.toggle('button_alt-active', value === 'card');
		this.buttonCash.classList.toggle('button_alt-active', value === 'cash');
	}

	set address(value: IUserData['address']) {
		this.inputAddress.value = value;
	}
}
