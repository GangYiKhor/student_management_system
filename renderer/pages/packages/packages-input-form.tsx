import clsx from 'clsx';
import { DateInput } from '../../components/inputs/date-input';
import { useFormHandlerContext } from '../../components/inputs/form';
import { NumberInput } from '../../components/inputs/number-input';
import { SelectInput } from '../../components/inputs/select-input';
import Row from '../../components/row';
import Separator from '../../components/separator';
import { useCustomQuery } from '../../hooks/use-custom-query';
import { useGetFormOptionsIdOnly } from '../../hooks/use-get-form-options';
import { StudentFormsGetResponse } from '../../utils/types/responses/student-forms/get';
import { SelectOptions } from '../../utils/types/select-options';

type PropType = {
	defaultValue?: {
		form_id?: number;
		subject_count_from?: number;
		subject_count_to?: number;
		discount_per_subject?: number;
		start_date?: Date;
		end_date?: Date;
	};
};

export function PackagesInputForm({ defaultValue }: Readonly<PropType>) {
	const { formData } = useFormHandlerContext();

	// Fetch Options
	const getForms = useGetFormOptionsIdOnly();
	const { data: formOptions } = useCustomQuery<SelectOptions<StudentFormsGetResponse>>({
		queryKey: ['form-options'],
		queryFn: () => getForms({ is_active: true, orderBy: 'form_name asc' }),
	});

	return (
		<div className={clsx('grid')}>
			<SelectInput
				id="form_id"
				label="Form"
				defaultValue={defaultValue?.form_id}
				options={formOptions}
				required
			/>

			<Row>
				<NumberInput
					id="subject_count_from"
					label="Subject Count From"
					defaultValue={defaultValue?.subject_count_from}
					min={0}
					step={1}
					required
				/>
				<NumberInput
					id="subject_count_to"
					label="Subject Count To"
					defaultValue={defaultValue?.subject_count_to}
					min={formData?.subject_count_from?.value}
					step={1}
					required
				/>
			</Row>

			<NumberInput
				id="discount_per_subject"
				label="Discount Per Subject"
				defaultValue={defaultValue?.discount_per_subject}
				prefix="RM"
				min={0}
				step={0.01}
				required
			/>

			<Separator />

			<Row>
				<DateInput
					id="start_date"
					label="Start Date"
					defaultValue={defaultValue?.start_date}
					required
				/>
				<DateInput
					id="end_date"
					label="End Date"
					defaultValue={defaultValue?.end_date}
					min={formData?.start_date?.value}
				/>
			</Row>
		</div>
	);
}
