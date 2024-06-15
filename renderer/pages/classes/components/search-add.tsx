import { useEffect } from 'react';
import { NumberInput } from '../../../components/inputs/number-input';
import { SelectInput } from '../../../components/inputs/select-input';
import { useFormContext } from '../../../components/providers/form-providers';
import { SearchBar } from '../../../components/search-bar';
import { GeneralSearch } from '../../../components/searches/general-search';
import { StatusSearch } from '../../../components/searches/status-search';
import { useGetOptions } from '../../../hooks/use-get';
import { useGetFormOptions } from '../../../hooks/use-get-form-options';
import { TEACHER_API_PATH } from '../../../utils/constants/constants';
import { BlueButtonClass } from '../../../utils/tailwindClass/button';
import { TeachersGetDto } from '../../../utils/types/dtos/teachers/get';
import { TeachersGetResponse } from '../../../utils/types/responses/teachers/get';
import { SearchBarButtons } from '../../../utils/types/search-bar-button';
import { dayOptions } from '../constants';
import { SearchDataType } from '../types';

type PropType = {
	setSearch: (value: string) => void;
	setFormId: (value: number) => void;
	setTeacherId: (value: number) => void;
	setClassYear: (value: number) => void;
	setDay: (value: number) => void;
	setIsActive: (value: boolean) => void;
	setToggleModal: (value: boolean) => void;
};

export function ClassesSearchAdd({
	setSearch,
	setFormId,
	setTeacherId,
	setClassYear,
	setDay,
	setIsActive,
	setToggleModal,
}: Readonly<PropType>) {
	const { formData } = useFormContext<SearchDataType>();

	const buttons: SearchBarButtons = [
		{
			text: 'New Class',
			className: BlueButtonClass,
			onClick: () => setToggleModal(true),
		},
	];

	const getForms = useGetFormOptions();
	const getTeachers = useGetOptions<TeachersGetDto, TeachersGetResponse>(
		TEACHER_API_PATH,
		value => value.teacher_name,
		value => value.id,
	);

	useEffect(() => {
		setSearch(formData.general?.value);
	}, [formData.general?.value]);

	useEffect(() => {
		setFormId(formData.form_id?.value);
	}, [formData.form_id?.value]);

	useEffect(() => {
		setTeacherId(formData.teacher_id?.value);
	}, [formData.teacher_id?.value]);

	useEffect(() => {
		setClassYear(formData.class_year?.value);
	}, [formData.class_year?.value]);

	useEffect(() => {
		setDay(formData.day?.value);
	}, [formData.day?.value]);

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
				queryFn={() => getForms({ is_active: true, orderBy: 'form_name asc' })}
				leftLabel
			/>

			<SelectInput
				id="teacher-search"
				label="Teacher"
				name="teacher_id"
				queryFn={() => getTeachers({ is_active: true, orderBy: 'teacher_name asc' })}
				leftLabel
			/>

			<NumberInput
				id="year-search"
				label="Year"
				name="class_year"
				min={2000}
				max={2200}
				step={1}
				leftLabel
			/>

			<SelectInput id="day-search" label="Day" name="day" options={dayOptions} leftLabel />

			<StatusSearch />
		</SearchBar>
	);
}
