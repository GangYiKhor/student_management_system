import { useEffect } from 'react';
import { DateInput } from '../../../components/inputs/date-input';
import { SelectInput } from '../../../components/inputs/select-input';
import { useFormContext } from '../../../components/providers/form-providers';
import { SearchBar } from '../../../components/search-bar';
import { GeneralSearch } from '../../../components/searches/general-search';
import { getToday } from '../../../utils/dateOperations';
import { tryParseInt } from '../../../utils/numberParsers';
import { BlueButtonClass } from '../../../utils/tailwindClass/button';
import { SearchBarButtons } from '../../../utils/types/search-bar-button';
import { periodOptions } from '../constants';
import { SearchDataType } from '../types';

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

	const buttons: SearchBarButtons = [
		{
			text: 'New Holiday',
			className: BlueButtonClass,
			onClick: () => setToggleModal(true),
		},
	];

	useEffect(() => {
		setSearch(formData.general?.value);
	}, [formData.general?.value]);

	useEffect(() => {
		if (formData.period?.value === null) {
			return;
		}

		if (formData.period?.value === '') {
			setFormData({ name: 'start_date', value: null });
			setFormData({ name: 'end_date', value: null });
			return;
		}

		const firstDate = getToday();
		const secondDate = getToday();

		switch (formData.period?.value) {
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
				if (tryParseInt(formData.period?.value) > 0) {
					secondDate.setDate(secondDate.getDate() + tryParseInt(formData.period?.value));
				} else {
					firstDate.setDate(firstDate.getDate() + tryParseInt(formData.period?.value));
				}
		}

		setFormData({ name: 'start_date', value: firstDate });
		setFormData({ name: 'end_date', value: secondDate });
	}, [formData.period?.value]);

	useEffect(() => {
		setStartDate(formData.start_date?.value);
	}, [formData.start_date?.value]);

	useEffect(() => {
		setEndDate(formData.end_date?.value);
	}, [formData.end_date?.value]);

	return (
		<SearchBar buttons={buttons}>
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
				placeholderValue=""
				options={periodOptions}
				leftLabel
			/>
		</SearchBar>
	);
}
