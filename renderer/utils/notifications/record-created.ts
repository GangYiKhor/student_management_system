import { SetNotification } from '../../components/providers/notification-providers';

export function RecordCreatedMessage(itemName: string): SetNotification {
	return {
		title: `Record Created!`,
		message: `${itemName} Created Successfully!`,
		type: 'INFO',
	};
}
