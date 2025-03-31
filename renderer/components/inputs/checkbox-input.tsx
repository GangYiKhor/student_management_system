import clsx from 'clsx';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { RedBoldText } from '../../utils/tailwindClass/text';
import { RequiredIcon } from '../required';
import { useFormHandlerContext } from './form';

type PropType = {
	id: string;
	label: string;
	name?: string;
	defaultChecked?: boolean;
	valueParser?: (value: boolean) => any;
	checkIf?: (value: any) => boolean;
	required?: boolean;
	locked?: boolean;
	labelLocation?: 'top' | 'left' | 'right' | 'bottom';
};

export function CheckboxInput({
	id,
	label,
	name,
	defaultChecked = false,
	valueParser = value => value,
	checkIf = value => !!value,
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
		debounceLatency,
	} = useFormHandlerContext();
	const [checked, setChecked] = useState<boolean>(defaultChecked);
	const debounceUpdate = useCallback(debounce(updateFieldValue, debounceLatency), [
		updateFieldValue,
	]);
	locked ||= formLocked;
	name ??= label;

	const containerClass = clsx(
		'flex text-center',
		'p-2',
		'select-none',
		['top', 'bottom'].includes(labelLocation) ? 'flex-col' : 'gap-2',
		formData?.[id]?.valid === false && clsx(RedBoldText, 'shake'),
	);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (locked) return;
		debounceUpdate([{ field: id, value: valueParser(e.target.checked) }]);
		setChecked(e.target.checked);
	};

	useEffect(() => {
		const newData = checkIf(formData?.[id]?.value);
		if (newData !== checked) {
			setChecked(newData);
		}
	}, [formData?.[id]?.value]);

	// Field Settings
	const validator = useCallback(
		(value: any) => {
			if (required && !checkIf(value)) return false;
			return true;
		},
		[required],
	);

	useEffect(() => {
		if (formInitialised) {
			updateFieldProperties([{ field: id, validator }]);
		}
	}, [validator]);

	useEffect(() => {
		if (formInitialised) {
			if (!keepData || !formData?.[id]) {
				initialiseForm([
					{ field: id, value: valueParser(defaultChecked), name, required, validator },
				]);
			} else {
				setChecked(checkIf(formData?.[id]?.value));
				if (!keepDefault) {
					updateFieldProperties([
						{ field: id, initialValue: valueParser(defaultChecked), required, validator },
					]);
				}
			}
		}
	}, [formInitialised]);

	return (
		<div className={containerClass}>
			{['left', 'top'].includes(labelLocation) ? (
				<label htmlFor={id}>
					{label} <RequiredIcon required={required} />
				</label>
			) : null}

			<div className={clsx('h-fit')}>
				<input
					type="checkbox"
					id={id}
					name={name}
					checked={checked}
					onChange={onChange}
					required
					disabled={locked}
					className={clsx(formData?.[id]?.valid === false && 'error-no-shake')}
				/>
			</div>

			{['right', 'bottom'].includes(labelLocation) ? (
				<label htmlFor={id}>
					<RequiredIcon required={required} /> {label}
				</label>
			) : null}
		</div>
	);
}
