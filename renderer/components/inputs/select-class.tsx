import { useGetOptions } from '../../hooks/use-get';
import { parseIntOrUndefined } from '../../utils/parsers';
import { ClassesGetDto } from '../../utils/types/dtos/classes/get';
import { ClassesGetResponse } from '../../utils/types/responses/classes/get';
import { SelectInput } from './select-input';

type PropType = {
	id?: string;
	label?: string;
	name: string;
	form?: number | string;
	onlyId?: boolean;
	onUpdate?: () => any;
};

export function SelectClass({ id, label, name, form, onlyId, onUpdate }: Readonly<PropType>) {
	const getClass = useGetOptions<ClassesGetDto, ClassesGetResponse>(
		'/api/classes',
		value => value.class_name,
		onlyId ? value => value.id : undefined,
	);

	const queryFn = () =>
		getClass({
			form_id: typeof form === 'number' ? form : parseIntOrUndefined(form),
			is_active: true,
			orderBy: 'class_name asc',
		});

	return (
		<SelectInput
			id={id}
			label={label}
			name={name}
			placeholder="Not Selected"
			queryFn={queryFn}
			onUpdate={onUpdate}
			leftLabel
		/>
	);
}
