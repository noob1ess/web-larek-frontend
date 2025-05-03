import { IUserData } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Form } from './form';

export class orderContactForm extends Form<
	Pick<IUserData, 'payment' | 'address'>
> {
	protected inputEmail: HTMLInputElement;
	protected inputPhone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.inputEmail = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			container
		);
		this.inputPhone = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			container
		);

		this._submit.addEventListener('click', () => {
			this.events.emit('contacts:submit');
		});
	}

	set email(email: string) {
		this.inputEmail.value = email;
	}

	set phone(phone: string) {
		this.inputPhone.value = phone;
	}
}
