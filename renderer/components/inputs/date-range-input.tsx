import clsx from 'clsx';
import { ChevronLeft, ChevronRight, Minus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MONTH_SHORT } from '../../utils/constants/constants';
import {
	dateFormatter,
	dateOperator,
	isAfter,
	isBefore,
	isCloserTo,
	isSameDay,
	isSameDayOrAfter,
	isSameDayOrBefore,
	parseDateTime,
	removeTimezoneOffset,
} from '../../utils/dateOperations';
import { EmptyLightButtonClass } from '../../utils/tailwindClass/button';
import { ContainerFlexRowGrow } from '../../utils/tailwindClass/containers';
import { TextBoxClass } from '../../utils/tailwindClass/inputs';
import { GrayText } from '../../utils/tailwindClass/text';
import { CloseButtonIcon } from '../close-button-icon';
import { RequiredIcon } from '../required';
import { useFormHandlerContext } from './form';

const containerClass = clsx(ContainerFlexRowGrow, 'gap-2', 'items-center');

const popupClass = clsx(
	'absolute',
	'z-50',
	'left-0',
	'top-9',
	'p-4',
	'bg-white',
	'dark:bg-black',
	'shadow-sm',
	'shadow-current',
);

const calendarSplitClass = clsx('flex', 'gap-6', 'items-start');

const nextMonthClass = clsx(
	'p-0.5',
	'hover:bg-gray-200',
	'dark:hover:bg-gray-700',
	'active:bg-gray-300',
	'dark:active:bg-gray-600',
	'rounded-full',
);

const nextMonthDisabledClass = clsx('p-0.5', GrayText);

const calendarClass = clsx(
	'flex-grow',
	'flex',
	'flex-col',
	'gap-4',
	'justify-center',
	'text-center',
);

const calendarDateDisabledClass = clsx('p-1', 'w-8', 'h-8', 'invisible', 'select-none');

const calendarDateClass = clsx(
	'p-1',
	'w-8',
	'h-8',
	'enabled:hover:bg-indigo-300',
	'enabled:dark:hover:bg-indigo-700',
	'enabled:active:bg-indigo-400',
	'enabled:dark:active:bg-indigo-600',
	'select-none',
	'rounded-full',
);

const selectedDateClass = clsx('bg-indigo-200', 'dark:bg-indigo-900');
const selectedRangeClass = clsx('bg-indigo-50', 'dark:bg-indigo-950');

const dateInputClass = clsx(
	'flex-1',
	'text-center',
	'min-w-[120px]',
	'border-b-2',
	'border-gray-400',
	'hover:bg-zinc-200',
	'active:bg-zinc-300',
	'dark:hover:bg-zinc-700',
	'dark:active:bg-zinc-600',
	'rounded-t-sm',
);

const disabledDateInputClass = clsx(
	'flex-1',
	'text-center',
	'min-w-[120px]',
	'border-b-2',
	'border-gray-400',
	'rounded-t-sm',
	'text-gray-600',
	'dark:text-gray-400',
	'hover:cursor-default',
);

type PropType = {
	label: string;
	startName: string;
	endName: string;
	min?: Date;
	max?: Date;
	required?: boolean;
	locked?: boolean;
};

