import { kebabCase } from 'lodash';
import { TextInput } from '../inputs/text-input';

type PropType = {
	label?: string;
	name?: string;
	placeholder?: string;
};

export function GeneralSearch({
	label = 'Search',
	name = 'general',
	placeholder = 'Search... (#1 to search ID)',
}: Readonly<PropType>) {
	return (
		<TextInput
			id={`${kebabCase(label)}-search`}
			label={label}
			name={name}
			placeholder={placeholder}
			leftLabel
		/>
	);
}
