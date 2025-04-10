/** Для взаимодействия с пользователем */
export interface IModalView {
	/** Отображает модальное окно */
	render(content: HTMLElement): void;
	/** Закрывает модальное окно */
	close(): void;
	/** Устанавливает обработчик закрытия */
	onClose(callback: () => void): void;
}

/** Для управления логикой модельного окна */
export interface IModalPresenter {
	/** Открывает модальное окно */
	open(content: HTMLElement): void;
	/** Закрывает модальное окно */
	close(): void;
}
