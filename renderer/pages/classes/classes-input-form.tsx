import clsx from 'clsx';
import { DateInput } from '../../components/inputs/date-input';
import { useFormHandlerContext } from '../../components/inputs/form';
import { NumberInput } from '../../components/inputs/number-input';
import { SelectInput } from '../../components/inputs/select-input';
import { TextInput } from '../../components/inputs/text-input';
import { TimeInput } from '../../components/inputs/time-input';
import Row from '../../components/row';
import Separator from '../../components/separator';
import { useCustomQuery } from '../../hooks/use-custom-query';
import { useGetOptions } from '../../hooks/use-get';
import { useGetFormOptionsIdOnly } from '../../hooks/use-get-form-options';
import { DAY_OPTIONS, TEACHER_API_PATH } from '../../utils/constants/constants';
import { TeachersGetDto } from '../../utils/types/dtos/teachers/get';
import { StudentFormsGetResponse } from '../../utils/types/responses/student-forms/get';
import { TeachersGetResponse } from '../../utils/types/responses/teachers/get';
import { SelectOptions } from '../../utils/types/select-options';

type PropType = {
	defaultValue?: {
		teacher_id?: number;
		start_date?: Date;
		end_date?: Date;
		class_year?: number;
		form_id?: number;
		day?: number;
		start_time?: Date;
		end_time?: Date;
		fees?: number;
		is_package?: boolean;
		class_name?: string;
	};
};

export function ClassesInputForm({ defaultValue }: Readonly<PropType>) {
	const { formData } = useFormHandlerContext();

	// Fetch Options
	const getForms = useGetFormOptionsIdOnly();
	const { data: formOptions } = useCustomQuery<SelectOptions<StudentFormsGetResponse>>({
		queryKey: ['form-options'],
		queryFn: () => getForms({ is_active: true, orderBy: 'form_name asc' }),
	});
	const getTeachers = useGetOptions<TeachersGetDto, TeachersGetResponse>(
		TEACHER_API_PATH,
		value => value.teacher_name,
		value => value.id,
	);
	const { data: teacherOptions } = useCustomQuery<SelectOptions<TeachersGetResponse>>({
		queryKey: ['teacher-options'],
		queryFn: () => getTeachers({ is_active: true, orderBy: 'teacher_name asc' }),
	});

	return (
		<div className={clsx('grid')}>
			<Row>
				<TextInput
					id="class_name"
					label="Class Name"
					defaultValue={defaultValue.class_name}
					placeholder="E.g. English"
					maxLength={50}
					required
				/>

				<SelectInput
					id="form_id"
					label="Form"
					defaultValue={defaultValue.form_id}
					options={formOptions}
					required
				/>
			</Row>

			<SelectInput
				id="teacher_id"
				label="Teacher"
				defaultValue={defaultValue.teacher_id}
				options={teacherOptions}
				required
			/>

			<Row>
				<NumberInput
					id="fees"
					label="Fees"
					defaultValue={defaultValue.fees}
					prefix="RM"
					min={0}
					step={0.01}
					required
				/>

				<SelectInput
					id="is_package"
					label="Package"
					defaultValue={defaultValue.is_package}
					options={[
						{ value: true, label: 'Yes' },
						{ value: false, label: 'No' },
					]}
					required
				/>
			</Row>

			<Separator />

			<Row>
				<NumberInput
					id="class_year"
					label="Year"
					defaultValue={defaultValue.class_year}
					min={2000}
					max={2200}
					step={1}
					required
				/>

				<DateInput
					id="start_date"
					label="Start Date"
					defaultValue={defaultValue.start_date}
					required
				/>
				<DateInput
					id="end_date"
					label="End Date"
					defaultValue={defaultValue.end_date}
					min={formData?.start_date?.value}
					minMaxInclusive
				/>
			</Row>

			<Row>
				<SelectInput
					id="day"
					label="Day"
					defaultValue={defaultValue.day}
					options={DAY_OPTIONS}
					required
				/>

				<TimeInput
					id="start_time"
					label="Start Time"
					defaultValue={defaultValue.start_time}
					required
				/>

				<TimeInput
					id="end_time"
					label="End Time"
					defaultValue={defaultValue.end_time}
					min={formData?.start_time?.value}
					required
				/>
			</Row>
		</div>
	);
}
