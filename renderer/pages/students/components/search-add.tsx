import { useEffect } from 'react';
import { DateInput } from '../../../components/inputs/date-input';
import { NumberInput } from '../../../components/inputs/number-input';
import { SelectInput } from '../../../components/inputs/select-input';
import { TextInput } from '../../../components/inputs/text-input';
import { useFormContext } from '../../../components/providers/form-providers';
import { SearchBar } from '../../../components/search-bar';
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
	setRegDateStart: (value: Date) => void;
	setRegDateEnd: (value: Date) => void;
	setRegYear: (value: number) => void;
	setIsActive: (value: boolean) => void;
	setToggleModal: (value: boolean) => void;
};

export function StudentsSearchAdd({
	setSearch,
	setFormId,
	setRegDateStart,
	setRegDateEnd,
	setRegYear,
	setIsActive,
	setToggleModal,
}: Readonly<PropType>) {
	const { formData } = useFormContext<SearchDataType>();

	const buttons: SearchBarButtons = [
		{
			text: 'New Student',
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
		setSearch(formData.text?.value);
	}, [formData.text?.value]);

	useEffect(() => {
		setFormId(formData.form_id?.value);
	}, [formData.form_id?.value]);

	useEffect(() => {
		setRegDateStart(formData.reg_date_start?.value);
	}, [formData.reg_date_start?.value]);

	useEffect(() => {
		setRegDateEnd(formData.reg_date_end?.value);
	}, [formData.reg_date_end?.value]);

	useEffect(() => {
		setRegYear(formData.reg_year?.value);
	}, [formData.reg_year?.value]);

	useEffect(() => {
		setIsActive(formData.status?.value);
	}, [formData.status?.value]);

	return (
		<SearchBar buttons={buttons}>
			<TextInput
				id="text-search"
				label="Search"
				name="search"
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

			<DateInput id="reg-date-start-search" label="Reg From" name="reg_date_start" leftLabel />
			<DateInput
				id="reg-date-end-search"
				label="To"
				name="reg_date_end"
				min={formData.reg_date_start?.value}
				leftLabel
			/>
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
		</SearchBar>
	);
}
