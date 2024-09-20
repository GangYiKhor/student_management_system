import clsx from 'clsx';
import { kebabCase } from 'lodash';
import { useEffect, useState } from 'react';
import { tryParseFloat } from '../../utils/numberParsers';
import { ContainerFlexColGrow, ContainerFlexRowGrow } from '../../utils/tailwindClass/containers';
import {
	DisabledTextBoxBottomClass,
	DisabledTextBoxRightClass,
	InvalidTextBoxClass,
	LabelLeftClass,
	LabelTopClass,
	TextBoxBottomClass,
	TextBoxRightClass,
} from '../../utils/tailwindClass/inputs';
import { RequiredIcon } from '../required';
import { useFormHandlerContext } from './form';

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
	locked?: boolean;
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
	locked,
	leftLabel,
}: Readonly<PropType>) {
	id = id ?? kebabCase(name);
	let containerClass: string;
	let labelClass: string;
	let inputClass: string;

	if (leftLabel) {
		containerClass = ContainerFlexRowGrow;
		labelClass = LabelLeftClass;
		inputClass = locked ? DisabledTextBoxRightClass : TextBoxRightClass;
	} else {
		containerClass = ContainerFlexColGrow;
		labelClass = LabelTopClass;
		inputClass = locked ? DisabledTextBoxBottomClass : TextBoxBottomClass;
	}

	const { formData, setFormData } = useFormHandlerContext();
	const [input, setInput] = useState<string>('');

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ path: name, value: tryParseFloat(e.target.value, undefined, null), valid: true });
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

			<div
				className={clsx(
					'flex flex-1',
					inputClass,
					(formData?.[name]?.valid ?? true) || InvalidTextBoxClass,
				)}
			>
				{prefix ? <span className="pr-1">{prefix}</span> : null}

				<input
					type="number"
					id={id}
					name={name}
					value={input}
					onChange={locked ? () => {} : onChange}
					placeholder={placeholder}
					min={min}
					max={max}
					step={step}
					required={required}
					disabled={locked}
					className={clsx('flex-1', 'px-1', 'bg-transparent', 'focus:outline-none')}
				/>

				{suffix ? <span className="pl-1">{suffix}</span> : null}
			</div>
		</div>
	);
}
