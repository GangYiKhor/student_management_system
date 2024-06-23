import clsx from 'clsx';
import { kebabCase } from 'lodash';
import React, { useEffect, useState } from 'react';
import { dateFormatter, parseDateTime } from '../../utils/dateOperations';
import { ContainerFlexColGrow, ContainerFlexRowGrow } from '../../utils/tailwindClass/containers';
import {
	InvalidTextBoxClass,
	LabelLeftClass,
	LabelTopClass,
	TextBoxBottomClass,
	TextBoxRightClass,
} from '../../utils/tailwindClass/inputs';
import { CloseButtonIcon } from '../close-button-icon';
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

export function DateInput({ id, label, name, min, max, required, leftLabel }: Readonly<PropType>) {
	id = id ?? kebabCase(name);
	const containerClass = leftLabel ? ContainerFlexRowGrow : ContainerFlexColGrow;
	const labelClass = leftLabel ? LabelLeftClass : LabelTopClass;
	const inputClass = leftLabel ? TextBoxRightClass : TextBoxBottomClass;

	const { formData, setFormData } = useFormContext();
	const [input, setInput] = useState<string>('');

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value === '') {
			setFormData({ name, value: null, valid: true });
		}
		setFormData({ name, value: parseDateTime(e.target.value), valid: true });
		setInput(e.target.value);
	};

	const onClear = () => {
		setFormData({ name, value: null, valid: true });
		setInput('');
	};

	useEffect(() => {
		const newDate = dateFormatter(formData?.[name]?.value);
		if (newDate !== input) {
			setInput(newDate);
		}
	}, [formData?.[name]?.value]);

	return (
		<div className={containerClass}>
			<label htmlFor={id} className={labelClass}>
				{label}:<RequiredIcon required={required} />
			</label>

			<div
				className={clsx(
					ContainerFlexRowGrow,
					inputClass,
					(formData[name]?.valid ?? true) || InvalidTextBoxClass,
					'items-center',
				)}
			>
				<input
					type="date"
					id={id}
					name={name}
					value={input}
					onChange={onChange}
					min={dateFormatter(min)}
					max={dateFormatter(max)}
					required={required}
					className={clsx('flex-1', 'px-1', 'bg-transparent', 'focus:outline-none')}
				/>
				<button onClick={onClear}>
					<CloseButtonIcon />
				</button>
			</div>
		</div>
	);
}
