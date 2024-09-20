import { DateRangeInput } from '../../../components/inputs/date-range-input';
import { Form } from '../../../components/inputs/form';
import { NumberInput } from '../../../components/inputs/number-input';
import { SelectInput } from '../../../components/inputs/select-input';
import { TextInput } from '../../../components/inputs/text-input';
import { SearchBar } from '../../../components/search-bar';
import { StatusSearch } from '../../../components/searches/status-search';
import { useGetFormOptionsIdOnly } from '../../../hooks/use-get-form-options';
import { BlueButtonClass } from '../../../utils/tailwindClass/button';
import { SearchBarButtons } from '../../../utils/types/search-bar-button';
import { searchDefaultValue, SearchFormId } from '../constants';

type PropType = {
	setToggleModal: (value: boolean) => void;
};

export function StudentsSearchAdd({ setToggleModal }: Readonly<PropType>) {
	const buttons: SearchBarButtons = [
		{
			text: 'New Student',
			className: BlueButtonClass,
			onClick: () => setToggleModal(true),
		},
	];

	const getForms = useGetFormOptionsIdOnly();

	return (
		<SearchBar buttons={buttons}>
			<Form formId={SearchFormId} defaultValue={searchDefaultValue()}>
				<TextInput
					id="text-search"
					label="Search"
					name="text"
					placeholder="Search any details"
					leftLabel
				/>

				<SelectInput
					id="form-search"
					label="Form"
					name="form_id"
					placeholder="All"
					queryFn={() => getForms({ is_active: true, orderBy: 'form_name asc' })}
					leftLabel
				/>

				<DateRangeInput label="Reg" startName="reg_date_start" endName="reg_date_end" />

				<NumberInput
					id="year-search"
					label="Year"
					name="reg_year"
					min={1990}
					max={2200}
					step={1}
					leftLabel
				/>

				<StatusSearch />
			</Form>
		</SearchBar>
	);
}
