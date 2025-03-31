import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { tryParseInt } from '../../utils/numberParsers';
import { CloseButtonIcon } from '../close-button-icon';
import { RequiredIcon } from '../required';
import { useFormHandlerContext } from './form';
import {
	ContainerFlexRowGrow,
	getContainerClass,
	getInputClass,
	getInvalid,
	getLabelClass,
	InputTextClass,
} from './input-css';

const optionClass = clsx('bg-bglight', 'dark:bg-bgdark');

type PropType = {
	id: string;
	label: string;
	name?: string;
	defaultValue?: any;
	placeholder?: string;
	placeholderValue?: any;
	queryFn?: () => Promise<{ value: any; label: string }[]>;
	options?: { value: any; label: string }[];
	onUpdate?: () => any;
	required?: boolean;
	locked?: boolean;
	leftLabel?: boolean;
	labelClassAddOn?: string;
};

export function SelectInput({
	id,
	label,
	name,
	defaultValue = null,
	placeholder,
	placeholderValue = null,
	queryFn,
	options,
	onUpdate,
	required,
	locked,
	leftLabel,
	labelClassAddOn = '',
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
	const [input, setInput] = useState<string>('');
	locked ||= formLocked;
	name ??= label;

	const containerClass = getContainerClass(leftLabel);
	const labelClass = getLabelClass(leftLabel);
	const inputClass = clsx(ContainerFlexRowGrow, 'items-center', getInputClass(leftLabel, locked));

	const { data, refetch } = useQuery({ queryKey: [id], queryFn, enabled: false });

	useEffect(() => {
		if (queryFn) refetch();
	}, []);

	const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (locked) return;
		if (e.target.value === '') {
			updateFieldValue([{ field: id, value: placeholderValue }]);
			setInput(e.target.value);
		} else {
			updateFieldValue([
				{ field: id, value: (options ?? data)?.[tryParseInt(e.target.value, 0)]?.value },
			]);
			setInput(e.target.value);
		}
		onUpdate?.();
	};

	const onClear = () => {
		updateFieldValue([{ field: id, value: placeholderValue }]);
		setInput('');
		onUpdate?.();
	};

	useEffect(() => {
		if (formData?.[id]?.value === undefined) {
			setInput('');
			return;
		}

		const foundIndex = (options ?? data)?.findIndex(record => {
			return isEqual(record.value, formData?.[id]?.value);
		});

		const newData = foundIndex > -1 ? foundIndex.toString() : '';
		if (newData !== input) {
			setInput(foundIndex.toString());
		}
		onUpdate?.();
	}, [formData?.[id]?.value, options, data]);

	// Field Settings
	useEffect(() => {
		if (formInitialised) {
			updateFieldProperties([{ field: id, required }]);
		}
	}, [required]);

	useEffect(() => {
		if (formInitialised) {
			if (!keepData || !formData?.[id]) {
				initialiseForm([{ field: id, value: defaultValue, name, required }]);
			} else {
				const foundIndex = (options ?? data)?.findIndex(record => {
					return isEqual(record.value, formData?.[id]?.value);
				});

				setInput(foundIndex > -1 ? foundIndex.toString() : '');
				if (!keepDefault) {
					updateFieldProperties([{ field: id, initialValue: defaultValue, required }]);
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
				<select
					id={id}
					name={name}
					value={input}
					onChange={onChange}
					onClick={() => (queryFn ? refetch() : null)}
					required={required}
					disabled={locked}
					className={InputTextClass}
				>
					<option value="" disabled={required} className={optionClass}>
						{placeholder ?? `Select a ${name}`}
					</option>

					{(options ?? data)?.map((value: { label: string }, index) => (
						<option key={`${value.label}_${index}`} value={index} className={optionClass}>
							{value.label}
						</option>
					))}
				</select>

				{!locked ? (
					<button onClick={onClear}>
						<CloseButtonIcon />
					</button>
				) : null}
			</div>
		</div>
	);
}
