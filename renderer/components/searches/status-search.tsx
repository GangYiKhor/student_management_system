import { kebabCase } from 'lodash';
import { SelectInput } from '../inputs/select-input';

type PropType = {
	label?: string;
	name?: string;
};

export function StatusSearch({ label = 'Status', name = 'status' }: Readonly<PropType>) {
	return (
		<SelectInput
			id={`${kebabCase(label)}-search`}
			label={label}
			name={name}
			placeholder="All"
			options={[
				{ label: 'Active', value: true },
				{ label: 'Inactive', value: false },
			]}
			leftLabel
		/>
	);
}
