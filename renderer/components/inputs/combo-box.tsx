import clsx from 'clsx';
import { isEqual } from 'lodash';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { getPropertyValue } from '../../utils/propertyParser';
import { GrayText } from '../../utils/tailwindClass/text';
import { CloseButtonIcon } from '../close-button-icon';
import { RequiredIcon } from '../required';
import { useFormHandlerContext } from './form';
import {
	ContainerFlexRowGrow,
	getContainerClass,
	getInputClass,
	getLabelClass,
	InputTextClass,
	InvalidTextBoxClass,
} from './input-css';

const DropdownClass = clsx(
	'absolute z-50 top-9',
	'w-full max-h-[200px]',
	'-mx-2',
	'bg-slate-100 dark:bg-slate-900',
	'border-x-2 border-b-2 border-gray-300 dark:border-gray-500 rounded-b-md',
	'overflow-auto',
);
const DropdownTableClass = clsx('w-full');
const DropdownRowClass = clsx(
	'h-[30px]',
	'hover:bg-slate-200 dark:hover:bg-slate-800 hover:cursor-pointer',
	'active:bg-slate-300 dark:active:bg-slate-700',
	'text-black dark:text-white',
);
const DropdownSelectedRow = clsx('font-bold', 'bg-slate-200 dark:bg-slate-800');
const DropdownCellClass = clsx('px-3', 'select-none');

export type DropDownColumnParser<Data = any> = {
	column: string;
	parser: (value: Data) => string;
}[];

type PropType = {
	id: string;
	label: string;
	name?: string;
	defaultValue?: any;
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
	locked?: boolean;
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
	defaultValue,
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
	locked,
	leftLabel,
	labelClassAddOn,
}: Readonly<PropType>) {
	const {
		formData,
		initialiseForm,
		updateFieldProperties,
		updateFieldValue,
		updateFieldValid,
		formInitialised,
		formLocked,
		keepData,
		keepDefault,
	} = useFormHandlerContext();
	const [input, setInput] = useState<string>('');
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>();
	locked ||= formLocked;
	name ??= label;

	columns = Array.from(new Set([labelColumn, ...(columns ?? Object.keys(options?.[0] ?? {}))]));
	columnParsers ??=
		columns?.map(column => ({
			column,
			parser: value => getPropertyValue(value, column),
		})) ?? [];

	const containerClass = getContainerClass(leftLabel);
	const labelClass = getLabelClass(leftLabel);
	const inputClass = clsx(ContainerFlexRowGrow, 'relative', getInputClass(leftLabel, locked));

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (locked) return;
		setInput(e.target.value);

		const foundIndex = options?.findIndex(record => {
			return labelParser(record).toLowerCase().includes(e.target.value?.toLowerCase());
		});

		const scrollHeight = foundIndex < 0 ? 0 : foundIndex * 30 + 30;
		dropdownRef?.current?.scrollTo({ top: scrollHeight });
	};

	const onSelect = (selected: { [key: string]: any }) => {
		if (locked) return;
		setInput(labelParser(selected) ?? '');
		updateFieldValue([{ field: id, value: selected ? valueParser(selected) : null }]);
		setShowDropdown(false);
		onUpdate?.();
	};

	const show = () => {
		setShowDropdown(!showDropdown);
	};

	const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (locked) return;
		if (e.key === 'Enter') {
			const foundIndex = options?.findIndex(record => {
				return labelParser(record) === input;
			});

			if (foundIndex > -1) {
				updateFieldValue([{ field: id, value: valueParser(options[foundIndex]) }]);
				setShowDropdown(false);
				onUpdate?.();
			} else {
				updateFieldValid([{ field: id, valid: false }]);
			}
		} else if (new RegExp(/[a-zA-Z0-9`~!@#$%^&*()_+={}[\]\\|;':",./<>?-]/).exec(e.key)) {
			setShowDropdown(true);
		}
	};

	const onBlur = () => {
		if (input !== '') {
			const foundIndex = options?.findIndex(record => {
				return labelParser(record).toLowerCase() === input?.toLowerCase();
			});

			if (foundIndex < 0 && required) {
				setInput('');
			} else if (!isEqual(valueParser(options[foundIndex]), formData?.[id]?.value)) {
				setInput(labelParser(options[foundIndex]));
				updateFieldValue([{ field: id, value: valueParser(options[foundIndex]) }]);
				onUpdate?.();
			}
		}

		setTimeout(() => setShowDropdown(false), 100);
	};

	const onClear = () => {
		setInput('');
		updateFieldValue([{ field: id, value: null }]);
		onUpdate?.();
		setShowDropdown(false);
	};

	useEffect(() => {
		if (formData?.[id]?.value === undefined) {
			setInput('');
			return;
		}

		const foundIndex = options?.findIndex(record => {
			return isEqual(valueParser(record), formData?.[id]?.value);
		});

		const newData = foundIndex > -1 ? labelParser(options[foundIndex]) : '';
		if (newData !== input) {
			setInput(newData);
		}
	}, [formData?.[id]?.value, options]);

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
				const foundIndex = options?.findIndex(record => {
					return isEqual(valueParser(record), formData?.[id]?.value);
				});
				setInput(foundIndex > -1 ? labelParser(options[foundIndex]) : '');
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

			<div
				className={clsx(
					formData?.[id]?.valid === false && InvalidTextBoxClass,
					inputClass,
					showDropdown ? 'rounded-b-none' : '',
				)}
			>
				{notSearchable ? (
					<button
						onClick={show}
						onBlur={onBlur}
						className={clsx(InputTextClass, input === '' && GrayText)}
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
						disabled={locked}
					/>
				)}

				<button onClick={show}>{showDropdown ? <ChevronUp /> : <ChevronDown />}</button>

				{!locked ? (
					<button onClick={onClear}>
						<CloseButtonIcon />
					</button>
				) : null}

				{showDropdown ? (
					<div className={DropdownClass} ref={dropdownRef}>
						<table className={DropdownTableClass /* NOSONAR */}>
							<tbody>
								<tr
									className={clsx(
										DropdownRowClass,
										formData?.[id]?.value === undefined ? DropdownSelectedRow : '',
									)}
									onClick={() => onSelect(undefined)}
								>
									<td colSpan={columns.length} className={clsx(DropdownCellClass, GrayText)}>
										{placeholder}
									</td>
								</tr>

								{options
									.filter(value => !locked || isEqual(value, formData?.[id]?.value)) // Is disabled, show current only
									.map((value, index) => (
										<tr
											key={`${labelParser(value)}-${index}`}
											className={clsx(
												DropdownRowClass,
												isEqual(value, formData?.[id]?.value) ? DropdownSelectedRow : '',
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
