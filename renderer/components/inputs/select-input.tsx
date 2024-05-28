import { useQuery } from '@tanstack/react-query';
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
import { CloseButtonIcon } from '../close-button-icon';
import { useFormContext } from '../providers/form-providers';
import { RequiredIcon } from '../required';

type PropType = {
	id?: string;
	label: string;
	name: string;
	placeholder?: string;
	placeholderValue?: any;
	defaultSelectionIndex?: number;
	queryFn?: () => Promise<{ value: any; label: string }[]>;
	options?: { value: any; label: string }[];
	onUpdate?: () => any;
	required?: boolean;
	leftLabel?: boolean;
};

export function SelectInput({
	id,
	label,
	name,
	placeholder,
	defaultSelectionIndex,
	placeholderValue = null,
	queryFn,
	options,
	onUpdate,
	required,
	leftLabel,
}: Readonly<PropType>) {
	id = id ?? kebabCase(name);
	const containerClass = leftLabel ? ContainerFlexRowGrow : ContainerFlexColGrow;
	const labelClass = leftLabel ? LabelLeftClass : LabelTopClass;
	const inputClass = leftLabel ? TextBoxRightClass : TextBoxBottomClass;

	const { formData, setFormData } = useFormContext();
	const [input, setInput] = useState<string>(defaultSelectionIndex?.toString() ?? '');

	const { data, refetch } = useQuery({
		queryKey: [id],
		queryFn,
		enabled: false,
	});

	const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (e.target.value === '') {
			setFormData({ name, value: placeholderValue ?? null, valid: true });
			setInput(e.target.value);
		} else {
			const newData = {
				name,
				value: (options ?? data)?.[parseInt(e.target.value)].value,
				valid: true,
			};
			setFormData(newData);
			setInput(e.target.value);
		}
		onUpdate?.();
	};

	const onClear = () => {
		setFormData({ name, value: placeholderValue, valid: true });
		setInput('');
	};

	useEffect(() => {
		const foundIndex = (options ?? data)?.findIndex(record => {
			return record.value === formData?.[name]?.value;
		});

		if (foundIndex > -1) {
			setInput(foundIndex.toString());
		} else {
			setInput('');
		}
		onUpdate?.();
	}, [formData[name]]);

	return (
		<div className={containerClass}>
			<label htmlFor={id} className={labelClass}>
				{label}:{required ? <RequiredIcon /> : null}
			</label>

			<div
				className={clsx(
					ContainerFlexRowGrow,
					inputClass,
					(formData[name]?.valid ?? true) || InvalidTextBoxClass,
					'items-center',
				)}
			>
				<select
					id={id}
					name={name}
					value={input}
					onChange={onChange}
					onClick={() => (queryFn ? refetch() : null)}
					placeholder={placeholder ?? `Select a ${label}`}
					defaultValue={defaultSelectionIndex?.toString()}
					required={required}
					className={clsx('flex-1', 'px-1', 'bg-transparent')}
				>
					<option value="" disabled={required}>
						{placeholder ?? `Select a ${label}`}
					</option>

					{(options ?? data)?.map((value: { label: string }, index) => (
						<option key={value.label} value={index}>
							{value.label}
						</option>
					))}
				</select>

				{!required ? (
					<button onClick={onClear}>
						<CloseButtonIcon />
					</button>
				) : null}
			</div>
		</div>
	);
}
