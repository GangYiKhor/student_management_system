import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { isEqual, kebabCase } from 'lodash';
import { useEffect, useState } from 'react';
import { tryParseInt } from '../../utils/numberParsers';
import { ContainerFlexColGrow, ContainerFlexRowGrow } from '../../utils/tailwindClass/containers';
import {
	DisabledTextBoxBottomClass,
	DisabledTextBoxRightClass,
	InputTextClass,
	InvalidTextBoxClass,
	LabelLeftClass,
	LabelTopClass,
	TextBoxBottomClass,
	TextBoxRightClass,
} from '../../utils/tailwindClass/inputs';
import { CloseButtonIcon } from '../close-button-icon';
import { useFormContext } from '../providers/form-providers';
import { RequiredIcon } from '../required';

type PropType = {
	id?: string;
	label: string;
	name: string;
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
	id = id ?? kebabCase(name);
	let containerClass: string;
	let labelClass: string;
	let inputClass: string;

	if (leftLabel) {
		containerClass = ContainerFlexRowGrow;
		labelClass = LabelLeftClass;
		inputClass = locked ? DisabledTextBoxRightClass : TextBoxRightClass;
	} else {
		containerClass = ContainerFlexColGrow;
		labelClass = LabelTopClass;
		inputClass = locked ? DisabledTextBoxBottomClass : TextBoxBottomClass;
	}

	const { formData, setFormData } = useFormContext();
	const [input, setInput] = useState<string>('');

	const { data, refetch } = useQuery({
		queryKey: [id],
		queryFn,
		enabled: false,
	});

	useEffect(() => {
		if (queryFn) {
			refetch();
		}
	}, []);

	const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (e.target.value === '') {
			setFormData({ name, value: placeholderValue, valid: true });
			setInput(e.target.value);
		} else {
			const newData = {
				name,
				value: (options ?? data)?.[tryParseInt(e.target.value, 0)]?.value,
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
		if (formData?.[name]?.value === undefined) {
			setInput('');
		}

		const foundIndex = (options ?? data)?.findIndex(record => {
			return isEqual(record.value, formData?.[name]?.value);
		});

		const newData = foundIndex > -1 ? foundIndex.toString() : '';
		if (newData !== input) {
			setInput(foundIndex.toString());
		}
		onUpdate?.();
	}, [formData?.[name]?.value, options, data]);

	return (
		<div className={containerClass}>
			<label htmlFor={id} className={clsx(labelClass, labelClassAddOn)}>
				{label}:<RequiredIcon required={required} />
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
					onChange={locked ? () => {} : onChange}
					onClick={() => (queryFn ? refetch() : null)}
					required={required}
					disabled={locked}
					className={InputTextClass}
				>
					<option value="" disabled={required} className={clsx('bg-bglight', 'dark:bg-bgdark')}>
						{placeholder ?? `Select a ${label}`}
					</option>

					{(options ?? data)?.map((value: { label: string }, index) => (
						<option
							key={`${value.label}_${index}`}
							value={index}
							className={clsx('bg-bglight', 'dark:bg-bgdark')}
						>
							{value.label}
						</option>
					))}
				</select>

				{!locked ? (
					<button onClick={onClear}>
						<CloseButtonIcon disabled={locked} />
					</button>
				) : null}
			</div>
		</div>
	);
}
