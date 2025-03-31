import clsx from 'clsx';
import { ChevronLeft, ChevronRight, Minus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MONTH_SHORT } from '../../utils/constants/constants';
import {
	dateFormatter,
	dateOperator,
	isCloserTo,
	isDayAfter,
	isDayBefore,
	isSameDay,
	isSameDayOrAfter,
	isSameDayOrBefore,
	parseDateTime,
	removeTimezoneOffset,
} from '../../utils/dateOperations';
import { EmptyLightButtonClass } from '../../utils/tailwindClass/button';
import { CloseButtonIcon } from '../close-button-icon';
import { RequiredIcon } from '../required';
import { useFormHandlerContext } from './form';
import { ContainerFlexRowGrow, InvalidTextBoxClass, TextBoxClass } from './input-css';

const containerClass = clsx('flex flex-row flex-1 gap-2 items-center');
const popupClass = clsx(
	'absolute z-50 left-0 top-9',
	'bg-white dark:bg-black',
	'shadow-sm shadow-current',
	'p-4',
);
const calendarSplitClass = clsx('flex gap-6 items-start');
const nextMonthClass = clsx(
	'p-0.5',
	'hover:bg-gray-200 dark:hover:bg-gray-700',
	'active:bg-gray-300 dark:active:bg-gray-600',
	'rounded-full',
);
const nextMonthDisabledClass = clsx('p-0.5', 'opacity-30');
const calendarClass = clsx('flex flex-col flex-grow gap-1 justify-center', 'text-center');
const calendarDateDisabledClass = clsx('w-8 h-8 p-1', 'invisible', 'select-none');
const calendarDateClass = clsx(
	'w-8 h-8 p-1',
	'enabled:hover:bg-indigo-300 enabled:dark:hover:bg-indigo-700',
	'enabled:active:bg-indigo-400 enabled:dark:active:bg-indigo-600',
	'rounded-full',
	'select-none',
);
const selectedDateClass = clsx('bg-indigo-200 dark:bg-indigo-900');
const selectedRangeClass = clsx('bg-indigo-50 dark:bg-indigo-950');
const dateInputClass = clsx(
	'flex-1',
	'min-w-[120px]',
	'border-b-2 border-gray-400 rounded-t-sm',
	'hover:bg-zinc-200 dark:hover:bg-zinc-700',
	'active:bg-zinc-300 dark:active:bg-zinc-600',
	'text-center',
);
const disabledDateInputClass = clsx(
	'flex-1',
	'min-w-[120px]',
	'border-b-2 border-gray-400 rounded-t-sm',
	'text-gray-600 dark:text-gray-400',
	'hover:cursor-default',
	'text-center',
);

type PropType = {
	startId: string;
	endId: string;
	label: string;
	startName?: string;
	endName?: string;
	defaultStart?: Date;
	defaultEnd?: Date;
	min?: Date;
	max?: Date;
	required?: boolean;
	locked?: boolean;
};

