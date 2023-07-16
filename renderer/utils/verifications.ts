export function verifyEmail(email: string): boolean {
	const emailRegex = new RegExp(
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
	);
	return email.match(emailRegex) !== null;
}

export function verifyPhoneNumber(phoneNumber: string): boolean {
	const phoneNumberRegex1 = new RegExp(/^01[02-9]-[0-9]{3}\s[0-9]{4}$/);
	const phoneNumberRegex2 = new RegExp(/^011-[0-9]{4}\s[0-9]{4}$/);
	return (
		phoneNumber.match(phoneNumberRegex1) !== null || phoneNumber.match(phoneNumberRegex2) !== null
	);
}
