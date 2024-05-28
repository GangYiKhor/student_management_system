import clsx from 'clsx';
import { useEffect } from 'react';
import { DateInput } from '../../../components/inputs/date-input';
import { SelectInput } from '../../../components/inputs/select-input';
import { useFormContext } from '../../../components/providers/form-providers';
import { GeneralSearch } from '../../../components/searches/general-search';
import { BlueButtonClass } from '../../../utils/class/button';
import { parseIntOrUndefined } from '../../../utils/parsers';
import { SearchDataType } from '../types';

const periodOptions = [
	{ value: 'last-month', label: 'Last Month' },
	{ value: 'this-month', label: 'This Month' },
	{ value: 'next-month', label: 'Next Month' },
	{ value: 'this-year', label: 'This Year' },
	{ value: 'next-year', label: 'Next Year' },
	{ value: '-7', label: 'Last 7 Days' },
	{ value: '-30', label: 'Last 30 Days' },
	{ value: '-90', label: 'Last 90 Days' },
	{ value: '7', label: 'Next 7 Days' },
	{ value: '30', label: 'Next 30 Days' },
	{ value: '90', label: 'Next 90 Days' },
];

type PropType = {
	setSearch: (value: string) => void;
	setStartDate: (value: Date) => void;
	setEndDate: (value: Date) => void;
	setToggleModal: (value: boolean) => void;
};

export function HolidaysSearchAdd({
	setSearch,
	setStartDate,
	setEndDate,
	setToggleModal,
}: Readonly<PropType>) {
	const { formData, setFormData } = useFormContext<SearchDataType>();

	useEffect(() => {
		setSearch(formData.general?.value);
	}, [formData.general?.value]);

	useEffect(() => {
		setStartDate(formData.start_date?.value);
	}, [formData.start_date?.value]);

	useEffect(() => {
		setEndDate(formData.end_date?.value);
	}, [formData.end_date?.value]);

	useEffect(() => {
		const firstDate = new Date();
		firstDate.setUTCHours(0, 0, 0, 0);
		const secondDate = new Date(firstDate);

		switch (formData.period?.value) {
			case '':
				setFormData({ name: 'start_date', value: undefined });
				setFormData({ name: 'end_date', value: undefined });
				return;

			case 'last-month':
				firstDate.setDate(0);
				firstDate.setDate(1);
				secondDate.setDate(0);
				break;

			case 'this-month':
				firstDate.setDate(1);
				secondDate.setDate(35);
				secondDate.setDate(0);
				break;

			case 'next-month':
				firstDate.setDate(35);
				firstDate.setDate(1);
				secondDate.setDate(70);
				secondDate.setDate(0);
				break;

			case 'this-year':
				firstDate.setMonth(0, 1);
				secondDate.setMonth(11, 31);
				break;

			case 'next-year':
				firstDate.setFullYear(firstDate.getFullYear() + 1, 0, 1);
				secondDate.setFullYear(secondDate.getFullYear() + 1, 11, 31);
				break;

			default:
				if (parseIntOrUndefined(formData.period?.value) > 0) {
					secondDate.setDate(secondDate.getDate() + parseIntOrUndefined(formData.period?.value));
				} else {
					firstDate.setDate(firstDate.getDate() + parseIntOrUndefined(formData.period?.value));
				}
		}

		setFormData({ name: 'start_date', value: firstDate });
		setFormData({ name: 'end_date', value: secondDate });
	}, [formData.period?.value]);

	return (
		<div className={clsx('flex', 'justify-between')}>
			<div className={clsx('flex', 'flex-row', 'items-baseline')}>
				<GeneralSearch />

				<DateInput id="start-date-search" label="From" name="start_date" leftLabel />

				<DateInput
					id="end-date-search"
					label="To"
					name="end_date"
					min={formData.start_date?.value}
					leftLabel
				/>

				<SelectInput
					id="period-search"
					label="Period"
					name="period"
					placeholder="All"
					options={periodOptions}
					leftLabel
				/>
			</div>

			<div className={clsx('flex', 'justify-end', 'gap-4', 'items-center')}>
				<button className={BlueButtonClass} onClick={() => setToggleModal(true)}>
					New Holiday
				</button>
			</div>
		</div>
	);
}
