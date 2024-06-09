export type OrderBy = SingleOrderBy | SingleOrderBy[];
export type SingleOrderBy = { [key: string]: 'asc' | 'desc' | object };
