export function parseDateOrUndefined(
	value: string,
	returnEmptyString = false,
): Date | string | undefined {
	const date = new Date(value);
	if (date.toString() === 'Invalid Date') {
		return date;
	}
	return returnEmptyString ? '' : undefined;
}

export function parseIntOrUndefined(
	value: string,
	returnEmptyString = false,
): number | string | undefined {
	const parsed = parseInt(value);
	if (parsed) {
		return parsed;
	}
	return returnEmptyString ? '' : undefined;
}

export function parseFloatOrUndefined(
	value: string,
	precision?: number,
	returnEmptyString = false,
): number | string | undefined {
	const parsed = parseFloat(value);
	if (parsed) {
		return parseFloat(parsed.toFixed(precision));
	}
	return returnEmptyString ? '' : undefined;
}
