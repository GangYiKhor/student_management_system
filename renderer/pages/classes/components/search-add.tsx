import clsx from 'clsx';
import { useEffect } from 'react';
import { NumberInput } from '../../../components/inputs/number-input';
import { SelectInput } from '../../../components/inputs/select-input';
import { useFormContext } from '../../../components/providers/form-providers';
import { GeneralSearch } from '../../../components/searches/general-search';
import { StatusSearch } from '../../../components/searches/status-search';
import { useGetOptions } from '../../../hooks/use-get';
import { BlueButtonClass } from '../../../utils/class/button';
import { StudentFormsGetDto } from '../../../utils/types/dtos/student-forms/get';
import { TeachersGetDto } from '../../../utils/types/dtos/teachers/get';
import { StudentFormsGetResponse } from '../../../utils/types/responses/student-forms/get';
import { TeachersGetResponse } from '../../../utils/types/responses/teachers/get';
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
	const getForms = useGetOptions<StudentFormsGetDto, StudentFormsGetResponse>(
		'/api/student-forms',
		value => value.form_name,
		value => value.id,
	);
	const getTeachers = useGetOptions<TeachersGetDto, TeachersGetResponse>(
		'/api/teachers',
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
		<div className={clsx('flex', 'justify-between')}>
			<div className={clsx('flex', 'flex-row', 'items-baseline')}>
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
			</div>

			<div className={clsx('flex', 'justify-end', 'gap-4', 'items-center')}>
				<button className={BlueButtonClass} onClick={() => setToggleModal(true)}>
					New Class
				</button>
			</div>
		</div>
	);
}
