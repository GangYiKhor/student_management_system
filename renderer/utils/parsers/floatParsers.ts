export function parseFloatOrUndefined(value: string, precision?: number): number | undefined {
	const parsed = parseFloat(value);
	if (!Number.isNaN(parsed)) {
		return parseFloat(parsed.toFixed(precision));
	}
	return undefined;
}

export function parseFloatOrNull(value: string, precision?: number): number | null {
	const parsed = parseFloat(value);
	if (!Number.isNaN(parsed)) {
		return parseFloat(parsed.toFixed(precision));
	}
	return null;
}

export function parseFloatOrEmpty(value: string, precision?: number): number | string {
	const parsed = parseFloat(value);
	if (!Number.isNaN(parsed)) {
		return parseFloat(parsed.toFixed(precision));
	}
	return '';
}
