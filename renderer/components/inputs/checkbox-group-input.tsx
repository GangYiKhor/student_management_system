import clsx from 'clsx';
import { isEqual, kebabCase } from 'lodash';
import { CheckboxInput } from './checkbox-input';

type PropType = {
	id?: string;
	labels: string[];
	name: string;
	valueGroup: any[];
	required?: boolean;
	locked?: boolean;
	labelLocation?: 'top' | 'left' | 'right' | 'bottom';
};

/**
 * The number of labels should be 1 less than valueGroup, as the first one is defaultValue (Not shown in label)
 * @param valueGroup [defaultValue, value1, value2, ...]
 */
export function CheckboxGroupInput({
	id,
	labels,
	name,
	valueGroup,
	required,
	locked,
	labelLocation = 'right',
}: Readonly<PropType>) {
	id = id ?? kebabCase(name);
	const defaultValue = valueGroup[0];
	const allValues = valueGroup.slice(1);

	return (
		<div className={clsx('flex', 'my-2', 'border-2', 'border-gray-300', 'dark:border-gray-600')}>
			{allValues.map((value, index) => (
				<CheckboxInput
					id={`${id}-${index}`}
					key={`${id}-${index}`}
					label={labels[index]}
					name={name}
					valueParser={checked => (checked ? value : defaultValue)}
					checkIf={formValue => isEqual(formValue, value)}
					required={required}
					labelLocation={labelLocation}
					locked={locked}
				/>
			))}
		</div>
	);
}
