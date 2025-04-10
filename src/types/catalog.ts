import { ApiProduct } from './api';

export interface ICatalogView {
	/** Отображает список товаров */
	render(products: ApiProduct[]): void;
	/** Устанавливает обработчик выбора товара */
	onProductSelect(callback: (productId: string) => void): void;
}

export interface ICatalogPresenter {
	/** Инициализирует каталог */
	init(): void;
	/** Обрабатывает выбор товара */
	handleProductSelect(productId: string): void;
}

export interface ICatalogModel {
	/** Загружает список товаров */
	fetchProducts(): Promise<ApiProduct[]>;
	/** Возвращает список товаров */
	getProducts(): ApiProduct[];
}
