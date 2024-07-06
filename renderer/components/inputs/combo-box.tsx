import clsx from 'clsx';
import { isEqual, kebabCase } from 'lodash';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { getPropertyValue } from '../../utils/propertyParser';
import { ContainerFlexColGrow, ContainerFlexRowGrow } from '../../utils/tailwindClass/containers';
import {
	DropdownCellClass,
	DropdownClass,
	DropdownRowClass,
	DropdownSelectedRow,
	DropdownTableClass,
	InputTextClass,
	InvalidTextBoxClass,
	LabelLeftClass,
	LabelTopClass,
	TextBoxBottomClass,
	TextBoxRightClass,
} from '../../utils/tailwindClass/inputs';
import { GrayText } from '../../utils/tailwindClass/text';
import { CloseButtonIcon } from '../close-button-icon';
import { useFormContext } from '../providers/form-providers';
import { RequiredIcon } from '../required';

export type DropDownColumnParser<Data = any> = {
	column: string;
	parser: (value: Data) => string;
}[];

type PropType = {
	id?: string;
	label: string;
	name: string;
	placeholder?: string;
	options: { [key: string]: any }[];
	columns?: string[];
	columnParsers?: DropDownColumnParser;
	labelColumn: string;
	labelParser?: (value: any) => string;
	valueParser?: (value: any) => any;
	onUpdate?: () => any;
	notSearchable?: boolean;
	required?: boolean;
	leftLabel?: boolean;
	labelClassAddOn?: string;
};

/**
 * @param columns (E.g. 'prop1.index1') value will be fetched according to level separated by '.'
 * @param columnParsers Will replace columns, so either use this or columns, but not both
 * @param labelParser Default treating the label column as string, replace this if the column is not string
 */
export function ComboBox({
	id,
	label,
	name,
	placeholder = 'Not Selected',
	options,
	columns,
	columnParsers,
	labelColumn,
	labelParser = value => getPropertyValue(value, labelColumn),
	valueParser = value => value,
	onUpdate,
	notSearchable,
	required,
	leftLabel,
	labelClassAddOn,
}: Readonly<PropType>) {
	id = id ?? kebabCase(name);
	columns = Array.from(new Set([labelColumn, ...(columns ?? Object.keys(options?.[0] ?? {}))]));
	columnParsers =
		columnParsers ??
		columns?.map(column => ({
			column,
			parser: value => getPropertyValue(value, column),
		})) ??
		[];

	let containerClass = '';
	let labelClass = '';
	let inputClass = clsx(ContainerFlexRowGrow, 'relative');

	if (leftLabel) {
		containerClass = ContainerFlexRowGrow;
		labelClass = LabelLeftClass;
		inputClass = clsx(inputClass, TextBoxRightClass);
	} else {
		containerClass = ContainerFlexColGrow;
		labelClass = LabelTopClass;
		inputClass = clsx(inputClass, TextBoxBottomClass);
	}

	const { formData, setFormData } = useFormContext();
	const [input, setInput] = useState<string>('');
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>();

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);

		const foundIndex = options?.findIndex(record => {
			return labelParser(record).toLowerCase().includes(e.target.value?.toLowerCase());
		});

		const scrollHeight = foundIndex < 0 ? 0 : foundIndex * 30 + 30;
		dropdownRef?.current?.scrollTo({ top: scrollHeight });
	};

	const onSelect = (selected: { [key: string]: any }) => {
		setInput(labelParser(selected) ?? '');
		setFormData({ name, value: selected ? valueParser(selected) : null, valid: true });
		setShowDropdown(false);
		onUpdate?.();
	};

	const show = () => {
		setShowDropdown(!showDropdown);
	};

	const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			const foundIndex = options?.findIndex(record => {
				return labelParser(record) === input;
			});

			if (foundIndex > -1) {
				setFormData({ name, value: valueParser(options[foundIndex]), valid: true });
				setShowDropdown(false);
				onUpdate?.();
			} else {
				setFormData({ name, valid: false });
			}
		} else if (new RegExp(/[a-zA-Z0-9`~!@#$%^&*()_+={}[\]\\|;':",./<>?-]/).exec(e.key)) {
			setShowDropdown(true);
		}
	};

	const onBlur = () => {
		const foundIndex = options?.findIndex(record => {
			return labelParser(record).toLowerCase() === input?.toLowerCase();
		});

		if (foundIndex < 0 && required) {
			setFormData({ name, valid: false });
		} else if (!isEqual(valueParser(options[foundIndex]), formData?.[name]?.value)) {
			setInput(labelParser(options[foundIndex]));
			setFormData({ name, value: valueParser(options[foundIndex]), valid: true });
			onUpdate?.();
		}

		setTimeout(() => setShowDropdown(false), 100);
	};

	const onClear = () => {
		setInput('');
		setFormData({ name, value: null, valid: true });
		setShowDropdown(false);
	};

	useEffect(() => {
		if (formData?.[name]?.value === undefined) {
			setInput('');
			return;
		}

		const foundIndex = options?.findIndex(record => {
			return isEqual(valueParser(record), formData?.[name]?.value);
		});

		const newData = foundIndex > -1 ? labelParser(options[foundIndex]) : '';
		if (newData !== input) {
			setInput(newData);
		}
	}, [formData?.[name]?.value, options]);

	return (
		<div className={containerClass}>
			<label htmlFor={id} className={clsx(labelClass, labelClassAddOn)}>
				{label}:<RequiredIcon required={required} />
			</label>

			<div
				className={clsx(
					(formData[name]?.valid ?? true) || InvalidTextBoxClass,
					inputClass,
					showDropdown ? 'rounded-b-none' : '',
				)}
			>
				{notSearchable ? (
					<button
						onClick={show}
						onBlur={onBlur}
						className={clsx(InputTextClass, input === '' ? GrayText : null)}
					>
						{input || placeholder}
					</button>
				) : (
					<input
						type="text"
						id={id}
						name={name}
						value={input}
						onChange={onChange}
						onClick={show}
						onBlur={onBlur}
						onKeyDown={onKeyDown}
						placeholder={placeholder}
						className={InputTextClass}
					/>
				)}

				<button onClick={show}>{showDropdown ? <ChevronUp /> : <ChevronDown />}</button>

				<button onClick={onClear}>
					<CloseButtonIcon />
				</button>

				{showDropdown ? (
					<div className={DropdownClass} ref={dropdownRef}>
						<table className={DropdownTableClass /* NOSONAR */}>
							<tbody>
								<tr
									className={clsx(
										DropdownRowClass,
										formData?.[name]?.value === undefined ? DropdownSelectedRow : '',
									)}
									onClick={() => onSelect(undefined)}
								>
									<td colSpan={columns.length} className={clsx(DropdownCellClass, GrayText)}>
										{placeholder}
									</td>
								</tr>

								{options.map((value, index) => (
									<tr
										key={`${labelParser(value)}-${index}`}
										className={clsx(
											DropdownRowClass,
											isEqual(value, formData?.[name]?.value) ? DropdownSelectedRow : '',
											input?.toLowerCase() === labelParser(value)?.toLowerCase()
												? DropdownSelectedRow
												: '',
										)}
										onClick={() => onSelect(value)}
									>
										{columnParsers.map(({ column, parser }) => (
											<td key={column} className={DropdownCellClass}>
												{parser(value)}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : null}
			</div>
		</div>
	);
}
