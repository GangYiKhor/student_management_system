import clsx from 'clsx';
import React, { useState } from 'react';
import { DateInput } from '../../../components/inputs/date-input';
import { NumberInput } from '../../../components/inputs/number-input';
import { SelectInput } from '../../../components/inputs/select-input';
import { TextInput } from '../../../components/inputs/text-input';
import { TimeInput } from '../../../components/inputs/time-input';
import Modal, { ModalButtons } from '../../../components/modal';
import { useFormContext } from '../../../components/providers/form-providers';
import Row from '../../../components/row';
import Separator from '../../../components/separator';
import { useGetOptions } from '../../../hooks/use-get';
import { useGetFormOptions } from '../../../hooks/use-get-form-options';
import { TEACHER_API_PATH } from '../../../utils/constants/constants';
import {
	GrayButtonClass,
	GreenButtonClass,
	RedButtonClass,
} from '../../../utils/tailwindClass/button';
import { ClassCreateDto } from '../../../utils/types/dtos/classes/create';
import { ClassUpdateDto } from '../../../utils/types/dtos/classes/update';
import { TeachersGetDto } from '../../../utils/types/dtos/teachers/get';
import { TeachersGetResponse } from '../../../utils/types/responses/teachers/get';
import { dayOptions } from '../constants';
import { useIsDirty } from '../hooks/useIsDirty';
import { useVerifyInputs } from '../hooks/useVerifyInputs';
import { EditData, FormDataType } from '../types';

type PropType = {
	closeModal: () => void;
	handler: (createData: ClassCreateDto | ClassUpdateDto) => Promise<void>;
	data?: EditData;
};

export function ClassesModal({ closeModal, data, handler }: Readonly<PropType>) {
	const { formData, setFormData } = useFormContext<FormDataType>();
	const [confirmation, setConfirmation] = useState(false);
	const [closeConfirmation, setCloseConfirmation] = useState(false);

	const verifyInputs = useVerifyInputs({ formData, setFormData });
	const isDirty = useIsDirty({ formData, data });

	const getForms = useGetFormOptions();
	const getTeachers = useGetOptions<TeachersGetDto, TeachersGetResponse>(
		TEACHER_API_PATH,
		value => value.teacher_name,
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
					const submitData: ClassCreateDto | ClassUpdateDto = {
						teacher_id: formData.teacher_id?.value,
						start_date: formData.start_date?.value,
						end_date: formData.end_date?.value ?? null,
						class_year: formData.class_year?.value,
						form_id: formData.form_id?.value,
						day: formData.day?.value,
						start_time: formData.start_time?.value,
						end_time: formData.end_time?.value,
						fees: formData.fees?.value,
						is_package: formData.is_package?.value,
						class_name: formData.class_name?.value,
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
				title={data ? `Edit Class` : `Create Class`}
				closeModal={() => (isDirty() ? setCloseConfirmation(true) : closeModal())}
				closeOnBlur={false}
				buttons={modalButtons}
			>
				<div className={clsx('grid')}>
					<Row>
						<TextInput
							label="Class Name"
							name="class_name"
							placeholder="E.g. English"
							maxLength={50}
							required
						/>

						<SelectInput
							label="Form"
							name="form_id"
							queryFn={() => getForms({ is_active: true, orderBy: 'form_name asc' })}
							required
						/>
					</Row>

					<SelectInput
						label="Teacher"
						name="teacher_id"
						queryFn={() => getTeachers({ is_active: true, orderBy: 'teacher_name asc' })}
						required
					/>

					<Row>
						<NumberInput label="Fees" name="fees" prefix="RM" min={0} step={0.01} required />

						<SelectInput
							label="Package"
							name="is_package"
							options={[
								{ value: true, label: 'Yes' },
								{ value: false, label: 'No' },
							]}
							required
						/>
					</Row>

					<Separator />

					<Row>
						<NumberInput label="Year" name="class_year" min={2000} max={2200} step={1} required />

						<DateInput label="Start Date" name="start_date" required />
						<DateInput label="End Date" name="end_date" min={formData.start_date?.value} />
					</Row>

					<Row>
						<SelectInput label="Day" name="day" options={dayOptions} required />

						<TimeInput label="Start Time" name="start_time" required />

						<TimeInput label="End Time" name="end_time" min={formData.start_time?.value} required />
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
