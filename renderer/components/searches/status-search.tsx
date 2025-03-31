import { SelectInput } from '../inputs/select-input';

type PropType = {
	id?: string;
	label?: string;
	defaultValue?: boolean;
};

export function StatusSearch({
	id = 'status',
	label = 'Status',
	defaultValue = true,
}: Readonly<PropType>) {
	return (
		<SelectInput
			id={id}
			label={label}
			name={label}
			placeholder="All"
			defaultValue={defaultValue}
			options={[
				{ label: 'Active', value: true },
				{ label: 'Inactive', value: false },
			]}
			leftLabel
		/>
	);
}
