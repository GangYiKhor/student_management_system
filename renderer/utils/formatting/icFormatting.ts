export function icFormatRevert(input: string): string {
	return input?.replace(/-/g, '').trim();
}

export function icFormat(input: string): string {
	input = input?.trim();
	if (input?.length === 12 && !input?.includes('-')) {
		return `${input.slice(0, 6)}-${input.slice(6, 8)}-${input.slice(8, 12)}`;
	}

	return input;
}
