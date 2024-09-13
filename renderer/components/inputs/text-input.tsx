import clsx from 'clsx';
import { kebabCase } from 'lodash';
import { useEffect, useState } from 'react';
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
	const containerClass = leftLabel ? ContainerFlexRowGrow : ContainerFlexColGrow;
	const labelClass = leftLabel ? LabelLeftClass : LabelTopClass;
	const inputClass = clsx(ContainerFlexRowGrow, leftLabel ? TextBoxRightClass : TextBoxBottomClass);

	const { formData, setFormData } = useFormContext();
	const [input, setInput] = useState<string>('');

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value;
		if (value === '') {
			value = null;
		}

		setFormData({
			name,
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

			<div className={clsx(inputClass, (formData[name]?.valid ?? true) || InvalidTextBoxClass)}>
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
