import { SetNotification } from '../../components/providers/notification-providers';

export function EmptyFieldMessage(itemName: string): SetNotification {
	return {
		title: `Empty Field`,
		message: `Please enter a value for ${itemName}!`,
		source: 'Form',
	};
}

export function InvalidFieldMessage(itemName: string): SetNotification {
	return {
		title: `Invalid Field`,
		message: `Please enter a valid ${itemName}!`,
		source: 'Form',
	};
}
