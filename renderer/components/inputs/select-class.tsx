import { useEffect } from 'react';
import { useCustomQuery } from '../../hooks/use-custom-query';
import { useGetClassComboBoxOptions } from '../../hooks/use-get-class-options';
import { DAY } from '../../utils/constants/constants';
import { tryParseInt } from '../../utils/numberParsers';
import { ClassesGetResponses } from '../../utils/types/responses/classes/get';
import { ComboBox, DropDownColumnParser } from './combo-box';

const columnParsers: DropDownColumnParser<ClassesGetResponses[0]> = [
	{ column: 'class_name', parser: value => value.class_name },
	{
		column: 'form_name',
		parser: value => value.form.form_name,
	},
	{
		column: 'teacher_name',
		parser: value => value.teacher.teacher_name,
	},
	{ column: 'day', parser: value => DAY[value.day] },
];

type PropType = {
	id?: string;
	label?: string;
	name: string;
	form?: number | string;
	onUpdate?: () => any;
	options?: ClassesGetResponses;
	queryKey?: string;
	labelClassAddOn?: string;
	onlyId?: boolean;
	required?: boolean;
};

export function SelectClass({
	id,
	label,
	name,
	form,
	onUpdate,
	options,
	queryKey,
	labelClassAddOn,
	onlyId,
	required,
}: Readonly<PropType>) {
	const getClass = useGetClassComboBoxOptions();

	const { data, refetch } = useCustomQuery<ClassesGetResponses>({
		queryKey: ['classes', queryKey],
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
		<ComboBox
			id={id}
			label={label}
			name={name}
			options={options ?? data}
			columnParsers={columnParsers}
			valueParser={onlyId ? value => value?.id : undefined}
			labelColumn="class_name"
			onUpdate={onUpdate}
			required={required}
			leftLabel
			labelClassAddOn={labelClassAddOn}
		/>
	);
}
