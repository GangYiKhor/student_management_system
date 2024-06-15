import { useEffect } from 'react';
import { useCustomQuery } from '../../hooks/use-custom-query';
import { useGetOptions } from '../../hooks/use-get';
import { CLASS_API_PATH } from '../../utils/constants/constants';
import { tryParseInt } from '../../utils/numberParsers';
import { ClassesGetDto } from '../../utils/types/dtos/classes/get';
import { ClassesGetResponse } from '../../utils/types/responses/classes/get';
import { SelectOptions } from '../../utils/types/select-options';
import { SelectInput } from './select-input';

type PropType = {
	id?: string;
	label?: string;
	name: string;
	form?: number | string;
	onlyId?: boolean;
	onUpdate?: () => any;
	labelClassAddOn?: string;
	options?: SelectOptions<ClassesGetResponse>;
};

export function SelectClass({
	id,
	label,
	name,
	form,
	onlyId,
	onUpdate,
	labelClassAddOn,
	options,
}: Readonly<PropType>) {
	const getClass = useGetOptions<ClassesGetDto, ClassesGetResponse>(
		CLASS_API_PATH,
		value => `${value.class_name} (${value.teacher.teacher_name})`,
		onlyId ? value => value.id : undefined,
	);

	const { data, refetch } = useCustomQuery<SelectOptions<ClassesGetResponse>>({
		queryKey: ['classes'],
		queryFn: () =>
			getClass({
				form_id: tryParseInt(form),
				is_active: true,
				orderBy: 'class_name asc',
			}),
		disabled: true,
	});

	useEffect(() => {
		if (!options) {
			refetch();
		}
	}, [form]);

	return (
		<SelectInput
			id={id}
			label={label}
			name={name}
			placeholder="Not Selected"
			options={options ?? data}
			onUpdate={onUpdate}
			leftLabel
			labelClassAddOn={labelClassAddOn}
		/>
	);
}
