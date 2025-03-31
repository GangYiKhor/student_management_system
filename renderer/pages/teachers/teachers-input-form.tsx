import clsx from 'clsx';
import { TextInput } from '../../components/inputs/text-input';
import { TextAreaInput } from '../../components/inputs/textarea-input';
import Separator from '../../components/separator';
import { icFormat, icFormatRevert } from '../../utils/formatting/icFormatting';

type PropType = {
	defaultValue?: {
		teacher_name?: string;
		ic?: string;
		phone_number?: string;
		email?: string;
		address?: string;
	};
};

export function TeachersInputForm({ defaultValue }: Readonly<PropType>) {
	return (
		<div className={clsx('grid')}>
			<TextInput
				id="teacher_name"
				label="Teacher Name"
				defaultValue={defaultValue.teacher_name}
				maxLength={255}
				required
			/>

			<TextInput
				id="phone_number"
				label="Phone Number"
				placeholder="0123456789"
				tel
				defaultValue={defaultValue.phone_number}
				required
			/>

			<Separator />

			<TextInput
				id="ic"
				label="IC"
				placeholder="010203070506"
				onFocusFormat={icFormatRevert}
				onBlurFormat={icFormat}
				defaultValue={defaultValue.ic}
			/>

			<TextInput id="email" label="Email" email defaultValue={defaultValue.email} />

			<TextAreaInput
				id="address"
				label="Address"
				maxLength={200}
				defaultValue={defaultValue.address}
			/>
		</div>
	);
}
