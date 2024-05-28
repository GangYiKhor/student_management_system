export function parseTimeOrUndefined(value: string): Date | undefined {
	const [hour, minute] = value.split(':').map(value => parseInt(value));
	if (isNaN(hour) || isNaN(minute)) {
		return undefined;
	}
	return new Date(
		hour * 1000 * 60 * 60 + minute * 1000 * 60 + new Date().getTimezoneOffset() * 1000 * 60,
	);
}

export function parseTimeOrEmpty(value: string): Date | string {
	const [hour, minute] = value.split(':').map(value => parseInt(value));
	if (isNaN(hour) || isNaN(minute)) {
		return '';
	}
	return new Date(
		hour * 1000 * 60 * 60 + minute * 1000 * 60 + new Date().getTimezoneOffset() * 1000 * 60,
	);
}

export function parseTimeOrNull(value: string): Date | null {
	const [hour, minute] = value.split(':').map(value => parseInt(value));
	if (isNaN(hour) || isNaN(minute)) {
		return null;
	}
	return new Date(
		hour * 1000 * 60 * 60 + minute * 1000 * 60 + new Date().getTimezoneOffset() * 1000 * 60,
	);
}

export function parseTimeToString(value: Date, defaultValue?: string): string {
	return value?.toISOString().split('T')[1].split('.')[0] ?? defaultValue;
}
