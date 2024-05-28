import React, { useState } from 'react';
import { TextInput } from '../../../components/inputs/text-input';
import Modal, { ModalButtons } from '../../../components/modal';
import { useFormContext } from '../../../components/providers/form-providers';
import { GrayButtonClass, GreenButtonClass, RedButtonClass } from '../../../utils/class/button';
import { StudentFormCreateDto } from '../../../utils/types/dtos/student-forms/create';
import { StudentFormUpdateDto } from '../../../utils/types/dtos/student-forms/update';
import { useIsDirty } from '../hooks/useIsDirty';
import { useVerifyInputs } from '../hooks/useVerifyInputs';
import { EditData, FormDataType } from '../types';

type PropType = {
	closeModal: () => void;
	handler: (createData: StudentFormCreateDto | StudentFormUpdateDto) => Promise<void>;
	handleActivate?: () => void;
	data?: EditData;
};

export function StudentFormsModal({
	closeModal,
	handler,
	handleActivate,
	data,
}: Readonly<PropType>) {
	const { formData, setFormData } = useFormContext<FormDataType>();
	const [confirmation, setConfirmation] = useState(false);
	const [closeConfirmation, setCloseConfirmation] = useState(false);

	const verifyInputs = useVerifyInputs({ formData, setFormData });
	const isDirty = useIsDirty({ formData, data });

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
					const submitData: StudentFormCreateDto = { form_name: formData.form_name?.value?.trim() };
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
				title={data ? 'Create Student Form' : 'Edit Student Form'}
				closeModal={() => (isDirty() ? setCloseConfirmation(true) : closeModal())}
				closeOnBlur={false}
				buttons={modalButtons}
			>
				<TextInput
					label="Form Name"
					name="form_name"
					placeholder="E.g. F1 / Std 4"
					maxLength={50}
					required
				/>
			</Modal>

			{confirmation ? (
				<Modal
					title="Confirmation"
					closeModal={() => setConfirmation(false)}
					closeOnBlur={false}
					buttons={confirmationButtons}
				>
					<p>Confirm Create {formData.form_name?.value?.trim()}?</p>
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
