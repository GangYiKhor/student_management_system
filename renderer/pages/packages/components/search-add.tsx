import { useEffect } from 'react';
import { NumberInput } from '../../../components/inputs/number-input';
import { SelectInput } from '../../../components/inputs/select-input';
import { useFormContext } from '../../../components/providers/form-providers';
import { SearchBar } from '../../../components/search-bar';
import { GeneralSearch } from '../../../components/searches/general-search';
import { StatusSearch } from '../../../components/searches/status-search';
import { useGetFormOptions } from '../../../hooks/use-get-form-options';
import { BlueButtonClass } from '../../../utils/tailwindClass/button';
import { SearchBarButtons } from '../../../utils/types/search-bar-button';
import { SearchDataType } from '../types';

type PropType = {
	setSearch: (value: string) => void;
	setFormId: (value: number) => void;
	setSubjectCount: (value: number) => void;
	setIsActive: (value: boolean) => void;
	setToggleModal: (value: boolean) => void;
};

export function PackagesSearchAdd({
	setSearch,
	setFormId,
	setSubjectCount,
	setIsActive,
	setToggleModal,
}: Readonly<PropType>) {
	const { formData } = useFormContext<SearchDataType>();

	const buttons: SearchBarButtons = [
		{
			text: 'New Package',
			className: BlueButtonClass,
			onClick: () => setToggleModal(true),
		},
	];

	const getForms = useGetFormOptions();

	useEffect(() => {
		setSearch(formData.general?.value);
	}, [formData.general?.value]);

	useEffect(() => {
		setFormId(formData.form_id?.value);
	}, [formData.form_id?.value]);

	useEffect(() => {
		setSubjectCount(formData.subject_count?.value);
	}, [formData.subject_count?.value]);

	useEffect(() => {
		setIsActive(formData.status?.value);
	}, [formData.status?.value]);

	return (
		<SearchBar buttons={buttons}>
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
		</SearchBar>
	);
}
