import clsx from 'clsx';
import { useEffect } from 'react';
import { ComboBox } from '../../components/inputs/combo-box';
import { DateInput } from '../../components/inputs/date-input';
import { useFormHandlerContext } from '../../components/inputs/form';
import { NumberInput } from '../../components/inputs/number-input';
import { SelectInput } from '../../components/inputs/select-input';
import { TextInput } from '../../components/inputs/text-input';
import Row from '../../components/row';
import Separator from '../../components/separator';
import { useCustomQuery } from '../../hooks/use-custom-query';
import { useGetStudentComboBoxOptionsIdOnly } from '../../hooks/use-get-student-options';
import { dateOperator } from '../../utils/dateOperations';
import { GrayInfoText } from '../../utils/tailwindClass/text';

type PropType = {
	defaultValue?: {
		id?: string;
		student_id?: number;
		discount?: number;
		is_percentage?: boolean;
		start_date?: Date;
		expired_at?: Date;
		used?: boolean;
		duration?: string;
	};
};

export function VouchersInputForm({ defaultValue }: Readonly<PropType>) {
	const { formData, updateFieldValue, updateFieldValid } = useFormHandlerContext();

	// Fetch Options
	const getStudents = useGetStudentComboBoxOptionsIdOnly();
	const { data: studentOptions } = useCustomQuery<{ id: number; student_name: string }[]>({
		queryKey: ['students'],
		queryFn: () => getStudents({ is_active: true, orderBy: 'student_name asc' }),
	});

	useEffect(() => {
		if (formData?.duration?.value && formData?.start_date?.value == undefined) {
			updateFieldValid([{ field: 'start_data', valid: false }]);
			return;
		}

		switch (formData?.duration?.value) {
			case '1W':
				updateFieldValue([
					{ field: 'expired_at', value: dateOperator(formData?.start_date?.value, 7, 'd') },
				]);
				break;

			case '3W':
				updateFieldValue([
					{ field: 'expired_at', value: dateOperator(formData?.start_date?.value, 21, 'd') },
				]);
				break;

			case '1M':
				updateFieldValue([
					{ field: 'expired_at', value: dateOperator(formData?.start_date?.value, 1, 'M') },
				]);
				break;

			case '3M':
				updateFieldValue([
					{ field: 'expired_at', value: dateOperator(formData?.start_date?.value, 3, 'M') },
				]);
				break;

			case '1Y':
				updateFieldValue([
					{ field: 'expired_at', value: dateOperator(formData?.start_date?.value, 1, 'y') },
				]);
				break;
		}
	}, [formData?.duration?.value]);

	return (
		<div className={clsx('grid')}>
			<Row>
				<TextInput
					id="id"
					label="Voucher ID"
					placeholder="Voucher123"
					maxLength={50}
					required
					locked={!!defaultValue?.id}
				/>

				<SelectInput
					id="used"
					label="Condition"
					placeholder=""
					options={[
						{ label: 'Used', value: true },
						{ label: 'Available', value: false },
					]}
					required
				/>
			</Row>

			<ComboBox
				id="student_id"
				label="For Student"
				placeholder="Everyone"
				columns={['id', 'student_name']}
				options={studentOptions}
				labelColumn="student_name"
				valueParser={value => value?.id}
			/>
			<span className={GrayInfoText}>
				If specify student, it can only be used by that student once
			</span>
			<br />

			<Row>
				<SelectInput
					id="is_percentage"
					label="Voucher Type"
					placeholder=""
					options={[
						{ label: 'Percentage (%)', value: true },
						{ label: 'Value (RM)', value: false },
					]}
					required
					locked={!!defaultValue?.is_percentage}
				/>

				<NumberInput
					id="discount"
					label="Discount"
					prefix={formData?.is_percentage?.value ? null : 'RM'}
					suffix={formData?.is_percentage?.value ? '%' : null}
					min={0}
					max={formData?.is_percentage?.value ? 100 : null}
					step={0.01}
					required
					locked={!!defaultValue?.discount}
				/>
			</Row>

			<Separator />

			<Row>
				<DateInput id="start_date" label="Start Date" required />
				<DateInput id="expired_at" label="Expiry Date" min={formData?.start_date?.value} required />
				<SelectInput
					id="duration"
					label="Duration"
					placeholder="Custom"
					options={[
						{ label: '1 Week', value: '1W' },
						{ label: '3 Weeks', value: '3W' },
						{ label: '1 Month', value: '1M' },
						{ label: '3 Month', value: '3M' },
						{ label: '1 Year', value: '1Y' },
					]}
				/>
			</Row>
		</div>
	);
}
