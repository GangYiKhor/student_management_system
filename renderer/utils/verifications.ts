export function verifyEmail(email: string): boolean {
	const emailRegex = new RegExp(
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
	);
	return !!emailRegex.exec(email);
}

export function verifyPhoneNumber(phoneNumber: string): boolean {
	const regex = [
		new RegExp(/^01[02-9]-\d{3} \d{4}$/),
		new RegExp(/^011-\d{4} \d{4}$/),
		new RegExp(/^0[2-9]-\d{3} \d{4}$/),
	];

	return regex.reduce((valid, value) => valid || !!value.exec(phoneNumber), false);
}
