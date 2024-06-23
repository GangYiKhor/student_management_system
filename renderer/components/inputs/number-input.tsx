import clsx from 'clsx';
import { kebabCase } from 'lodash';
import { useEffect, useState } from 'react';
import { tryParseFloat } from '../../utils/numberParsers';
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
	placeholder?: string;
	prefix?: string;
	suffix?: string;
	min?: number;
	max?: number;
	step?: number;
	required?: boolean;
	leftLabel?: boolean;
};

export function NumberInput({
	id,
	label,
	name,
	placeholder,
	prefix,
	suffix,
	min,
	max,
	step,
	required,
	leftLabel,
}: Readonly<PropType>) {
	id = id ?? kebabCase(name);
	const containerClass = leftLabel ? ContainerFlexRowGrow : ContainerFlexColGrow;
	const labelClass = leftLabel ? LabelLeftClass : LabelTopClass;
	const inputClass = clsx(ContainerFlexRowGrow, leftLabel ? TextBoxRightClass : TextBoxBottomClass);

	const { formData, setFormData } = useFormContext();
	const [input, setInput] = useState<string>('');

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ name, value: tryParseFloat(e.target.value, undefined, null), valid: true });
		setInput(e.target.value);
	};

	useEffect(() => {
		const newData = formData?.[name]?.value?.toString() ?? '';
		if (newData !== input) {
			setInput(newData);
		}
	}, [formData?.[name]?.value]);

	return (
		<div className={containerClass}>
			<label htmlFor={id} className={labelClass}>
				{label}:<RequiredIcon required={required} />
			</label>

			<div className={clsx(inputClass, (formData[name]?.valid ?? true) || InvalidTextBoxClass)}>
				{prefix ? <span className="pr-1">{prefix}</span> : null}

				<input
					type="number"
					id={id}
					name={name}
					value={input}
					onChange={onChange}
					placeholder={placeholder}
					min={min}
					max={max}
					step={step}
					required={required}
					className={clsx('flex-1', 'px-1', 'bg-transparent', 'focus:outline-none')}
				/>

				{suffix ? <span className="pl-1">{suffix}</span> : null}
			</div>
		</div>
	);
}
