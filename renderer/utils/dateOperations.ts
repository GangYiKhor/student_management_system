import { padStart } from 'lodash';

/**
 * Before 1970 results in invalid date
 * @example
 * parseDate('08:00');
 * // 1970-01-01 08:00:00
 *
 * parseDate('2024-05-01 08:00');
 * // 2024-05-01 08:00:00
 *
 * parseDate(1800000);
 * // 1970-01-01 01:30:00
 *
 * parseDate(new Date());
 * // now
 *
 * parseDate('Invalid Date');
 * // undefined
 *
 * parseDate('Invalid Date', null);
 * // null
 *
 * parseDate('Invalid Date', defaultDate);
 * // defaultDate
 */
export function parseDateTime(value: string | number | Date, defaultValue: any = undefined): Date {
	if (!value) {
		return defaultValue;
	}

	let newDate: Date;

	if (typeof value === 'string' && value.charAt(2) === ':') {
		const [hour, minute] = value.split(':').map(value => parseInt(value));

		if (isNaN(hour) || isNaN(minute)) {
			return defaultValue;
		}

		newDate = new Date(
			hour * 1000 * 60 * 60 + minute * 1000 * 60 + new Date().getTimezoneOffset() * 1000 * 60,
		);
	} else {
		newDate = new Date(value);
	}

	if (isNaN(newDate?.valueOf()) || newDate?.valueOf() < 0) {
		return defaultValue;
	}
	return newDate;
}

/**
 * @default
 * dateFormatter(date, {format: 'yyyy-MM-dd', defaultValue: ''})
 *
 * @example
 * dateFormatter(date, {format: 'yyyy-MM-dd hh:mm:ss.ms a'})
 * // 2024-06-02 03:15:30.056 PM
 *
 * dateFormatter(date, {format: 'd/M/y h:m:s'})
 * // 3/6/24 15:3:5
 *
 * dateFormatter(invalidDate, {defaultValue: 'Invalid'})
 * // Invalid
 */
export function dateFormatter(
	value: Date,
	options: { format?: string; defaultValue?: string } = { format: 'yyyy-MM-dd', defaultValue: '' },
): string {
	if (isNaN(value?.valueOf())) {
		return options.defaultValue ?? '';
	}

	let dateString = options.format ?? 'yyyy-MM-dd';

	const year = padStart(value.getFullYear().toString(), 4, '0');
	dateString = dateString.replaceAll('yyyy', year);
	dateString = dateString.replaceAll('y', year.substring(2));

	const month = (value.getMonth() + 1).toString();
	dateString = dateString.replaceAll('MM', padStart(month, 2, '0'));
	dateString = dateString.replaceAll('M', month);

	const date = value.getDate().toString();
	dateString = dateString.replaceAll('dd', padStart(date, 2, '0'));
	dateString = dateString.replaceAll('d', date);

	let hourNumber = value.getHours();
	if (dateString.includes('a')) {
		if (hourNumber >= 12) {
			dateString = dateString.replaceAll('a', 'PM');
		} else {
			dateString = dateString.replaceAll('a', 'AM');
		}

		if (hourNumber > 12) {
			hourNumber -= 12;
		}
	}

	const hour = hourNumber.toString();
	dateString = dateString.replaceAll('hh', padStart(hour, 2, '0'));
	dateString = dateString.replaceAll('h', hour);

	const minute = value.getMinutes().toString();
	dateString = dateString.replaceAll('mm', padStart(minute, 2, '0'));
	dateString = dateString.replaceAll('m', minute);

	const second = value.getSeconds().toString();
	dateString = dateString.replaceAll('ss', padStart(second, 2, '0'));
	dateString = dateString.replaceAll('s', second);

	const ms = value.getMilliseconds().toString();
	dateString = dateString.replaceAll('ms', padStart(ms, 3, '0'));

	return dateString;
}

/**
 * Add or Substract a specific number of time from date
 *
 * @example
 * const date = new Date('2024-05-31 12:00:00')
 * dateOperator(date, 15, 'd');
 * // 2024-06-15 12:00:00
 *
 * dateOperator(date, -15, 'd');
 * // 2024-05-16 12:00:00
 *
 * dateOperator(date, 5, 'h');
 * // 2024-05-16 17:00:00
 */
export function dateOperator(
	value: Date,
	count: number,
	unit: 'y' | 'M' | 'd' | 'h' | 'm' | 's' | 'ms',
): Date {
	const newValue = new Date(value);
	const getOperator = {
		y: 'getFullYear',
		M: 'getMonth',
		d: 'getDate',
		h: 'getHours',
		m: 'getMinutes',
		s: 'getSeconds',
		ms: 'getMilliseconds',
	};
	const setOperator = {
		y: 'setFullYear',
		M: 'setMonth',
		d: 'setDate',
		h: 'setHours',
		m: 'setMinutes',
		s: 'setSeconds',
		ms: 'setMilliseconds',
	};

	count += newValue[getOperator[unit]]();
	newValue[setOperator[unit]](count);
	return newValue;
}

export function getToday(): Date {
	const date = new Date();
	return toDateOnly(date);
}

export function toDateOnly(value: Date): Date {
	value.setHours(0, 0, 0, 0);
	return value;
}

export function isAfter(date1: Date, date2: Date): boolean {
	return date1?.getTime() > date2?.getTime();
}

export function isBefore(date1: Date, date2: Date): boolean {
	return date1?.getTime() < date2?.getTime();
}

export function isSameTime(date1: Date, date2: Date): boolean {
	if (date1 === date2) {
		return true;
	} else {
		return date1?.getTime() === date2?.getTime();
	}
}

export function isSameTimeOrAfter(date1: Date, date2: Date): boolean {
	return date1?.getTime() >= date2?.getTime();
}

export function isSameTimeOrBefore(date1: Date, date2: Date): boolean {
	return date1?.getTime() <= date2?.getTime();
}

export function isSameDay(date1: Date, date2: Date): boolean {
	if (date1 === date2) {
		return true;
	} else {
		const day1 = toDateOnly(new Date(date1));
		const day2 = toDateOnly(new Date(date2));
		return day1?.getTime() === day2?.getTime();
	}
}

export function isSameDayOrAfter(date1: Date, date2: Date): boolean {
	if (date1 === date2) {
		return true;
	} else {
		const day1 = toDateOnly(new Date(date1));
		const day2 = toDateOnly(new Date(date2));
		return day1?.getTime() >= day2?.getTime();
	}
}

export function isSameDayOrBefore(date1: Date, date2: Date): boolean {
	if (date1 === date2) {
		return true;
	} else {
		const day1 = toDateOnly(new Date(date1));
		const day2 = toDateOnly(new Date(date2));
		return day1?.getTime() <= day2?.getTime();
	}
}

/**
 * Returns which date it is closer to, 1 = date1; 2 = date2; 0 = same for both; -1 = invalid date
 * @param mainDate Main Date
 * @param date1 Date to compare 1
 * @param date2 Date to compare 2
 */
export function isCloserTo(mainDate: Date, date1: Date, date2: Date): number {
	mainDate = parseDateTime(mainDate, null);
	date1 = parseDateTime(date1, null);
	date2 = parseDateTime(date2, null);

	switch (true) {
		case mainDate === null || (date1 === null && date2 === null):
			return -1;

		case date1 === null:
			return 2;

		case date2 === null:
			return 1;

		case isSameTime(date1, date2):
			return 0;

		case Math.abs(date1.getTime() - mainDate.getTime()) >
			Math.abs(date2.getTime() - mainDate.getTime()):
			return 2;

		default:
			return 1;
	}
}
