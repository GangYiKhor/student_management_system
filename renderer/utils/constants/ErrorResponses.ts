import { SetNotification } from '../../components/providers/notification-providers';
import { ErrorResponse } from '../types/responses/error';

export const DATABASE_ERROR: ErrorResponse = {
	error: {
		title: 'Internal Server Error!',
		message: 'Unable to connect to database!',
		source: 'Server',
	},
};

export const INVALID_REQUEST: ErrorResponse = {
	error: {
		title: 'Invalid Request!',
		message: 'Invalid Request Method',
		source: 'Server',
	},
};

export const SERVER_CONNECTION_ERROR: SetNotification = {
	title: 'Server Error!',
	message: 'Unable to connect to server!',
	source: 'Server',
};