export function DateRangeInput({
	label,
	startName,
	endName,
	min,
	max,
	required,
	locked,
}: Readonly<PropType>) {
	const { formData, setFormData } = useFormHandlerContext();
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [startDate, setStartDate] = useState<Date>(null);
	const [endDate, setEndDate] = useState<Date>(null);

	const onClick = () => {
		setShowDatePicker(!showDatePicker);
	};

	const onSelectDate = (value: Date) => {
		value = removeTimezoneOffset(value);

		const updateStart = () => {
			setStartDate(value);
			setFormData({ path: startName, value });
		};
		const updateEnd = () => {
			setEndDate(value);
			setFormData({ path: endName, value });
		};

		if (!startDate) {
			updateStart();
		} else if (!endDate || isCloserTo(value, startDate, endDate) === 2) {
			updateEnd();
		} else {
			updateStart();
		}
	};

	const onClear = () => {
		setStartDate(null);
		setEndDate(null);
		setFormData({ path: startName, value: null });
		setFormData({ path: endName, value: null });
	};

	const onClose = () => {
		setShowDatePicker(false);
	};

	useEffect(() => {
		setStartDate(formData?.[startName]?.value);
	}, [formData?.[startName]?.value]);

	useEffect(() => {
		setEndDate(formData?.[endName]?.value);
	}, [formData?.[endName]?.value]);

	return (
		<div className={clsx(containerClass)}>
			<p>
				{label}:<RequiredIcon required={required} />
			</p>

			<div
				className={clsx(
					ContainerFlexRowGrow,
					TextBoxClass,
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
						onSelect={locked ? () => {} : onSelectDate}
						onClose={onClose}
						onClear={locked ? () => {} : onClear}
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
	onSelect?: (value: Date) => void;
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
	const [startMonth, setStartMonth] = useState((startDate ?? endDate ?? new Date()).getMonth());
	const [endMonth, setEndMonth] = useState(
		((startDate ?? endDate ?? new Date()).getMonth() + 1) % 12,
	);
	const [startYear, setStartYear] = useState((startDate ?? endDate ?? new Date()).getFullYear());
	const [endYear, setEndYear] = useState(
		(startDate ?? endDate ?? new Date()).getMonth() < 11
			? (startDate ?? endDate ?? new Date()).getFullYear()
			: (startDate ?? endDate ?? new Date()).getFullYear() + 1,
	);
	const [calendar1Dates, setCalendar1Dates] = useState<Date[][]>([]);
	const [calendar2Dates, setCalendar2Dates] = useState<Date[][]>([]);

	const generateCalendar = (month: number, year: number): Date[][] => {
		const firstDate = new Date(year, month, 1);
		const lastDate = new Date(year, month, 32);
		lastDate.setDate(0);

		const extraBefore = firstDate.getDay() - 1;
		const extraAfter = lastDate.getDay() > 1 ? 7 - lastDate.getDay() : lastDate.getDay();

		const startingDate = dateOperator(firstDate, -extraBefore, 'd');
		const endingDate = dateOperator(lastDate, extraAfter, 'd');

		const dates: Date[][] = [];
		let curDate = parseDateTime(startingDate);
		while (isSameDayOrBefore(curDate, endingDate)) {
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
		setStartMonth((startMonth + 12 - 1) % 12);
		setEndMonth((startMonth + 12) % 12);
		if ((startMonth + 12 - 1) % 12 == 11) {
			setStartYear(startYear - 1);
		} else if ((startMonth + 12) % 12 == 11) {
			setEndYear(endYear - 1);
		}
	};

	const nextMonth = () => {
		setStartMonth((startMonth + 1) % 12);
		setEndMonth((startMonth + 2) % 12);
		if ((startMonth + 1) % 12 == 0) {
			setStartYear(startYear + 1);
		} else if ((startMonth + 2) % 12 == 0) {
			setEndYear(endYear + 1);
		}
	};

	useEffect(() => {
		setCalendar1Dates(generateCalendar(startMonth, startYear));
		setCalendar2Dates(generateCalendar(endMonth, endYear));
	}, [startMonth, endMonth, startYear, endYear]);

	return (
		<div className={popupClass}>
			<div className={clsx('flex', 'justify-end')}>
				<button
					className={startMonth <= min?.getMonth() ? nextMonthDisabledClass : nextMonthClass}
					onClick={() => prevMonth()}
					disabled={startMonth <= min?.getMonth()}
				>
					<ChevronLeft />
				</button>

				<button
					className={endMonth >= max?.getMonth() ? nextMonthDisabledClass : nextMonthClass}
					onClick={() => nextMonth()}
					disabled={endMonth >= max?.getMonth()}
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
							<tbody>
								{dates.map((value, index) => (
									<tr key={`${value?.[0]?.getMonth()}-week${index + 1}`}>
										{value.map(value => (
											<td
												key={`${value.getMonth()}-${value.getDate()}`}
												className={clsx(
													isSameDayOrAfter(value, startDate) && isSameDayOrBefore(value, endDate)
														? selectedRangeClass
														: null,
													isSameDay(value, startDate) ? 'rounded-l-full' : null,
													isSameDay(value, endDate) ? 'rounded-r-full' : null,
												)}
											>
												<button
													className={clsx(
														isBefore(value, min) || isAfter(value, max)
															? calendarDateDisabledClass
															: calendarDateClass,
														isSameDay(value, startDate) || isSameDay(value, endDate)
															? selectedDateClass
															: null,
														value.getMonth() !== month ? GrayText : null,
													)}
													disabled={locked || isBefore(value, min) || isAfter(value, max)}
													onClick={() => onSelect?.(value) /* NOSONAR */}
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
				<div className={clsx('flex', 'justify-end', 'mt-1')}>
					<button
						className={clsx('underline', 'px-2', 'py-1', 'rounded-md', EmptyLightButtonClass)}
						onClick={() => onClear()}
					>
						Clear
					</button>
				</div>
			) : null}
		</div>
	);
}
