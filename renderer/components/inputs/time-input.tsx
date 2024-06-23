import clsx from 'clsx';
import { kebabCase } from 'lodash';
import { useEffect, useState } from 'react';
import { dateFormatter, parseDateTime } from '../../utils/dateOperations';
import { ContainerFlexColGrow, ContainerFlexRowGrow } from '../../utils/tailwindClass/containers';
import {
	InvalidTextBoxClass,
	LabelLeftClass,
	LabelTopClass,
	TextBoxBottomClass,
	TextBoxRightClass,
} from '../../utils/tailwindClass/inputs';
import { useFormContext } from '../providers/form-providers';
import { RequiredIcon } from '../required';

type PropType = {
	id?: string;
	label: string;
	name: string;
	min?: Date;
	max?: Date;
	required?: boolean;
	leftLabel?: boolean;
};

export function TimeInput({ id, label, name, min, max, required, leftLabel }: Readonly<PropType>) {
	id = id ?? kebabCase(name);
	const containerClass = leftLabel ? ContainerFlexRowGrow : ContainerFlexColGrow;
	const labelClass = leftLabel ? LabelLeftClass : LabelTopClass;
	const inputClass = leftLabel ? TextBoxRightClass : TextBoxBottomClass;

	const { formData, setFormData } = useFormContext();
	const [input, setInput] = useState<string>('');

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ name, value: parseDateTime(e.target.value, null), valid: true });
		setInput(e.target.value);
	};

	useEffect(() => {
		const newData = dateFormatter(formData?.[name]?.value, { format: 'hh:mm' });
		if (newData !== input) {
			setInput(newData);
		}
	}, [formData?.[name]?.value]);

	return (
		<div className={containerClass}>
			<label htmlFor={id} className={labelClass}>
				{label}:<RequiredIcon required={required} />
			</label>

			<input
				type="time"
				id={id}
				name={name}
				value={input}
				onChange={onChange}
				min={dateFormatter(min, { format: 'hh:mm' })}
				max={dateFormatter(max, { format: 'hh:mm' })}
				required={required}
				className={clsx(inputClass, (formData[name]?.valid ?? true) || InvalidTextBoxClass)}
			/>
		</div>
	);
}
