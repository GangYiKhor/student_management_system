export function parseDateOrUndefined(value: string): Date | undefined {
	const date = new Date(value);
	if (date.toString() !== 'Invalid Date') {
		return date;
	}
	return undefined;
}

export function parseIntOrUndefined(value: string): number | undefined {
	const parsed = parseInt(value);
	if (!Number.isNaN(parsed)) {
		return parsed;
	}
	return undefined;
}

export function parseFloatOrUndefined(value: string, precision?: number): number | undefined {
	const parsed = parseFloat(value);
	if (!Number.isNaN(parsed)) {
		return parseFloat(parsed.toFixed(precision));
	}
	return undefined;
}

export function parseDateOrEmpty(value: string): Date | string {
	const date = new Date(value);
	if (date.toString() !== 'Invalid Date') {
		return date;
	}
	return '';
}

export function parseIntOrEmpty(value: string): number | string {
	const parsed = parseInt(value);
	if (!Number.isNaN(parsed)) {
		return parsed;
	}
	return '';
}

export function parseFloatOrEmpty(value: string, precision?: number): number | string {
	const parsed = parseFloat(value);
	if (!Number.isNaN(parsed)) {
		return parseFloat(parsed.toFixed(precision));
	}
	return '';
}