export function DateRangeInput({
	startId,
	endId,
	label,
	startName,
	endName,
	defaultStart = null,
	defaultEnd = null,
	min,
	max,
	required,
	locked,
}: Readonly<PropType>) {
	const {
		formData,
		initialiseForm,
		updateFieldProperties,
		updateFieldValue,
		formInitialised,
		formLocked,
		keepData,
		keepDefault,
	} = useFormHandlerContext();
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [startDate, setStartDate] = useState<Date>(defaultStart);
	const [endDate, setEndDate] = useState<Date>(defaultEnd);
	locked ||= formLocked;
	startName ??= label;
	endName ??= label;

	const onClick = () => {
		setShowDatePicker(!showDatePicker);
	};

	const onSelectDate = (value: Date) => {
		if (locked) return;

		value = removeTimezoneOffset(value);
		const updateStart = () => {
			setStartDate(value);
			updateFieldValue([{ field: startId, value }]);
		};
		const updateEnd = () => {
			setEndDate(value);
			updateFieldValue([{ field: endId, value }]);
		};

		if (!startDate) updateStart();
		else if (!endDate || isCloserTo(value, startDate, endDate) === 2) updateEnd();
		else updateStart();
	};

	const onClear = () => {
		if (locked) return;

		setStartDate(null);
		setEndDate(null);
		updateFieldValue([
			{ field: startId, value: null },
			{ field: endId, value: null },
		]);
	};

	const onClose = () => {
		setShowDatePicker(false);
	};

	useEffect(() => {
		setStartDate(formData?.[startId]?.value);
	}, [formData?.[startId]?.value]);

	useEffect(() => {
		setEndDate(formData?.[endId]?.value);
	}, [formData?.[endId]?.value]);

	// Field Settings
	useEffect(() => {
		if (formInitialised) {
			updateFieldProperties([
				{ field: startId, required },
				{ field: endId, required },
			]);
		}
	}, [required]);

	useEffect(() => {
		if (formInitialised) {
			if (!keepData || formData?.[startId] || !formData?.[endId]) {
				initialiseForm([
					{ field: startId, value: defaultStart, name: startName, required },
					{ field: endId, value: defaultEnd, name: endName, required },
				]);
			} else {
				setStartDate(formData?.[startId]?.value);
				setEndDate(formData?.[endId]?.value);
				if (!keepDefault) {
					updateFieldProperties([
						{ field: startId, initialValue: defaultStart, required },
						{ field: endId, initialValue: defaultEnd, required },
					]);
				}
			}
		}
	}, [formInitialised]);

	return (
		<div className={clsx(containerClass)}>
			<p>
				{label}:<RequiredIcon required={required} />
			</p>

			<div
				className={clsx(
					ContainerFlexRowGrow,
					TextBoxClass,
					(formData?.[startId]?.valid === false || formData?.[endId]?.valid === false) &&
						InvalidTextBoxClass,
					locked && clsx('bg-gray-200', 'dark:bg-gray-700'),
					'gap-2',
					'relative',
				)}
			>
				<button className={locked ? disabledDateInputClass : dateInputClass} onClick={onClick}>
					{dateFormatter(startDate, { defaultValue: 'yyyy-MM-dd' })}
				</button>

				<Minus width={10} />

				<button className={locked ? disabledDateInputClass : dateInputClass} onClick={onClick}>
					{dateFormatter(endDate, { defaultValue: 'yyyy-MM-dd' })}
				</button>

				{!locked ? (
					<button onClick={onClear}>
						<CloseButtonIcon />
					</button>
				) : null}

				{showDatePicker ? (
					<CalendarPicker
						startDate={startDate}
						endDate={endDate}
						min={min}
						max={max}
						onSelect={onSelectDate}
						onClose={onClose}
						onClear={onClear}
						locked={locked}
					/>
				) : null}
			</div>
		</div>
	);
}

type CalendarPickerPropType = {
	startDate?: Date;
	endDate?: Date;
	onSelect: (value: Date) => void;
	onClose: () => void;
	onClear: () => void;
	min?: Date;
	max?: Date;
	locked?: boolean;
};

