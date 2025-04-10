export interface IValidation {
	/** Проверяет валидность данных */
	validate(data: Record<string, string>): boolean;
	/** Устанавливает состояние кнопки в зависимости от валидности данных */
	setButtonState(isValid: boolean): void;
}
