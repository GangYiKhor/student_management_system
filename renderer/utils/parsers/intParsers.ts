export function parseIntOrUndefined(value: string): number | undefined {
	const parsed = parseInt(value);
	if (!Number.isNaN(parsed)) {
		return parsed;
	}
	return undefined;
}

export function parseIntOrNull(value: string): number | null {
	const parsed = parseInt(value);
	if (!Number.isNaN(parsed)) {
		return parsed;
	}
	return null;
}

export function parseIntOrEmpty(value: string): number | string {
	const parsed = parseInt(value);
	if (!Number.isNaN(parsed)) {
		return parsed;
	}
	return '';
}
