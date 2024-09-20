import { Form } from '../../../components/inputs/form';
import { SearchBar } from '../../../components/search-bar';
import { GeneralSearch } from '../../../components/searches/general-search';
import { StatusSearch } from '../../../components/searches/status-search';
import { BlueButtonClass } from '../../../utils/tailwindClass/button';
import { SearchBarButtons } from '../../../utils/types/search-bar-button';
import { searchDefaultValue, SearchFormId } from '../constants';

type PropType = {
	setToggleModal: (value: boolean) => void;
};

export function StudentFormsSearchAdd({ setToggleModal }: Readonly<PropType>) {
	const buttons: SearchBarButtons = [
		{
			text: 'New Form',
			className: BlueButtonClass,
			onClick: () => setToggleModal(true),
		},
	];

	return (
		<SearchBar buttons={buttons}>
			<Form formId={SearchFormId} defaultValue={searchDefaultValue()}>
				<GeneralSearch />
				<StatusSearch />
			</Form>
		</SearchBar>
	);
}
