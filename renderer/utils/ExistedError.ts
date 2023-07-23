import { CommonError } from './CommonError';

export class ExistedError extends CommonError {
	constructor(message?: string) {
		super(message || 'Record Existed!', 406);
	}
}
