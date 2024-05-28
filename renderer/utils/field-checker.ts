import { GenericFormDataType, GenericSetFormData } from '../components/providers/form-providers';
import { SetNotification } from '../components/providers/notification-providers';
import { EmptyFieldMessage, InvalidFieldMessage } from './notifications/input-errors';

export function fieldCheckerRequired(
	valid: boolean,
	formData: GenericFormDataType,
	formName: string,
	fieldName: string,
	setFormData: GenericSetFormData,
	setNotification: (value: SetNotification) => void,
): boolean {
	if (typeof formData[formName]?.value === 'string') {
		if (!formData[formName].value?.trim()) {
			setFormData({ name: formName, valid: false });
			setNotification(EmptyFieldMessage(fieldName));
			valid = false;
		}
	} else if (formData[formName]?.value === undefined) {
		setFormData({ name: formName, valid: false });
		setNotification(EmptyFieldMessage(fieldName));
		valid = false;
	}

	return valid;
}

export function fieldCheckerValue(
	valid: boolean,
	formData: GenericFormDataType,
	formName: string,
	fieldName: string,
	setFormData: GenericSetFormData,
	setNotification: (value: SetNotification) => void,
	checkerFn: (value: any) => boolean,
): boolean {
	if (!formData[formName]?.value) {
		return valid;
	}

	if (!checkerFn(formData[formName]?.value)) {
		setFormData({ name: formName, valid: false });
		setNotification(InvalidFieldMessage(fieldName));
		valid = false;
	}

	return valid;
}

export function fieldCheckerRequiredValue(
	valid: boolean,
	formData: GenericFormDataType,
	formName: string,
	fieldName: string,
	setFormData: GenericSetFormData,
	setNotification: (value: SetNotification) => void,
	checkerFn: (value: any) => boolean,
): boolean {
	const valueExist = fieldCheckerRequired(
		true,
		formData,
		formName,
		fieldName,
		setFormData,
		setNotification,
	);

	if (valueExist) {
		valid = fieldCheckerValue(
			valid,
			formData,
			formName,
			fieldName,
			setFormData,
			setNotification,
			checkerFn,
		);
	}

	return valid && valueExist;
}
