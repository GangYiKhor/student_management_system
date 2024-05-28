import clsx from 'clsx';
import React, { useState } from 'react';
import { DateInput } from '../../../components/inputs/date-input';
import { TextInput } from '../../../components/inputs/text-input';
import Modal, { ModalButtons } from '../../../components/modal';
import { useFormContext } from '../../../components/providers/form-providers';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import { GrayButtonClass, GreenButtonClass, RedButtonClass } from '../../../utils/class/button';
import { HolidayCreateDto } from '../../../utils/types/dtos/holidays/create';
import { HolidayUpdateDto } from '../../../utils/types/dtos/holidays/update';
import { useIsDirty } from '../hooks/useIsDirty';
import { useVerifyInputs } from '../hooks/useVerifyInputs';
import { EditData, FormDataType } from '../types';

type PropType = {
	closeModal: () => void;
	handler: (createData: HolidayCreateDto | HolidayUpdateDto) => Promise<void>;
	data?: EditData;
};

export function HolidaysModal({ closeModal, data, handler }: Readonly<PropType>) {
	const { formData, setFormData } = useFormContext<FormDataType>();
	const [confirmation, setConfirmation] = useState(false);
	const [closeConfirmation, setCloseConfirmation] = useState(false);
	const { setNotification } = useNotificationContext();

	const verifyInputs = useVerifyInputs({ formData, setFormData });
	const isDirty = useIsDirty({ formData });

	const modalButtons: ModalButtons = [
		{
			text: data ? 'Update' : 'Create',
			class: GreenButtonClass,
			action: () => verifyInputs() && setConfirmation(true),
		},
	];

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
					const submitData: HolidayCreateDto | HolidayUpdateDto = {
						date: formData.date.value,
						description: formData.description.value,
					};

					await handler(submitData);
					setConfirmation(false);
					closeModal();
				} catch (error) {
					setNotification({ message: error });
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
				title={data ? `Edit Holiday` : `Create Holiday`}
				closeModal={() => (isDirty() ? setCloseConfirmation(true) : closeModal())}
				closeOnBlur={false}
				buttons={modalButtons}
			>
				<div className={clsx('grid')}>
					<DateInput label="Date" name="date" required />

					<TextInput
						label="Description"
						name="description"
						placeholder="E.g. Labour Day"
						maxLength={100}
						required
					/>
				</div>
			</Modal>

			{confirmation ? (
				<Modal
					title="Confirmation"
					closeModal={() => setConfirmation(false)}
					closeOnBlur={false}
					buttons={confirmationButtons}
				>
					<p>Confirm {data ? 'Update' : 'Create'}?</p>
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
