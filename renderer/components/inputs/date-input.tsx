import clsx from 'clsx';
import { kebabCase } from 'lodash';
import React, { useEffect, useState } from 'react';
import { dateFormatter, parseDateTime } from '../../utils/dateOperations';
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
import { CloseButtonIcon } from '../close-button-icon';
import { RequiredIcon } from '../required';
import { useFormHandlerContext } from './form';

type PropType = {
	id?: string;
	label: string;
	name: string;
	min?: Date;
	max?: Date;
	required?: boolean;
	locked?: boolean;
	leftLabel?: boolean;
};

export function DateInput({
	id,
	label,
	name,
	min,
	max,
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
		if (e.target.value === '') {
			setFormData({ path: name, value: null, valid: true });
		}
		setFormData({ path: name, value: parseDateTime(e.target.value), valid: true });
		setInput(e.target.value);
	};

	const onClear = () => {
		setFormData({ path: name, value: null, valid: true });
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
					(formData?.[name]?.valid ?? true) || InvalidTextBoxClass,
					'items-center',
				)}
			>
				<input
					type="date"
					id={id}
					name={name}
					value={input}
					onChange={locked ? () => {} : onChange}
					min={dateFormatter(min)}
					max={dateFormatter(max)}
					required={required}
					disabled={locked}
					className={clsx('flex-1', 'px-1', 'bg-transparent', 'focus:outline-none')}
				/>
				{!locked ? (
					<button onClick={onClear}>
						<CloseButtonIcon />
					</button>
				) : null}
			</div>
		</div>
	);
}
