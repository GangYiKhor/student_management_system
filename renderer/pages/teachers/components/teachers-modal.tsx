import clsx from 'clsx';
import React, { useState } from 'react';
import { TextInput } from '../../../components/inputs/text-input';
import { TextAreaInput } from '../../../components/inputs/textarea-input';
import Modal, { ModalButtons } from '../../../components/modal';
import { useFormContext } from '../../../components/providers/form-providers';
import Separator from '../../../components/separator';
import { GrayButtonClass, GreenButtonClass, RedButtonClass } from '../../../utils/class/button';
import { icFormat, icFormatRevert } from '../../../utils/formatting/icFormatting';
import {
	phoneNumberFormat,
	phoneNumberFormatRevert,
} from '../../../utils/formatting/phoneNumberFormatting';
import { TeacherCreateDto } from '../../../utils/types/dtos/teachers/create';
import { TeacherUpdateDto } from '../../../utils/types/dtos/teachers/update';
import { useIsDirty } from '../hooks/useIsDirty';
import { useVerifyInputs } from '../hooks/useVerifyInputs';
import { EditData, FormDataType } from '../types';

type PropType = {
	closeModal: () => void;
	handler: (createData: TeacherCreateDto | TeacherUpdateDto) => Promise<void>;
	handleActivate?: () => void;
	data?: EditData;
};

export function TeachersModal({ closeModal, handler, handleActivate, data }: Readonly<PropType>) {
	const { formData, setFormData } = useFormContext<FormDataType>();
	const [confirmation, setConfirmation] = useState(false);
	const [closeConfirmation, setCloseConfirmation] = useState(false);

	const verifyInputs = useVerifyInputs({ formData, setFormData });
	const isDirty = useIsDirty({ formData });

	const modalButtons: ModalButtons = [
		{
			text: data ? 'Update' : 'Create',
			class: GreenButtonClass,
			action: () => verifyInputs() && setConfirmation(true),
		},
	];

	if (data) {
		modalButtons.unshift({
			text: data.is_active ? 'Deactivate' : 'Activate',
			class: data.is_active ? RedButtonClass : GreenButtonClass,
			action: () => handleActivate(),
		});
	}

	const confirmationButtons: ModalButtons = [
		{
			text: 'Cancel',
			class: RedButtonClass,
			action: () => setConfirmation(false),
		},
		{
			text: 'Confirm',
			class: GreenButtonClass,
			action: async () => {
				try {
					const submitData: TeacherCreateDto | TeacherUpdateDto = {
						teacher_name: formData.teacher_name?.value?.trim(),
						ic: formData.ic?.value?.trim() || null,
						phone_number: formData.phone_number?.value.trim(),
						email: formData.email?.value?.trim() || null,
						address: formData.address?.value?.trim() || null,
					};

					await handler(submitData);
					setConfirmation(false);
					closeModal();
				} catch (error) {
					setConfirmation(false);
				}
			},
		},
	];

	const closeConfirmationButtons: ModalButtons = [
		{
			text: 'Cancel',
			class: GrayButtonClass,
			action: () => setCloseConfirmation(false),
		},
		{
			text: 'Discard',
			class: RedButtonClass,
			action: () => {
				setCloseConfirmation(false);
				closeModal();
			},
		},
	];

	return (
		<React.Fragment>
			<Modal
				title={data ? 'Create Teacher' : 'Edit Teacher'}
				closeModal={() => (isDirty() ? setCloseConfirmation(true) : closeModal())}
				closeOnBlur={false}
				buttons={modalButtons}
			>
				<div className={clsx('grid')}>
					<TextInput label="Teacher Name" name="teacher_name" required />

					<TextInput
						label="Phone Number"
						name="phone_number"
						placeholder="0123456789"
						onFocusFormat={phoneNumberFormatRevert}
						onBlurFormat={phoneNumberFormat}
						required
					/>

					<Separator />

					<TextInput
						label="IC"
						name="ic"
						placeholder="010203070506"
						onFocusFormat={icFormatRevert}
						onBlurFormat={icFormat}
					/>

					<TextInput label="Email" name="email" email />

					<TextAreaInput label="Address" name="address" maxLength={200} />
				</div>
			</Modal>

			{confirmation ? (
				<Modal
					title="Confirmation"
					closeModal={() => setConfirmation(false)}
					closeOnBlur={false}
					buttons={confirmationButtons}
				>
					<p>Confirm {data ? 'Update' : 'Registration'}?</p>
				</Modal>
			) : null}

			{closeConfirmation ? (
				<Modal
					title="Confirmation"
					closeModal={() => setCloseConfirmation(false)}
					closeOnBlur={false}
					buttons={closeConfirmationButtons}
				>
					<p>Discard data?</p>
				</Modal>
			) : null}
		</React.Fragment>
	);
}
