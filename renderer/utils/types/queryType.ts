export type QueryType<T> = {
	[P in keyof T]?: string;
};
