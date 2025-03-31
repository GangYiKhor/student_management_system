import clsx from 'clsx';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { RequiredIcon } from '../required';
import { useFormHandlerContext } from './form';
import { getContainerClass, getInputClass, getInvalid, getLabelClass } from './input-css';

type PropType = {
	id: string;
	label: string;
	name?: string;
	defaultValue?: string;
	placeholder?: string;
	maxLength?: number;
	required?: boolean;
	locked?: boolean;
	notResizable?: boolean;
};

export function TextAreaInput({
	id,
	label,
	name,
	defaultValue = '',
	placeholder,
	maxLength = 50,
	required,
	locked,
	notResizable,
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

	const containerClass = getContainerClass();
	const labelClass = getLabelClass();
	const inputClass = clsx('min-h-[80px] max-h-[300px]', getInputClass(false, locked));

	const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (locked) return;
		debounceUpdate([{ field: id, value: e.target.value }]);
		setInput(e.target.value);
	};

	useEffect(() => {
		const newData = formData?.[id]?.value ?? '';
		if (newData !== input) {
			setInput(newData);
		}
	}, [formData?.[id]?.value]);

	// Field Settings
	const validator = useCallback(
		(value: string) => {
			if (value.trim().length > maxLength) return false;
			return true;
		},
		[maxLength],
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
			<label htmlFor={id} className={labelClass}>
				{label}:<RequiredIcon required={required} />
			</label>

			<textarea
				id={id}
				name={name}
				value={input}
				onChange={onChange}
				placeholder={placeholder}
				maxLength={maxLength}
				required={required}
				disabled={locked}
				className={clsx(
					inputClass,
					getInvalid(formData?.[id]?.valid),
					(locked || notResizable) && 'resize-none',
				)}
			></textarea>
		</div>
	);
}
