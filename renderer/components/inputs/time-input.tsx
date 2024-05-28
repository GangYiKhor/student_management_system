import clsx from 'clsx';
import { kebabCase } from 'lodash';
import { useEffect, useState } from 'react';
import { ContainerFlexColGrow, ContainerFlexRowGrow } from '../../utils/class/containers';
import {
	InvalidTextBoxClass,
	LabelLeftClass,
	LabelTopClass,
	TextBoxBottomClass,
	TextBoxRightClass,
} from '../../utils/class/inputs';
import { parseTimeOrNull, parseTimeToString } from '../../utils/parsers';
import { useFormContext } from '../providers/form-providers';
import { RequiredIcon } from '../required';

type PropType = {
	id?: string;
	label: string;
	name: string;
	placeholder?: string;
	defaultValue?: Date;
	min?: Date;
	max?: Date;
	required?: boolean;
	leftLabel?: boolean;
};

export function TimeInput({
	id,
	label,
	name,
	placeholder,
	defaultValue,
	min,
	max,
	required,
	leftLabel,
}: Readonly<PropType>) {
	id = id ?? kebabCase(name);
	const containerClass = leftLabel ? ContainerFlexRowGrow : ContainerFlexColGrow;
	const labelClass = leftLabel ? LabelLeftClass : LabelTopClass;
	const inputClass = leftLabel ? TextBoxRightClass : TextBoxBottomClass;

	const { formData, setFormData } = useFormContext();
	const [input, setInput] = useState<string>('');

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ name, value: parseTimeOrNull(e.target.value), valid: true });
		setInput(e.target.value);
	};

	useEffect(() => {
		setInput(parseTimeToString(formData?.[name]?.value, ''));
	}, [formData?.[name]?.value]);

	return (
		<div className={containerClass}>
			<label htmlFor={id} className={labelClass}>
				{label}:{required ? <RequiredIcon /> : null}
			</label>
			<input
				type="time"
				id={id}
				name={name}
				value={input}
				onChange={onChange}
				placeholder={placeholder}
				defaultValue={parseTimeToString(defaultValue)}
				min={parseTimeToString(min)}
				max={parseTimeToString(max)}
				required={required}
				className={clsx(inputClass, (formData[name]?.valid ?? true) || InvalidTextBoxClass)}
			/>
		</div>
	);
}
