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
const productModel = new ProductModel(events);
const orderModel = new OrderModel(events);
const сartView = new Basket(cloneTemplate(templateList.basket), events);
const pageView = new Page(pageWrapper, events);
const cardPreview = new ProductCardPreview(
	cloneTemplate(templateList.cardPreview),
	events
);
const modalView = new Modal(modalConainer, events);
const formOrderPaymentView = new orderPaymentForm(
	cloneTemplate(templateList.orderPayment),
	events
);
const formOrderContactsView = new orderContactForm(
	cloneTemplate(templateList.orderContacts),
	events
);

const modalOrderSuccessView = new orderSuccess(
	cloneTemplate(templateList.orderSuccess), {
		onClick: () => {
			modalView.close();
		},
	});

events.on(appEvents.itemsChanged, () => {
	const itemsHTMLArray = productModel
		.getProducts()
		.map((item) =>
			new ProductCard(cloneTemplate(templateList.cardInCatalog), events).render(
				item
			)
		);
		pageView.render({
		counter: orderModel.countProductInCart,
		catalog: itemsHTMLArray,
	});
});

events.on(appEvents.itemSelected, ({ id }: { id: IProduct['id'] }) => {
	cardPreview.changeActiveButton(orderModel.checkProductInCart(id));
	modalView.content = cardPreview.render(productModel.getProduct(id));
	modalView.open();
});

events.on(appEvents.modalOpen, () => {
	pageView.locked = true;
});

events.on(appEvents.modalClose, () => {
	pageView.locked = false;
});

events.on(appEvents.itemAddCart, ({ id }: { id: IProduct['id'] }) => {
	orderModel.addProductInCart(id, productModel.getProduct(id).price);
	productModel.toggleInCart(id);
	cardPreview.changeActiveButton(orderModel.checkProductInCart(id));
	pageView.render({ counter: orderModel.countProductInCart });
});

function handleChangeItemsInCart() {
	const productsInCart = orderModel.listIdProductInCart.map((itemId, index) => {
		return {
			index: index, // Порядковый номер товара в корзине
			title: productModel.getProduct(itemId).title, // Название товара
			price: productModel.getProduct(itemId).price, // Цена товара
			id: itemId, //ид товара
		};
	});
	const itemsHTMLArray = productsInCart.map((item) =>
		new ProductCardInBasket(
			cloneTemplate(templateList.cardInBasket),
			events
		).render(item)
	);
	return itemsHTMLArray;
}

events.on(appEvents.openCart, () => {
	modalView.content = сartView.render({
		total: orderModel.totalInCart,
		productList: handleChangeItemsInCart(),
	});
	modalView.open();
});

events.on(appEvents.deleteItemFromOrder, (id: { id: string }) => {
	const productId = id.id;
	orderModel.delProductInCart(productId, productModel.getProduct(productId).price);
	modalView.content = сartView.render({
		total: orderModel.totalInCart,
		productList: handleChangeItemsInCart(),
	});
	pageView.render({ counter: orderModel.countProductInCart });
});

events.on(appEvents.buyCart, () => {
	formOrderPaymentView.address = orderModel.userData.address;
	formOrderPaymentView.payment = orderModel.userData.payment;
	modalView.content = formOrderPaymentView.render({
		valid: orderModel.validateOrder('address'),
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
		orderModel.paymentMethod = selectMethod;
		formOrderPaymentView.payment = orderModel.userData.payment;
		formOrderPaymentView.valid = orderModel.validateOrder(data.field);
	}
);

events.on(
	appEvents.changeAddress,
	(data: {
		field: keyof Pick<IOrder, 'payment' | 'address'>;
		value: string;
	}) => {
		orderModel.address = data.value;
		formOrderPaymentView.address = orderModel.userData.address;
		formOrderPaymentView.valid = orderModel.validateOrder(data.field);
	}
);

events.on(
	appEvents.formErrors,
	(data: { err: Partial<Record<keyof IUserData, string>> }) => {
		const errors = (Object.values(data) as string[]).join('; ');
		formOrderPaymentView.errors = errors;
		formOrderContactsView.errors = errors;
	}
);

events.on(appEvents.paymentSubmit, () => {
	formOrderContactsView.email = orderModel.userData.email;
	formOrderContactsView.phone = orderModel.userData.phone;
	modalView.content = formOrderContactsView.render({
		valid: orderModel.validateOrder('email'),
		errors: [],
	});
});

events.on(
	appEvents.changeEmail,
	(data: { field: keyof Pick<IOrder, 'email' | 'phone'>; value: string }) => {
		orderModel.email = data.value;
		formOrderContactsView.email = orderModel.userData.email;
		formOrderContactsView.valid = orderModel.validateOrder(data.field);
	}
);

events.on(
	appEvents.changePhone,
	(data: { field: keyof Pick<IOrder, 'email' | 'phone'>; value: string }) => {
		orderModel.phone = (data.value.replace(/[^0-9]/g, '') || '').slice(0, 12);
		formOrderContactsView.phone = orderModel.userData.phone;
		formOrderContactsView.valid = orderModel.validateOrder(data.field);
	}
);

events.on(appEvents.contactsSubmit, () => {
	api
		.postOrder(orderModel.getOrderData())
		.then((data) => {
			modalView.content = modalOrderSuccessView.render(data as IOrderResult);
			orderModel.clearOrder();
			pageView.counter = orderModel.countProductInCart;
		})
		.catch((err) => console.error(err));
});

api
	.getProductList()
	.then((data) => {
		productModel.setProducts(data);
	})
	.catch((err) => console.error(err));
