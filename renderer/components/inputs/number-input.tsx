import clsx from 'clsx';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { tryParseFloat } from '../../utils/numberParsers';
import { RequiredIcon } from '../required';
import { useFormHandlerContext } from './form';
import { getContainerClass, getInputClass, getInvalid, getLabelClass } from './input-css';

type PropType = {
	id: string;
	label: string;
	name?: string;
	defaultValue?: number;
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
	defaultValue,
	placeholder,
	prefix,
	suffix,
	min,
	max,
	step,
	required = false,
	locked = false,
	leftLabel,
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
	const [input, setInput] = useState<string>(defaultValue?.toString() ?? '');
	const debounceUpdate = useCallback(debounce(updateFieldValue, debounceLatency), [
		updateFieldValue,
	]);
	locked ||= formLocked;
	name ??= label;

	const containerClass = getContainerClass(leftLabel);
	const labelClass = getLabelClass(leftLabel);
	const inputClass = clsx('flex flex-1 gap-1', getInputClass(leftLabel, locked));

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (locked) return;
		debounceUpdate([{ field: id, value: tryParseFloat(e.target.value, undefined, null) }]);
		setInput(e.target.value);
	};

	useEffect(() => {
		const newData = formData?.[id]?.value?.toString() ?? '';
		if (newData !== input) {
			setInput(newData);
		}
	}, [formData?.[id]?.value]);

	// Field Settings
	const validator = useCallback(
		(value: number) => {
			if (isFinite(min) && value < min) return false;
			if (isFinite(max) && value > max) return false;
			return true;
		},
		[min, max],
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
				setInput(formData?.[id]?.value?.toString() ?? '');
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

			<div className={clsx(inputClass, getInvalid(formData?.[id]?.valid))}>
				{prefix ? <span>{prefix}</span> : null}

				<input
					type="number"
					id={id}
					name={name}
					value={input}
					onChange={onChange}
					placeholder={placeholder}
					min={min}
					max={max}
					step={step}
					required={required}
					disabled={locked}
					className={clsx('flex-1', 'px-1', 'bg-transparent', 'focus:outline-none')}
				/>

				{suffix ? <span>{suffix}</span> : null}
			</div>
		</div>
	);
}
