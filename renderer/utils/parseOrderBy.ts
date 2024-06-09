import { OrderBy, SingleOrderBy } from './types/orderBy';

/**
 * This function only parse the first sort in the string
 * @param defaultOrder Default order that will be applied if not overridden
 * @param columnToTable Convert specific columnName to tableName: {columnName: sort}
 * @example
 * // Input: 'form asc, name desc'
 * parseOrderBy(orderBy, {name: 'asc'}, {columnName: 'form', tableName: 'formTable'});
 * // [{ formTable: { form: 'asc' } }, { name: 'asc' }]
 */
export function parseOrderBy(
	value: string,
	defaultOrder?: SingleOrderBy,
	columnToTables?: { columnName: string; tableName: string }[],
): OrderBy {
	if (!value) {
		return defaultOrder;
	}

	const sort = value.split(',').map(value => value.trim())[0];
	const orderBy: OrderBy = {};

	const [item, asc] = sort.split(' ');
	orderBy[item] = asc !== 'desc' ? 'asc' : 'desc';

	if (columnToTables) {
		for (const columnToTable of columnToTables) {
			const { columnName, tableName } = columnToTable;
			if (Object.hasOwn(orderBy, columnName)) {
				orderBy[tableName] = { [columnName]: orderBy[columnName] };
				delete orderBy[columnName];
			}
		}
	}

	if (defaultOrder && !Object.hasOwn(orderBy, Object.keys(defaultOrder)[0])) {
		return [orderBy, defaultOrder];
	}

	return orderBy;
}
