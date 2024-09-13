import clsx from 'clsx';
import { kebabCase } from 'lodash';
import { useEffect, useState } from 'react';
import { useFormContext } from '../providers/form-providers';
import { RequiredIcon } from '../required';

type PropType = {
	id?: string;
	label: string;
	name: string;
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
	valueParser = value => value,
	checkIf = value => !!value,
	required,
	locked,
	labelLocation = 'right',
}: Readonly<PropType>) {
	id = id ?? kebabCase(name);

	const { formData, setFormData } = useFormContext();
	const [checked, setChecked] = useState<boolean>(false);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ name, value: valueParser(e.target.checked), valid: true });
		setChecked(e.target.checked);
	};

	useEffect(() => {
		const newData = checkIf(formData?.[name]?.value);
		if (newData !== checked) {
			setChecked(newData);
		}
	}, [formData?.[name]?.value]);

	return (
		<div
			className={clsx(
				'p-2',
				['top', 'bottom'].includes(labelLocation) ? 'flex flex-col text-center gap-1' : '',
			)}
		>
			{['left', 'top'].includes(labelLocation) ? (
				<label htmlFor={id} className={clsx('select-none')}>
					{label}
					<RequiredIcon required={required} />
				</label>
			) : null}

			<input
				type="checkbox"
				id={id}
				name={name}
				checked={checked}
				onChange={locked ? () => {} : onChange}
				required
				disabled={locked}
				className={clsx('mx-2', formData?.[name]?.valid === false && 'error')}
			/>

			{['right', 'bottom'].includes(labelLocation) ? (
				<label htmlFor={id} className={clsx('select-none')}>
					<RequiredIcon required={required} />
					{label}
				</label>
			) : null}
		</div>
	);
}
