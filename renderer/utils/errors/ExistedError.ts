import { ErrorResponse } from '../types/responses/error';
import { CommonError } from './CommonError';

export class ExistedError extends CommonError {
	title: string;
	message: string;

	constructor(message?: string, title?: string) {
		super(message || 'Record Existed!', 406, title);
		this.title = title || 'Duplicate Error';
		this.message = message || 'Record Existed!';
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
