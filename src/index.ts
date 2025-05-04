import './scss/styles.scss';

import { larekAPI } from './components/larekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ProductModel } from './components/model/productModel';
import {
	IOrder,
	IProduct,
	PaymentMethod,
	IUserData,
	IOrderResult,
} from './types';
import { OrderModel } from './components/model/orderModel';
import { ProductCard, ProductCardPreview } from './components/product';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/page';
import { Modal } from './components/modal';
import { Basket, ProductCardInBasket } from './components/cart';
import { orderContactForm } from './components/form/orderContactForm';
import { orderPaymentForm } from './components/form/orderPaymentForm';
import { orderSuccess } from './components/orderSuccess';

const pageWrapper = document.querySelector('.page__wrapper') as HTMLElement;

const templateList = {
	cardInCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'), //карточка в каталоге
	cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'), //подробная карточка товара
	basket: ensureElement<HTMLTemplateElement>('#basket'), //корзина
	cardInBasket: ensureElement<HTMLTemplateElement>('#card-basket'), //карточка товара в корзине
	orderPayment: ensureElement<HTMLTemplateElement>('#order'), //форма со способом оплаты и адресом
	orderContacts: ensureElement<HTMLTemplateElement>('#contacts'), //форма с контактной информацией
	orderSuccess: ensureElement<HTMLTemplateElement>('#success'), //успешный заказ
};

const modalConainer = ensureElement<HTMLElement>('#modal-container'); //контейнер модалок

enum appEvents {
	modalOpen = 'modal:open', //открытие модалки
	modalClose = 'modal:close', //закрытие модалки
	itemSelected = 'item:selected', //клик по карточке
	itemsChanged = 'items:changed', //изменение данных в productModal
	itemAddCart = 'item:addInCart', //товар добавлен в корзину
	deleteItemFromOrder = 'item:deleteFromCart', //товар удален из корзины
	openCart = 'cart:open', //клик по корзине
	buyCart = 'cart:buy', //нажата кнопка "Оформить"
	changePayment = 'order.payment:change', //нажатия по кнопкам с способом оплаты
	changeAddress = 'order.address:change', //ввод в поле с адресом доставки	
	paymentSubmit = 'order:submit', //нажата кнопка для перехода в форму с контактной информацией
	changeEmail = 'contacts.email:change', //ввод в поле с почтой
	changePhone = 'contacts.phone:change', //ввод в поле с телефоном
	contactsSubmit = 'contacts:submit', //нажата кнопка для оплаты
	formErrors = 'formErrors:change', //изменён объект ошибок
}

const events = new EventEmitter();
const api = new larekAPI(CDN_URL, API_URL);
const product = new ProductModel(events);
const order = new OrderModel(events);
const cart = new Basket(cloneTemplate(templateList.basket), events);
const page = new Page(pageWrapper, events);
const cardPreview = new ProductCardPreview(
	cloneTemplate(templateList.cardPreview),
	events
);
const modal = new Modal(modalConainer, events);
const formOrderPayment = new orderPaymentForm(
	cloneTemplate(templateList.orderPayment),
	events
);
const formOrderContacts = new orderContactForm(
	cloneTemplate(templateList.orderContacts),
	events
);
const modalOrderSuccess = new orderSuccess(
	cloneTemplate(templateList.orderSuccess),
	events
);

events.on(appEvents.itemsChanged, () => {
	const itemsHTMLArray = product
		.getProducts()
		.map((item) =>
			new ProductCard(cloneTemplate(templateList.cardInCatalog), events).render(
				item
			)
		);
	page.render({
		counter: order.countProductInCart,
		catalog: itemsHTMLArray,
	});
});

events.on(appEvents.itemSelected, ({ id }: { id: IProduct['id'] }) => {
	cardPreview.changeActiveButton(order.checkProductInCart(id));
	modal.content = cardPreview.render(product.getProduct(id));
	modal.open();
});

events.on(appEvents.modalOpen, () => {
	page.locked = true;
});

