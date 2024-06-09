import { useEffect } from 'react';
import { NumberInput } from '../../../components/inputs/number-input';
import { SelectInput } from '../../../components/inputs/select-input';
import { useFormContext } from '../../../components/providers/form-providers';
import { SearchBar } from '../../../components/search-bar';
import { GeneralSearch } from '../../../components/searches/general-search';
import { StatusSearch } from '../../../components/searches/status-search';
import { useGetOptions } from '../../../hooks/use-get';
import { STUDENT_FORM_API_PATH } from '../../../utils/constants/constants';
import { BlueButtonClass } from '../../../utils/tailwindClass/button';
import { StudentFormsGetDto } from '../../../utils/types/dtos/student-forms/get';
import { StudentFormsGetResponse } from '../../../utils/types/responses/student-forms/get';
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

	const getForms = useGetOptions<StudentFormsGetDto, StudentFormsGetResponse>(
		STUDENT_FORM_API_PATH,
		value => value.form_name,
		value => value.id,
	);

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
