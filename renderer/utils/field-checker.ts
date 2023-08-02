import { SetNotification } from '../components/providers/notification-providers';
import { ErrorTextBoxClass } from './class/inputs';

type InputRef = React.MutableRefObject<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

export function fieldCheckerRequired(
	ref: InputRef,
	setValid: (value: boolean) => void,
	notification: {
		itemName: string;
		setNotification: (value: SetNotification) => void;
	},
): boolean {
	if (ref.current.value.trim() === '') {
		setValid(false);
		ref.current.value = '';
		ref.current.focus();
		ref.current.classList.add(ErrorTextBoxClass);
		setTimeout(() => ref.current?.classList?.remove(ErrorTextBoxClass), 500);

		const itemTitle = notification.itemName
			.split(' ')
			.map(value => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase())
			.join(' ');
		notification.setNotification({
			title: `Empty ${itemTitle}!`,
			message: `Please enter ${itemTitle.toLowerCase()}`,
			type: 'ERROR',
		});
		return false;
	}
	return true;
}

export function fieldCheckerValue(
	ref: InputRef,
	setValid: (value: boolean) => void,
	checkCondition: string | ((value: string) => any),
	notification: {
		itemName: string;
		setNotification: (value: SetNotification) => void;
	},
): boolean {
	if (ref.current.value.trim() !== '') {
		let isValid = false;
		if (typeof checkCondition === 'function') {
			const checkResult = checkCondition(ref.current.value);
			isValid = checkResult !== false && checkResult !== undefined;
		} else {
			isValid = ref.current.value === checkCondition;
		}

		if (!isValid) {
			setValid(false);
			ref.current.focus();
			ref.current.classList.add(ErrorTextBoxClass);
			setTimeout(() => ref.current?.classList?.remove(ErrorTextBoxClass), 500);

			const itemTitle = notification.itemName
				.split(' ')
				.map(value => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase())
				.join(' ');
			notification.setNotification({
				title: `Empty ${itemTitle}!`,
				message: `Please enter a valid ${itemTitle.toLowerCase()}`,
				type: 'ERROR',
			});
			return false;
		}
	}
	return true;
}

export function fieldCheckerRequiredValue(
	ref: InputRef,
	setValid: (value: boolean) => void,
	checkCondition: string | ((value: string) => any),
	notification: {
		itemName: string;
		setNotification: (value: SetNotification) => void;
	},
): boolean {
	if (fieldCheckerRequired(ref, setValid, notification)) {
		let isValid = false;
		if (typeof checkCondition === 'function') {
			const checkResult = checkCondition(ref.current.value);
			isValid = checkResult !== false && checkResult !== undefined;
		} else {
			isValid = ref.current.value === checkCondition;
		}

		if (!isValid) {
			setValid(false);
			ref.current.focus();
			ref.current.classList.add(ErrorTextBoxClass);
			setTimeout(() => ref.current?.classList?.remove(ErrorTextBoxClass), 500);

			const itemTitle = notification.itemName
				.split(' ')
				.map(value => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase())
				.join(' ');
			notification.setNotification({
				title: `Empty ${itemTitle}!`,
				message: `Please enter a valid ${itemTitle.toLowerCase()}`,
				type: 'ERROR',
			});
			return false;
		}
		return true;
	}
	return false;
}
