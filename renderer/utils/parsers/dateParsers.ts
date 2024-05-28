export function parseDateOrUndefined(value: string): Date | undefined {
	const date = new Date(value);
	if (date.toString() !== 'Invalid Date') {
		date.setUTCHours(0, 0, 0, 0);
		return date;
	}
	return undefined;
}

export function parseDateOrEmpty(value: string): Date | string {
	const date = new Date(value);
	if (date.toString() !== 'Invalid Date') {
		date.setUTCHours(0, 0, 0, 0);
		return date;
	}
	return '';
}

export function parseDateOrNull(value: string): Date | null {
	const date = new Date(value);
	if (date.toString() !== 'Invalid Date') {
		date.setUTCHours(0, 0, 0, 0);
		return date;
	}
	return null;
}

export function parseDateToString(value: Date, defaultValue?: string): string {
	return value?.toISOString().split('T')[0] ?? defaultValue;
}

export function getCurrentDateOnly(): Date {
	const now = new Date();
	now.setHours(0, 0, 0, 0);
	return now;
}
