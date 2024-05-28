import clsx from 'clsx';
import React, { useState } from 'react';
import { DateInput } from '../../../components/inputs/date-input';
import { NumberInput } from '../../../components/inputs/number-input';
import { SelectInput } from '../../../components/inputs/select-input';
import Modal, { ModalButtons } from '../../../components/modal';
import { useFormContext } from '../../../components/providers/form-providers';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import Row from '../../../components/row';
import Separator from '../../../components/separator';
import { GrayButtonClass, GreenButtonClass, RedButtonClass } from '../../../utils/class/button';
import { TaxesCreateDto } from '../../../utils/types/dtos/taxes/create';
import { TaxUpdateDto } from '../../../utils/types/dtos/taxes/update';
import { useIsDirty } from '../hooks/useIsDirty';
import { useVerifyInputs } from '../hooks/useVerifyInputs';
import { EditData, FormDataType } from '../types';

type PropType = {
	closeModal: () => void;
	handler: (createData: TaxesCreateDto | TaxUpdateDto) => Promise<void>;
	data?: EditData;
};

export function TaxesModal({ closeModal, data, handler }: Readonly<PropType>) {
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
					const submitData = {
						percentage: formData.percentage?.value,
						start_date: formData.start_date?.value,
						end_date: formData.end_date?.value ?? null,
						inclusive: formData.inclusive?.value,
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
				title={data ? `Edit Tax` : `Create Tax`}
				closeModal={() => (isDirty() ? setCloseConfirmation(true) : closeModal())}
				closeOnBlur={false}
				buttons={modalButtons}
			>
				<div className={clsx('grid')}>
					<Row>
						<NumberInput
							label="Percentage"
							name="percentage"
							suffix="%"
							min={0}
							step={0.01}
							required
						/>

						<SelectInput
							label="Inclusive"
							name="inclusive"
							placeholder="Select a status"
							options={[
								{ value: true, label: 'Yes' },
								{ value: false, label: 'No' },
							]}
							required
						/>
					</Row>

					<Separator />

					<Row>
						<DateInput label="Start Date" name="start_date" required />
						<DateInput label="End Date" name="end_date" min={formData.start_date?.value} />
					</Row>
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
