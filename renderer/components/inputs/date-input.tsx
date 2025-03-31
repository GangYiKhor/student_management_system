import clsx from 'clsx';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
	dateFormatter,
	dateOperator,
	isDayAfter,
	isDayBefore,
	isSameDayOrAfter,
	isSameDayOrBefore,
	parseDateTime,
} from '../../utils/dateOperations';
import { isDefined } from '../../utils/utils';
import { CloseButtonIcon } from '../close-button-icon';
import { RequiredIcon } from '../required';
import { useFormHandlerContext } from './form';
import {
	ContainerFlexRowGrow,
	getContainerClass,
	getInputClass,
	getInvalid,
	getLabelClass,
} from './input-css';

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

export function DateInput({
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
	const inputClass = clsx(ContainerFlexRowGrow, 'items-center', getInputClass(leftLabel, locked));

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (locked) return;
		debounceUpdate([{ field: id, value: parseDateTime(e.target.value, null) }]);
		setInput(e.target.value);
	};

	const onClear = () => {
		debounceUpdate([{ field: id, value: null }]);
		setInput('');
	};

	useEffect(() => {
		const newDate = dateFormatter(formData?.[id]?.value);
		if (newDate !== input) {
			setInput(newDate);
		}
	}, [formData?.[id]?.value]);

	// Field Settings
	const validator = useCallback(
		(value: Date) => {
			let compareMin = isSameDayOrBefore;
			let compareMax = isSameDayOrAfter;
			if (minMaxInclusive) {
				compareMin = isDayBefore;
				compareMax = isDayAfter;
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
				setInput(dateFormatter(formData?.[id]?.value));
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
				<input
					type="date"
					id={id}
					name={name}
					value={input}
					onChange={onChange}
					min={minMaxInclusive ? dateFormatter(min) : dateFormatter(dateOperator(min, 1, 'd'))}
					max={minMaxInclusive ? dateFormatter(max) : dateFormatter(dateOperator(max, -1, 'd'))}
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
