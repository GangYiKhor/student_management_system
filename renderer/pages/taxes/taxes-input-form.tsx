import clsx from 'clsx';
import { DateInput } from '../../components/inputs/date-input';
import { useFormHandlerContext } from '../../components/inputs/form';
import { NumberInput } from '../../components/inputs/number-input';
import { SelectInput } from '../../components/inputs/select-input';
import Row from '../../components/row';
import Separator from '../../components/separator';

type PropType = {
	defaultValue?: {
		percentage?: number;
		start_date?: Date;
		end_date?: Date;
		inclusive?: boolean;
	};
};

export function TaxInputForm({ defaultValue }: Readonly<PropType>) {
	const { formData } = useFormHandlerContext();

	return (
		<div className={clsx('grid')}>
			<Row>
				<NumberInput
					id="percentage"
					label="Percentage"
					suffix="%"
					min={0}
					step={0.01}
					defaultValue={defaultValue?.percentage}
					required
				/>

				<SelectInput
					id="inclusive"
					label="Inclusive"
					placeholder="Select a status"
					options={[
						{ value: true, label: 'Yes' },
						{ value: false, label: 'No' },
					]}
					defaultValue={defaultValue?.inclusive}
					required
				/>
			</Row>

			<Separator />

			<Row>
				<DateInput
					label="Start Date"
					id="start_date"
					defaultValue={defaultValue?.start_date}
					required
				/>
				<DateInput
					label="End Date"
					id="end_date"
					defaultValue={defaultValue?.end_date}
					min={formData?.start_date?.value}
				/>
			</Row>
		</div>
	);
}
