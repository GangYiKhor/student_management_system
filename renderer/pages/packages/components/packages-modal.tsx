import clsx from 'clsx';
import React, { useState } from 'react';
import { DateInput } from '../../../components/inputs/date-input';
import { NumberInput } from '../../../components/inputs/number-input';
import { SelectInput } from '../../../components/inputs/select-input';
import Modal, { ModalButtons } from '../../../components/modal';
import { useFormContext } from '../../../components/providers/form-providers';
import Row from '../../../components/row';
import Separator from '../../../components/separator';
import { useGetOptions } from '../../../hooks/use-get';
import { STUDENT_FORM_API_PATH } from '../../../utils/constants/constants';
import {
	GrayButtonClass,
	GreenButtonClass,
	RedButtonClass,
} from '../../../utils/tailwindClass/button';
import { PackageCreateDto } from '../../../utils/types/dtos/packages/create';
import { PackageUpdateDto } from '../../../utils/types/dtos/packages/update';
import { StudentFormsGetDto } from '../../../utils/types/dtos/student-forms/get';
import { StudentFormsGetResponse } from '../../../utils/types/responses/student-forms/get';
import { useIsDirty } from '../hooks/useIsDirty';
import { useVerifyInputs } from '../hooks/useVerifyInputs';
import { EditData, FormDataType } from '../types';

type PropType = {
	closeModal: () => void;
	handler: (createData: PackageCreateDto | PackageUpdateDto) => Promise<void>;
	data?: EditData;
};

export function PackagesModal({ closeModal, handler, data }: Readonly<PropType>) {
	const { formData, setFormData } = useFormContext<FormDataType>();
	const [confirmation, setConfirmation] = useState(false);
	const [closeConfirmation, setCloseConfirmation] = useState(false);

	const verifyInputs = useVerifyInputs({ formData, setFormData });
	const isDirty = useIsDirty({ formData, data });

	const getForms = useGetOptions<StudentFormsGetDto, StudentFormsGetResponse>(
		STUDENT_FORM_API_PATH,
		value => value.form_name,
		value => value.id,
	);

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
					const submitData: PackageCreateDto | PackageUpdateDto = {
						form_id: formData.form_id?.value,
						start_date: formData.start_date?.value,
						end_date: formData.end_date?.value ?? null,
						subject_count_from: formData.subject_count_from?.value,
						subject_count_to: formData.subject_count_to?.value,
						discount_per_subject: formData.discount_per_subject?.value,
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
				title={data ? `Edit Package` : `Create Package`}
				closeModal={() => (isDirty() ? setCloseConfirmation(true) : closeModal())}
				closeOnBlur={false}
				buttons={modalButtons}
			>
				<div className={clsx('grid')}>
					<SelectInput
						label="Form"
						name="form_id"
						queryFn={() => getForms({ is_active: true, orderBy: 'form_name asc' })}
						required
					/>

					<Row>
						<NumberInput
							label="Subject Count From"
							name="subject_count_from"
							min={0}
							step={1}
							required
						/>
						<NumberInput
							label="Subject Count To"
							name="subject_count_to"
							min={formData.subject_count_from?.value}
							step={1}
							required
						/>
					</Row>

					<NumberInput
						label="Discount Per Subject"
						name="discount_per_subject"
						prefix="RM"
						min={0}
						step={0.01}
						required
					/>

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
