export function tryParseInt(value: string | number, defaultValue = undefined): number {
	if (typeof value === 'number') {
		return Math.trunc(value);
	}
	const parsed = parseInt(value);
	if (!isNaN(parsed)) {
		return parsed;
	}
	return defaultValue;
}

export function tryParseFloat(
	value: string | number,
	precision?: number,
	defaultValue = undefined,
): number {
	if (typeof value === 'number') {
		return parseFloat(value.toFixed(precision));
	}

	const parsed = parseFloat(value);
	if (!isNaN(parsed)) {
		if (precision) {
			return parseFloat(parsed.toFixed(precision));
		}
		return parsed;
	}
	return defaultValue;
}
