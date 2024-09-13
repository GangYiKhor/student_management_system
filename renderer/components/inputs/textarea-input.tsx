import clsx from 'clsx';
import { kebabCase } from 'lodash';
import React, { useEffect, useState } from 'react';
import { ContainerFlexColGrow } from '../../utils/tailwindClass/containers';
import {
	DisabledTextBoxBottomClass,
	InvalidTextBoxClass,
	LabelTopClass,
	TextBoxBottomClass,
} from '../../utils/tailwindClass/inputs';
import { useFormContext } from '../providers/form-providers';
import { RequiredIcon } from '../required';

type PropType = {
	id?: string;
	label: string;
	name: string;
	placeholder?: string;
	maxLength?: number;
	onFocusFormat?: (input: string) => string;
	onBlurFormat?: (input: string) => string;
	required?: boolean;
	locked?: boolean;
	notResizable?: boolean;
};

export function TextAreaInput({
	id,
	label,
	name,
	placeholder,
	maxLength = 50,
	onFocusFormat,
	onBlurFormat,
	required,
	locked,
	notResizable,
}: Readonly<PropType>) {
	id = id ?? kebabCase(name);
	const { formData, setFormData } = useFormContext();
	const [input, setInput] = useState<string>('');

	const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setFormData({ name, value: e.target.value, valid: true });
		setInput(e.target.value);
	};

	const onFocus = () => {
		setInput(onFocusFormat?.(input) ?? input);
	};

	const onBlur = () => {
		setInput(onBlurFormat?.(input) ?? input);
	};

	useEffect(() => {
		const newData = onBlurFormat?.(formData?.[name]?.value) ?? formData?.[name]?.value ?? '';
		if (newData !== input) {
			setInput(newData);
		}
	}, [formData?.[name]?.value]);

	return (
		<div className={ContainerFlexColGrow}>
			<label htmlFor={id} className={LabelTopClass}>
				{label}:<RequiredIcon required={required} />
			</label>

			<textarea
				id={id}
				name={name}
				value={input}
				onChange={onChange}
				placeholder={placeholder}
				maxLength={maxLength}
				onFocus={onFocus}
				onBlur={onBlur}
				required={required}
				disabled={locked}
				className={clsx(
					locked ? DisabledTextBoxBottomClass : TextBoxBottomClass,
					(formData[name]?.valid ?? true) || InvalidTextBoxClass,
					'min-h-[80px]',
					'max-h-[300px]',
					(locked || notResizable) && 'resize-none',
				)}
			></textarea>
		</div>
	);
}