function CalendarPicker({
	startDate,
	endDate,
	onSelect,
	onClose,
	onClear,
	min,
	max,
	locked,
}: Readonly<CalendarPickerPropType>) {
	const curDate = startDate ?? endDate ?? new Date();
	const [startMonth, setStartMonth] = useState(curDate.getMonth());
	const [endMonth, setEndMonth] = useState((curDate.getMonth() + 1) % 12);
	const [startYear, setStartYear] = useState(curDate.getFullYear());
	const [endYear, setEndYear] = useState(
		curDate.getMonth() < 11 ? curDate.getFullYear() : curDate.getFullYear() + 1,
	);
	const [calendar1Dates, setCalendar1Dates] = useState<Date[][]>([]);
	const [calendar2Dates, setCalendar2Dates] = useState<Date[][]>([]);

	if (locked) {
		min = dateOperator(startDate, -1, 'M');
		min.setDate(1);
		max = dateOperator(endDate, 1, 'M');
		max.setDate(32);
		max.setDate(0);
	}

	const generateCalendar = (month: number, year: number): Date[][] => {
		const firstDate = new Date(year, month, 1);
		let extraBefore = firstDate.getDay();
		extraBefore = extraBefore === 0 ? 6 : extraBefore - 1;
		const startingDate = dateOperator(firstDate, -extraBefore, 'd');

		const dates: Date[][] = [];
		let curDate = parseDateTime(startingDate);
		const maxRows = 6;
		for (let row = 0; row < maxRows; row++) {
			const curWeek: Date[] = [];
			for (let i = 0; i < 7; i++) {
				curWeek.push(curDate);
				curDate = dateOperator(curDate, 1, 'd');
			}
			dates.push(curWeek);
		}
		return dates;
	};

	const prevMonth = () => {
		if (prevDisabled) return;
		setStartMonth((startMonth + 12 - 1) % 12); // Add 12 in case moved to last year
		setEndMonth((startMonth + 12) % 12);
		if ((startMonth + 12 - 1) % 12 == 11) {
			setStartYear(startYear - 1);
		} else if ((startMonth + 12) % 12 == 11) {
			setEndYear(endYear - 1);
		}
	};

	const nextMonth = () => {
		if (nextDisabled) return;
		setStartMonth((startMonth + 1) % 12);
		setEndMonth((startMonth + 2) % 12);
		if ((startMonth + 1) % 12 == 0) {
			setStartYear(startYear + 1);
		} else if ((startMonth + 2) % 12 == 0) {
			setEndYear(endYear + 1);
		}
	};

	const isDisabled = (value: Date) => isDayBefore(value, min) || isDayAfter(value, max);
	const isSelected = (value: Date) => isSameDay(value, startDate) || isSameDay(value, endDate);
	const isSelectedRange = (value: Date) =>
		isSameDayOrAfter(value, startDate) && isSameDayOrBefore(value, endDate);
	const isNotCurrentMonth = (value: Date, month: number) => value.getMonth() !== month;
	const prevDisabled = startMonth <= min?.getMonth() && startYear <= min?.getFullYear();
	const nextDisabled = endMonth >= max?.getMonth() && endYear >= max?.getFullYear();

	useEffect(() => {
		setCalendar1Dates(generateCalendar(startMonth, startYear));
		setCalendar2Dates(generateCalendar(endMonth, endYear));
	}, [startMonth, endMonth, startYear, endYear]);

	return (
		<div className={popupClass}>
			<div className={clsx('flex', 'justify-end')}>
				<button
					className={prevDisabled ? nextMonthDisabledClass : nextMonthClass}
					onClick={prevMonth}
					disabled={prevDisabled}
				>
					<ChevronLeft />
				</button>

				<button
					className={nextDisabled ? nextMonthDisabledClass : nextMonthClass}
					onClick={nextMonth}
					disabled={nextDisabled}
				>
					<ChevronRight />
				</button>

				<button onClick={onClose}>
					<CloseButtonIcon />
				</button>
			</div>

			<div className={calendarSplitClass}>
				{[
					{ year: startYear, month: startMonth, dates: calendar1Dates },
					{ year: endYear, month: endMonth, dates: calendar2Dates },
				].map(({ year, month, dates }) => (
					<div className={calendarClass} key={`${month}${year}`}>
						<p className="select-none">{`${MONTH_SHORT[month]} ${year}`}</p>

						<table>
							<thead>
								<tr className={clsx('border-b-2 border-black dark:border-white')}>
									<th>Mo</th>
									<th>Tu</th>
									<th>We</th>
									<th>Th</th>
									<th>Fr</th>
									<th>Sa</th>
									<th>Su</th>
								</tr>
							</thead>
							<tbody>
								{dates.map((value, index) => (
									<tr key={`${month}-week${index}`}>
										{value.map(value => (
											<td
												key={`${value.getMonth()}-${value.getDate()}`}
												className={clsx(
													isSelectedRange(value) && selectedRangeClass,
													isSameDay(value, startDate) && 'rounded-l-full',
													isSameDay(value, endDate) && 'rounded-r-full',
												)}
											>
												<button
													className={clsx(
														isDisabled(value) ? calendarDateDisabledClass : calendarDateClass,
														isSelected(value) && selectedDateClass,
														isNotCurrentMonth(value, month) && 'opacity-40',
													)}
													disabled={locked || isDisabled(value)}
													onClick={locked || isDisabled(value) ? () => {} : () => onSelect?.(value)} // NOSONAR
												>
													{value.getDate()}
												</button>
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				))}
			</div>

			{!locked ? (
				<div className={clsx('flex justify-end', 'mt-1')}>
					<button
						className={clsx('underline', 'px-2 py-1', 'rounded-md', EmptyLightButtonClass)}
						onClick={onClear}
					>
						Clear
					</button>
				</div>
			) : null}
		</div>
	);
}
