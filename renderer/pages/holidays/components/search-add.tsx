import { useEffect } from 'react';
import { DateInput } from '../../../components/inputs/date-input';
import { Form } from '../../../components/inputs/form';
import { SelectInput } from '../../../components/inputs/select-input';
import { useFormContextWithId } from '../../../components/providers/form-providers';
import { SearchBar } from '../../../components/search-bar';
import { GeneralSearch } from '../../../components/searches/general-search';
import { getToday, removeTimezoneOffset } from '../../../utils/dateOperations';
import { tryParseInt } from '../../../utils/numberParsers';
import { BlueButtonClass } from '../../../utils/tailwindClass/button';
import { SearchBarButtons } from '../../../utils/types/search-bar-button';
import { periodOptions, searchDefaultValue, SearchFormId } from '../constants';
import { SearchDataType } from '../types';

type PropType = {
	setToggleModal: (value: boolean) => void;
};

export function HolidaysSearchAdd({ setToggleModal }: Readonly<PropType>) {
	const { formData, setFormData } = useFormContextWithId<SearchDataType>(SearchFormId);

	const buttons: SearchBarButtons = [
		{
			text: 'New Holiday',
			className: BlueButtonClass,
			onClick: () => setToggleModal(true),
		},
	];

	useEffect(() => {
		if (formData?.period?.value === null) {
			return;
		}

		if (formData?.period?.value === '') {
			setFormData({ path: 'start_date', value: null });
			setFormData({ path: 'end_date', value: null });
			return;
		}

		const firstDate = getToday();
		const secondDate = getToday();

		switch (formData?.period?.value) {
			case undefined:
			case null:
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
				if (tryParseInt(formData?.period?.value) > 0) {
					secondDate.setDate(secondDate.getDate() + tryParseInt(formData?.period?.value));
				} else {
					firstDate.setDate(firstDate.getDate() + tryParseInt(formData?.period?.value));
				}
		}

		setFormData({ path: 'start_date', value: removeTimezoneOffset(firstDate) });
		setFormData({ path: 'end_date', value: removeTimezoneOffset(secondDate) });
	}, [formData?.period?.value]);

	return (
		<SearchBar buttons={buttons}>
			<Form formId={SearchFormId} defaultValue={searchDefaultValue()}>
				<GeneralSearch />

				<DateInput id="start-date-search" label="From" name="start_date" leftLabel />

				<DateInput
					id="end-date-search"
					label="To"
					name="end_date"
					min={formData?.start_date?.value}
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
			</Form>
		</SearchBar>
	);
}
