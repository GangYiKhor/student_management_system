import { SetNotification } from '../components/providers/notification-providers';
import { EmptyFieldMessage, InvalidFieldMessage } from './notifications/input-errors';
import { GenericSetSingleFormData, GenericSingleFormDataType } from './types/form';

export function fieldCheckerRequired(
	valid: boolean,
	formData: GenericSingleFormDataType,
	formName: string,
	fieldName: string,
	setFormData: GenericSetSingleFormData,
	setNotification: (value: SetNotification) => void,
): boolean {
	let invalid = formData?.[formName]?.value === undefined;
	invalid ||=
		typeof formData?.[formName]?.value === 'string' && !formData?.[formName].value?.trim();
	if (invalid) {
		setFormData({ path: formName, valid: false });
		setNotification(EmptyFieldMessage(fieldName));
		return false;
	}

	return valid;
}

export function fieldCheckerValue(
	valid: boolean,
	formData: GenericSingleFormDataType,
	formName: string,
	fieldName: string,
	setFormData: GenericSetSingleFormData,
	setNotification: (value: SetNotification) => void,
	checkerFn: (value: any) => boolean,
): boolean {
	if (formData?.[formName]?.value == undefined) {
		return valid;
	}

	if (!checkerFn(formData?.[formName]?.value)) {
		setFormData({ path: formName, valid: false });
		setNotification(InvalidFieldMessage(fieldName));
		valid = false;
	}

	return valid;
}

export function fieldCheckerRequiredValue(
	valid: boolean,
	formData: GenericSingleFormDataType,
	formName: string,
	fieldName: string,
	setFormData: GenericSetSingleFormData,
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
