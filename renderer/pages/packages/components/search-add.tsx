import { Form } from '../../../components/inputs/form';
import { NumberInput } from '../../../components/inputs/number-input';
import { SelectInput } from '../../../components/inputs/select-input';
import { SearchBar } from '../../../components/search-bar';
import { GeneralSearch } from '../../../components/searches/general-search';
import { StatusSearch } from '../../../components/searches/status-search';
import { useGetFormOptionsIdOnly } from '../../../hooks/use-get-form-options';
import { BlueButtonClass } from '../../../utils/tailwindClass/button';
import { SearchBarButtons } from '../../../utils/types/search-bar-button';
import { searchDefaultValue, SearchFormId } from '../constants';

type PropType = {
	setToggleModal: (value: boolean) => void;
};

export function PackagesSearchAdd({ setToggleModal }: Readonly<PropType>) {
	const buttons: SearchBarButtons = [
		{
			text: 'New Package',
			className: BlueButtonClass,
			onClick: () => setToggleModal(true),
		},
	];

	const getForms = useGetFormOptionsIdOnly();

	return (
		<SearchBar buttons={buttons}>
			<Form formId={SearchFormId} defaultValue={searchDefaultValue()}>
				<GeneralSearch />
				<SelectInput
					id="form-search"
					label="Form"
					name="form_id"
					placeholder="All"
					queryFn={() => getForms({ is_active: true, orderBy: 'form_name asc' })}
					leftLabel
				/>
				<NumberInput label="Count" name="subject_count" min={0} step={1} leftLabel />
				<StatusSearch />
			</Form>
		</SearchBar>
	);
}
