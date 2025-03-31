import { TextInput } from '../inputs/text-input';

type PropType = {
	id?: string;
	label?: string;
	placeholder?: string;
};

export function GeneralSearch({
	id = 'general',
	label = 'Search',
	placeholder = 'Search... (#1 to search ID)',
}: Readonly<PropType>) {
	return <TextInput id={id} label={label} name={label} placeholder={placeholder} leftLabel />;
}
