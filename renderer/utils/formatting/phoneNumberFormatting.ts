export function phoneNumberFormatRevert(input: string): string {
	return input?.replace(/-/g, '').replace(/\s/g, '').trim();
}

export function phoneNumberFormat(input: string): string {
	input = input?.replace(/-/g, '').replace(/\s/g, '').trim();

	if (!input?.includes(' ')) {
		let starting = '';
		let middle = '';
		let ending = '';

		if (input?.match(/^011/) && input?.length === 11) {
			starting = input.slice(0, 3);
			middle = input.slice(3, 7);
			ending = input.slice(7);
		} else if (input?.match(/^01[02-9]/) && input?.length === 10) {
			starting = input.slice(0, 3);
			middle = input.slice(3, 6);
			ending = input.slice(6);
		} else if (input?.match(/^0[2-9]/) && input?.length === 9) {
			starting = input.slice(0, 2);
			middle = input.slice(2, 5);
			ending = input.slice(5);
		} else {
			return input;
		}

		return `${starting}-${middle} ${ending}`;
	}

	return input;
}
