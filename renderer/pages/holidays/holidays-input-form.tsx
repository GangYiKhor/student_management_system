import clsx from 'clsx';
import { DateInput } from '../../components/inputs/date-input';
import { TextInput } from '../../components/inputs/text-input';

type PropType = {
	defaultValue?: {
		date?: Date;
		description?: string;
	};
};

export function HolidaysInputForm({ defaultValue }: Readonly<PropType>) {
	return (
		<div className={clsx('grid')}>
			<DateInput id="date" label="Date" defaultValue={defaultValue?.date} required />

			<TextInput
				id="description"
				label="Description"
				defaultValue={defaultValue?.description}
				placeholder="E.g. Labour Day"
				maxLength={100}
				required
			/>
		</div>
	);
}
