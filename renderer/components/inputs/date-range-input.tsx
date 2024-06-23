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
	startName: string;
	endName: string;
	min?: Date;
	max?: Date;
	required?: boolean;
	leftLabel?: boolean;
};

export function DateRangeInput({
	id,
	label,
	startName,
	endName,
	min,
	max,
	required,
	leftLabel,
}: Readonly<PropType>) {
	id = id ?? kebabCase(startName);
	const containerClass = leftLabel ? ContainerFlexRowGrow : ContainerFlexColGrow;
	const labelClass = leftLabel ? LabelLeftClass : LabelTopClass;
	const inputClass = leftLabel ? TextBoxRightClass : TextBoxBottomClass;

	const { formData, setFormData } = useFormContext();
	const [startInput, setStartInput] = useState<string>('');
	const [endInput, setEndInput] = useState<string>('');

	const onChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		name: string,
		setFunction: React.Dispatch<React.SetStateAction<string>>,
	) => {
		if (e.target.value === '') {
			setFormData({ name, value: null, valid: true });
		}
		setFormData({ name, value: parseDateTime(e.target.value), valid: true });
		setFunction(e.target.value);
	};

	const onClear = (name: string, setFunction: React.Dispatch<React.SetStateAction<string>>) => {
		setFormData({ name, value: null, valid: true });
		setFunction('');
	};

	const onStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e, startName, setStartInput);
	};

	const onStartClear = () => {
		onClear(startName, setStartInput);
	};

	const onEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e, endName, setEndInput);
	};

	const onEndClear = () => {
		onClear(endName, setEndInput);
	};

	useEffect(() => {
		const newDate = dateFormatter(formData?.[startName]?.value);
		if (newDate !== startInput) {
			setStartInput(newDate);
		}
	}, [formData?.[startName]?.value]);

	return (
		<div className={containerClass}>
			<label htmlFor={id} className={labelClass}>
				{label}:<RequiredIcon required={required} />
			</label>

			<div
				className={clsx(
					ContainerFlexRowGrow,
					inputClass,
					(formData[startName]?.valid ?? true) || InvalidTextBoxClass,
					'items-center',
				)}
			>
				<input
					type="date"
					id={`${id}-start`}
					name={startName}
					value={startInput}
					onChange={onStartChange}
					min={dateFormatter(min)}
					max={endInput || dateFormatter(max)}
					required={required}
					className={clsx('flex-1', 'px-1', 'bg-transparent', 'focus:outline-none')}
				/>
				<button onClick={onStartClear}>
					<CloseButtonIcon />
				</button>
			</div>

			<div className={clsx('flex', 'items-center', 'mr-1')}>-</div>

			<div
				className={clsx(
					ContainerFlexRowGrow,
					inputClass,
					(formData[endName]?.valid ?? true) || InvalidTextBoxClass,
					'items-center',
				)}
			>
				<input
					type="date"
					id={`${id}-end`}
					name={endName}
					value={endInput}
					onChange={onEndChange}
					min={startInput || dateFormatter(min)}
					max={dateFormatter(max)}
					required={required}
					className={clsx('flex-1', 'px-1', 'bg-transparent', 'focus:outline-none')}
				/>
				<button onClick={onEndClear}>
					<CloseButtonIcon />
				</button>
			</div>
		</div>
	);
}
