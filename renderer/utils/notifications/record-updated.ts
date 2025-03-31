import { SetNotification } from '../../components/providers/notification-providers';

export function RecordUpdatedMessage(itemName: string): SetNotification {
	return {
		title: `Record Updated!`,
		message: `${itemName} Updated Successfully!`,
		type: 'INFO',
	};
}
