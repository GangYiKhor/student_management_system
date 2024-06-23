import { tryParseInt } from './numberParsers';

export function getPropertyValue(obj: any, path: string): any {
	if (obj === undefined || path === undefined || obj === null || path === null || path === '') {
		return undefined;
	}

	try {
		while (obj && path) {
			const curPath = path.split('.')[0];
			path = path.substring(curPath.length + 1);
			obj = obj[tryParseInt(curPath, curPath)];
		}
		return obj;
	} catch (err) {
		return undefined;
	}
}
