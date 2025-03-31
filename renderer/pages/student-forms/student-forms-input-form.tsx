import clsx from 'clsx';
import { TextInput } from '../../components/inputs/text-input';

type PropType = {
	defaultValue?: {
		form_name?: string;
		is_active?: boolean;
	};
};

export function StudentFormsInputForm({ defaultValue }: Readonly<PropType>) {
	return (
		<div className={clsx('grid')}>
			<TextInput
				id="form_name"
				label="Form Name"
				placeholder="E.g. F1 / Std 4"
				maxLength={50}
				defaultValue={defaultValue?.form_name}
				required
			/>
		</div>
	);
}
