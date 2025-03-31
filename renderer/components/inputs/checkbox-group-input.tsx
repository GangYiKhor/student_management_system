import clsx from 'clsx';
import { isEqual } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { RequiredIcon } from '../required';
import { useFormHandlerContext } from './form';

type PropType = {
	id: string;
	title?: string;
	labels: string[];
	name?: string;
	defaultValue?: any;
	values: any[];
	allUncheckedValue: any;
	required?: boolean;
	locked?: boolean;
	labelLocation?: 'top' | 'left' | 'right' | 'bottom';
};

export function CheckboxGroupInput({
	id,
	title,
	labels,
	name,
	values,
	allUncheckedValue,
	defaultValue = allUncheckedValue,
	required,
	locked,
	labelLocation = 'right',
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
	} = useFormHandlerContext();
	locked ||= formLocked;
	name ??= labels[0];
	const [input, setInput] = useState(defaultValue);

	const containerClass = clsx(
		'flex flex-col',
		'my-2',
		'border-2 border-gray-300 dark:border-gray-600',
		formData?.[id]?.valid === false && 'error',
	);

	const onChecked = (value: any) => {
		updateFieldValue([{ field: id, value }]);
		setInput(value);
	};

	useEffect(() => {
		const newData = formData?.[id]?.value;
		const newDataIndex = values.findIndex(value => isEqual(value, newData));
		if (newDataIndex < 0) {
			setInput(allUncheckedValue);
			updateFieldValue([{ field: id, value: allUncheckedValue }]);
		} else if (newData !== input) {
			setInput(newData);
		}
	}, [formData?.[id]?.value]);

	// Field Settings
	const validator = useCallback(
		(value: any) => {
			if (required && isEqual(value, allUncheckedValue)) return false;
			return true;
		},
		[required],
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
				const newData = formData?.[id]?.value;
				const newDataIndex = values.findIndex(value => isEqual(value, newData));
				if (newDataIndex < 0) {
					setInput(allUncheckedValue);
				} else {
					setInput(newData);
				}
				if (!keepDefault) {
					updateFieldProperties([{ field: id, initialValue: defaultValue, required, validator }]);
				}
			}
		}
	}, [formInitialised]);

	return (
		<div className={containerClass}>
			{title ? (
				<p className={clsx('px-2 pt-2')}>
					{title}
					<RequiredIcon required={required} />
				</p>
			) : (
				<div className={clsx('px-1', 'h-1')}>
					<RequiredIcon required={required} />
				</div>
			)}
			<div className={clsx('flex')}>
				{values.map((value, index) => (
					<CheckboxInput
						id={`${id}-${index}`}
						label={labels[index]}
						onChecked={checked => onChecked(checked ? value : allUncheckedValue)}
						check={isEqual(input, value)}
						locked={locked}
						labelLocation={labelLocation}
						valid={formData?.[id]?.valid ?? true}
						key={`${id}-${index}`}
					/>
				))}
			</div>
		</div>
	);
}

type SingleCheckboxPropType = {
	id: string;
	label: string;
	onChecked: (value: boolean) => any;
	check: boolean;
	locked: boolean;
	labelLocation: 'top' | 'left' | 'right' | 'bottom';
	valid: boolean;
};

function CheckboxInput({
	id,
	label,
	onChecked = value => value,
	check = false,
	locked,
	labelLocation = 'right',
	valid = true,
}: Readonly<SingleCheckboxPropType>) {
	const [checked, setChecked] = useState<boolean>(check);

	const containerClass = clsx(
		'flex text-center',
		'p-2',
		'select-none',
		['top', 'bottom'].includes(labelLocation) ? 'flex-col' : 'gap-2',
	);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (locked) return;
		onChecked(e.target.checked);
		setChecked(e.target.checked);
	};

	useEffect(() => {
		if (check !== checked) {
			setChecked(check);
		}
	}, [check]);

	return (
		<div className={containerClass}>
			{['left', 'top'].includes(labelLocation) ? <label htmlFor={id}>{label}</label> : null}

			<div className={clsx('h-fit')}>
				<input
					type="checkbox"
					id={id}
					checked={checked}
					onChange={onChange}
					required
					disabled={locked}
					className={clsx(valid === false && 'error-no-shake')}
				/>
			</div>

			{['right', 'bottom'].includes(labelLocation) ? <label htmlFor={id}>{label}</label> : null}
		</div>
	);
}
