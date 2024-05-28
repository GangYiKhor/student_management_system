import { ErrorResponse } from '../types/responses/error';
import { CommonError } from './CommonError';

export class NotFoundError extends CommonError {
	title: string;
	message: string;

	constructor(message?: string, title?: string) {
		super(message || 'Record Not Found!', 400, title);
		this.title = title || 'Record Not Found Error';
		this.message = message || 'Record Not Found!';
	}

	get errorResponse(): ErrorResponse {
		return {
			error: {
				title: this.title,
				message: this.message,
				source: 'Server',
			},
		};
	}
}
