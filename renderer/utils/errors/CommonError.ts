import { ErrorResponse } from '../types/responses/error';

export class CommonError extends Error {
	title: string;
	message: string;
	code: number;

	constructor(message: string, code: number, title?: string) {
		super(message);
		this.title = title ?? 'Error';
		this.message = message;
		this.code = code;
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
