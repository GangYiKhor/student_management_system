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
import { useFormContext } from '../providers/form-providers';
import { RequiredIcon } from '../required';

type PropType = {
	id?: string;
	label: string;
	name: string;
	placeholder?: string;
	defaultValue?: string;
	prefix?: string;
	suffix?: string;
	onFocusFormat?: (input: string) => string;
	onBlurFormat?: (input: string) => string;
	maxLength?: number;
	email?: boolean;
	required?: boolean;
	leftLabel?: boolean;
};

export function TextInput({
	id,
	label,
	name,
	placeholder,
	defaultValue,
	prefix,
	suffix,
	onFocusFormat,
	onBlurFormat,
	maxLength = 50,
	email,
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
		setInput(onBlurFormat?.(formData?.[name]?.value) ?? formData?.[name]?.value);
	}, [formData?.[name]?.value]);

	return (
		<div className={containerClass}>
			<label htmlFor={id} className={labelClass}>
				{label}:{required ? <RequiredIcon /> : null}
			</label>

			<div className={clsx(inputClass, (formData[name]?.valid ?? true) || InvalidTextBoxClass)}>
				{prefix ? <span className="pr-1">{prefix}</span> : null}

				<input
					type={email ? 'email' : 'text'}
					id={id}
					name={name}
					value={input}
					onChange={onChange}
					placeholder={placeholder}
					defaultValue={defaultValue}
					maxLength={maxLength}
					onFocus={onFocus}
					onBlur={onBlur}
					required={required}
					className={clsx('flex-1', 'px-1', 'bg-transparent')}
				/>

				{suffix ? <span className="pl-1">{suffix}</span> : null}
			</div>
		</div>
	);
}
