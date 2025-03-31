import clsx from 'clsx';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import {
	dateFormatter,
	isAfter,
	isBefore,
	isSameDayOrAfter,
	isSameTimeOrBefore,
	parseDateTime,
} from '../../utils/dateOperations';
import { isDefined } from '../../utils/utils';
import { RequiredIcon } from '../required';
import { useFormHandlerContext } from './form';
import { getContainerClass, getInputClass, getInvalid, getLabelClass } from './input-css';

type PropType = {
	id: string;
	label: string;
	name?: string;
	defaultValue?: Date;
	min?: Date;
	max?: Date;
	minMaxInclusive?: boolean;
	required?: boolean;
	locked?: boolean;
	leftLabel?: boolean;
};

export function TimeInput({
	id,
	label,
	name,
	defaultValue,
	min,
	max,
	minMaxInclusive,
	required,
	locked,
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
	const [input, setInput] = useState<string>('');
	const debounceUpdate = useCallback(debounce(updateFieldValue, debounceLatency), [
		updateFieldValue,
	]);
	locked ||= formLocked;
	name ??= label;

	const containerClass = getContainerClass(leftLabel);
	const labelClass = getLabelClass(leftLabel);
	const inputClass = getInputClass(leftLabel, locked);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (locked) return;
		debounceUpdate([{ field: id, value: parseDateTime(e.target.value, null) }]);
		setInput(e.target.value);
	};

	useEffect(() => {
		const newData = dateFormatter(formData?.[id]?.value, { format: 'hh:mm' });
		if (newData !== input) {
			setInput(newData);
		}
	}, [formData?.[id]?.value]);

	// Field Settings
	const validator = useCallback(
		(value: Date) => {
			let compareMin = isSameTimeOrBefore;
			let compareMax = isSameDayOrAfter;
			if (minMaxInclusive) {
				compareMin = isBefore;
				compareMax = isAfter;
			}
			if (isDefined(min) && compareMin(value, min)) return false;
			if (isDefined(max) && compareMax(value, max)) return false;
			return true;
		},
		[JSON.stringify(min), JSON.stringify(max)],
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
				setInput(dateFormatter(formData?.[id]?.value, { format: 'hh:mm' }));
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

			<input
				type="time"
				id={id}
				name={name}
				value={input}
				onChange={onChange}
				min={dateFormatter(min, { format: 'hh:mm' })}
				max={dateFormatter(max, { format: 'hh:mm' })}
				required={required}
				disabled={locked}
				className={clsx(inputClass, getInvalid(formData?.[id]?.valid))}
			/>
		</div>
	);
}
