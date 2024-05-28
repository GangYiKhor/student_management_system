export function devLog(...input: any[]) {
	if (process.env.NODE_ENV === 'development') {
		console.log(...input);
	}
}
