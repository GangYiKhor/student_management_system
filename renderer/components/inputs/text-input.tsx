import clsx from 'clsx';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import {
	phoneNumberFormat,
	phoneNumberFormatRevert,
} from '../../utils/formatting/phoneNumberFormatting';
import { verifyEmail, verifyPhoneNumber } from '../../utils/verifications';
import { RequiredIcon } from '../required';
import { useFormHandlerContext } from './form';
import { getContainerClass, getInputClass, getInvalid, getLabelClass } from './input-css';

type PropType = {
	id: string;
	label: string;
	name?: string;
	defaultValue?: string;
	placeholder?: string;
	prefix?: string;
	suffix?: string;
	onFocusFormat?: (input: string) => string;
	onBlurFormat?: (input: string) => string;
	maxLength?: number;
	email?: boolean;
	tel?: boolean;
	required?: boolean;
	locked?: boolean;
	leftLabel?: boolean;
	labelClassAddOn?: string;
};

export function TextInput({
	id,
	label,
	name,
	defaultValue = '',
	placeholder,
	prefix,
	suffix,
	onFocusFormat,
	onBlurFormat,
	maxLength = 50,
	email = false,
	tel = false,
	required = false,
	locked,
	leftLabel,
	labelClassAddOn,
}: Readonly<PropType>) {
	const {
		formData,
		initialiseForm,
		updateFieldProperties,
		updateFieldValue,
		formInitialised,
		formLocked,
		keepData,
		keepDefault,
		debounceLatency,
	} = useFormHandlerContext();
	const [input, setInput] = useState<string>(defaultValue);
	const debounceUpdate = useCallback(debounce(updateFieldValue, debounceLatency), [
		updateFieldValue,
	]);
	locked ||= formLocked;
	name ??= label;

	const containerClass = getContainerClass(leftLabel);
	const labelClass = getLabelClass(leftLabel);
	const inputClass = clsx('flex flex-1 gap-1', getInputClass(leftLabel, locked));

	if (!onFocusFormat && tel) {
		onFocusFormat = phoneNumberFormatRevert;
	} else {
		onFocusFormat = onFocusFormat ?? (value => value);
	}

	if (!onBlurFormat && tel) {
		onBlurFormat = phoneNumberFormat;
	} else {
		onBlurFormat = onBlurFormat ?? (value => value);
	}

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (locked) return;
		debounceUpdate([{ field: id, value: onBlurFormat(e.target.value) }]);
		setInput(onBlurFormat(e.target.value));
	};

	const onFocus = () => {
		setInput(onFocusFormat(input));
	};
	const onBlur = () => {
		setInput(onBlurFormat(input));
	};

	useEffect(() => {
		if (formData?.[id]?.componentUpdated) return;

		const newData = formData?.[id]?.value ?? '';
		if (newData !== input) {
			setInput(newData);
		}
	}, [formData?.[id]?.value]);

	// Field Settings
	const validator = useCallback(
		(value: string) => {
			if (value.trim().length > maxLength) return false;
			if (email && !verifyEmail(value)) return false;
			if (tel && !verifyPhoneNumber(value)) return false;
			return true;
		},
		[maxLength, email, tel],
	);

	useEffect(() => {
		if (formInitialised) {
			updateFieldProperties([{ field: id, required, validator }]);
		}
	}, [required, validator]);

	useEffect(() => {
		if (formInitialised) {
			if (!keepData || !formData?.[id]) {
				initialiseForm([{ field: id, value: defaultValue, name, required, validator }]);
			} else {
				setInput(formData?.[id]?.value ?? '');
				if (!keepDefault) {
					updateFieldProperties([{ field: id, initialValue: defaultValue, required, validator }]);
				}
			}
		}
	}, [formInitialised]);

	return (
		<div className={containerClass}>
			<label htmlFor={id} className={clsx(labelClass, labelClassAddOn)}>
				{label}:<RequiredIcon required={required} />
			</label>

			<div className={clsx(inputClass, getInvalid(formData?.[id]?.valid))}>
				{prefix ? <span>{prefix}</span> : null}

				<input
					type={email ? 'email' : 'text'}
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
					className={clsx('flex-1', 'px-1', 'bg-transparent', 'focus:outline-none')}
				/>

				{suffix ? <span>{suffix}</span> : null}
			</div>
		</div>
	);
}
