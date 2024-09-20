import clsx from 'clsx';
import { kebabCase } from 'lodash';
import { useEffect, useState } from 'react';
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
	onFocusFormat?: (input: string) => string;
	onBlurFormat?: (input: string) => string;
	maxLength?: number;
	email?: boolean;
	required?: boolean;
	locked?: boolean;
	leftLabel?: boolean;
	labelClassAddOn?: string;
};

export function TextInput({
	id,
	label,
	name,
	placeholder,
	prefix,
	suffix,
	onFocusFormat,
	onBlurFormat,
	maxLength = 50,
	email,
	required,
	locked,
	leftLabel,
	labelClassAddOn,
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
		let value = e.target.value;
		if (value === '') {
			value = null;
		}

		setFormData({
			path: name,
			value: onBlurFormat?.(value) ?? value,
			valid: true,
		});
		setInput(e.target.value);
	};

	const onFocus = () => {
		setInput(onFocusFormat?.(input) ?? input);
	};
	const onBlur = () => {
		setInput(onBlurFormat?.(input) ?? input);
	};

	useEffect(() => {
		const newData = formData?.[name]?.value ?? '';
		if (newData !== input) {
			setInput(newData);
		}
	}, [formData?.[name]?.value]);

	return (
		<div className={containerClass}>
			<label htmlFor={id} className={clsx(labelClass, labelClassAddOn)}>
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
					type={email ? 'email' : 'text'}
					id={id}
					name={name}
					value={input}
					onChange={locked ? () => {} : onChange}
					placeholder={placeholder}
					maxLength={maxLength}
					onFocus={onFocus}
					onBlur={onBlur}
					required={required}
					disabled={locked}
					className={clsx('flex-1', 'px-1', 'bg-transparent', 'focus:outline-none')}
				/>

				{suffix ? <span className="pl-1">{suffix}</span> : null}
			</div>
		</div>
	);
}