events.on(appEvents.modalClose, () => {
	page.locked = false;
});

events.on(appEvents.itemAddCart, ({ id }: { id: IProduct['id'] }) => {
	order.addProductInCart(id, product.getProduct(id).price);
	product.toggleInCart(id);
	cardPreview.changeActiveButton(order.checkProductInCart(id));
	page.render({ counter: order.countProductInCart });
});

function handleChangeItemsInCart() {
	const prodCart = order.listIdProductInCart.map((itemId, index) => {
		return {
			index: index, // Порядковый номер товара в корзине
			title: product.getProduct(itemId).title, // Название товара
			price: product.getProduct(itemId).price, // Цена товара
			id: itemId, //ид товара
		};
	});
	const itemsHTMLArray = prodCart.map((item) =>
		new ProductCardInBasket(
			cloneTemplate(templateList.cardInBasket),
			events
		).render(item)
	);
	return itemsHTMLArray;
}

events.on(appEvents.openCart, () => {
	modal.content = cart.render({
		total: order.totalInCart,
		productList: handleChangeItemsInCart(),
	});
	modal.open();
});

events.on(appEvents.deleteItemFromOrder, (id: { id: string }) => {
	const productId = id.id;
	order.delProductInCart(productId, product.getProduct(productId).price);
	modal.content = cart.render({
		total: order.totalInCart,
		productList: handleChangeItemsInCart(),
	});
	page.render({ counter: order.countProductInCart });
});

events.on(appEvents.buyCart, () => {
	formOrderPayment.address = order.userData.address;
	formOrderPayment.payment = order.userData.payment;
	modal.content = formOrderPayment.render({
		valid: order.validateOrder('address'),
		errors: [],
	});
});

events.on(
	appEvents.changePayment,
	(data: {
		field: keyof Pick<IOrder, 'payment' | 'address'>;
		value: string;
	}) => {
		const selectMethod = data.value as PaymentMethod;
		order.PaymentMethod = selectMethod;
		formOrderPayment.payment = order.userData.payment;
		formOrderPayment.valid = order.validateOrder(data.field);
	}
);

events.on(
	appEvents.changeAddress,
	(data: {
		field: keyof Pick<IOrder, 'payment' | 'address'>;
		value: string;
	}) => {
		order.Address = data.value;
		formOrderPayment.address = order.userData.address;
		formOrderPayment.valid = order.validateOrder(data.field);
	}
);

events.on(
	appEvents.formErrors,
	(data: { err: Partial<Record<keyof IUserData, string>> }) => {
		const errors = (Object.values(data) as string[]).join('; ');
		formOrderPayment.errors = errors;
		formOrderContacts.errors = errors;
	}
);

events.on(appEvents.paymentSubmit, () => {
	formOrderContacts.email = order.userData.email;
	formOrderContacts.phone = order.userData.phone;
	modal.content = formOrderContacts.render({
		valid: order.validateOrder('email'),
		errors: [],
	});
});

events.on(
	appEvents.changeEmail,
	(data: { field: keyof Pick<IOrder, 'email' | 'phone'>; value: string }) => {
		order.Email = data.value;
		formOrderContacts.email = order.userData.email;
		formOrderContacts.valid = order.validateOrder(data.field);
	}
);

events.on(
	appEvents.changePhone,
	(data: { field: keyof Pick<IOrder, 'email' | 'phone'>; value: string }) => {
		order.Phone = (data.value.replace(/[^0-9]/g, '') || '').slice(0, 12);
		formOrderContacts.phone = order.userData.phone;
		formOrderContacts.valid = order.validateOrder(data.field);
	}
);

events.on(appEvents.contactsSubmit, () => {
	api
		.postOrder(order.getOrderData())
		.then((data) => {
			modal.content = modalOrderSuccess.render(data as IOrderResult);
			order.clearOrder();
			page.counter = order.countProductInCart;
		})
		.catch((err) => console.error(err));
});

api
	.getProductList()
	.then((data) => {
		product.setProducts(data);
	})
	.catch((err) => console.error(err));
