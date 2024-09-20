import React, { useState } from 'react';
import { Form } from '../../../components/inputs/form';
import { TextInput } from '../../../components/inputs/text-input';
import Modal, { ModalButtons } from '../../../components/modal';
import { useFormContextWithId } from '../../../components/providers/form-providers';
import {
	GrayButtonClass,
	GreenButtonClass,
	RedButtonClass,
} from '../../../utils/tailwindClass/button';
import { StudentFormCreateDto } from '../../../utils/types/dtos/student-forms/create';
import { StudentFormUpdateDto } from '../../../utils/types/dtos/student-forms/update';
import { EditFormId, formDefaultValue, formDefaultValueFilled } from '../constants';
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
	const { formData, setFormData } = useFormContextWithId<FormDataType>(EditFormId);
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
					const submitData: StudentFormCreateDto = {
						form_name: formData?.form_name?.value?.trim(),
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
				title={data ? 'Edit Student Form' : 'Create Student Form'}
				closeModal={() => (isDirty() ? setCloseConfirmation(true) : closeModal())}
				closeOnBlur={false}
				buttons={modalButtons}
			>
				<Form
					formId={EditFormId}
					defaultValue={data ? formDefaultValueFilled(data) : formDefaultValue()}
				>
					<TextInput
						label="Form Name"
						name="form_name"
						placeholder="E.g. F1 / Std 4"
						maxLength={50}
						required
					/>
				</Form>
			</Modal>

			{confirmation ? (
				<Modal
					title="Confirmation"
					closeModal={() => setConfirmation(false)}
					closeOnBlur={false}
					buttons={confirmationButtons}
				>
					<p>Confirm Create {formData?.form_name?.value?.trim()}?</p>
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
