import clsx from 'clsx';
import React, { useState } from 'react';
import { DateInput } from '../../../components/inputs/date-input';
import { NumberInput } from '../../../components/inputs/number-input';
import { SelectClass } from '../../../components/inputs/select-class';
import { SelectInput } from '../../../components/inputs/select-input';
import { TextInput } from '../../../components/inputs/text-input';
import { TextAreaInput } from '../../../components/inputs/textarea-input';
import Modal, { ModalButtons } from '../../../components/modal';
import { useFormContext } from '../../../components/providers/form-providers';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import Row from '../../../components/row';
import { Section } from '../../../components/section';
import Separator from '../../../components/separator';
import { useCustomQuery } from '../../../hooks/use-custom-query';
import { useGet, useGetOptions } from '../../../hooks/use-get';
import {
	CLASS_COUNT,
	PACKAGE_API_PATH,
	STUDENT_FORM_API_PATH,
} from '../../../utils/constants/constants';
import { icFormat, icFormatRevert } from '../../../utils/formatting/icFormatting';
import {
	phoneNumberFormat,
	phoneNumberFormatRevert,
} from '../../../utils/formatting/phoneNumberFormatting';
import {
	GrayButtonClass,
	GreenButtonClass,
	RedButtonClass,
} from '../../../utils/tailwindClass/button';
import { PackagesGetDto } from '../../../utils/types/dtos/packages/get';
import { StudentFormsGetDto } from '../../../utils/types/dtos/student-forms/get';
import { StudentCreateDto } from '../../../utils/types/dtos/students/create';
import { StudentUpdateDto } from '../../../utils/types/dtos/students/update';
import { ClassesGetResponse } from '../../../utils/types/responses/classes/get';
import { PackagesGetResponses } from '../../../utils/types/responses/packages/get';
import { StudentFormsGetResponse } from '../../../utils/types/responses/student-forms/get';
import { useIsDirty } from '../hooks/useIsDirty';
import { useVerifyInputs } from '../hooks/useVerifyInputs';
import { EditData, FormDataType } from '../types';
import { getAllFees, getDiscountedFees, getPackageCount } from '../utils/feesCalculations';

type PropType = {
	closeModal: () => void;
	handler: (createData: StudentCreateDto | StudentUpdateDto, classIds: number[]) => Promise<void>;
	handleActivate?: () => void;
	data?: EditData;
};

export function StudentsModal({ closeModal, data, handler, handleActivate }: Readonly<PropType>) {
	const { formData, setFormData } = useFormContext<FormDataType>();
	const [confirmation, setConfirmation] = useState(false);
	const [packageCount, setPackageCount] = useState(0);
	const [closeConfirmation, setCloseConfirmation] = useState(false);
	const { setNotification } = useNotificationContext();

	const verifyInputs = useVerifyInputs({ formData, setFormData });
	const isDirty = useIsDirty({ formData, data });

	const getForms = useGetOptions<StudentFormsGetDto, StudentFormsGetResponse>(
		STUDENT_FORM_API_PATH,
		value => value.form_name,
		value => value.id,
	);
	const getPackage = useGet<PackagesGetDto, PackagesGetResponses>(PACKAGE_API_PATH);

	const { data: packageData } = useCustomQuery<PackagesGetResponses>({
		queryKey: ['currentPackage'],
		queryFn: () =>
			getPackage({
				subject_count: packageCount,
				is_active: true,
			}),
		fetchOnVariable: [packageCount],
	});

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
					const submitData: StudentCreateDto | StudentUpdateDto = {
						student_name: formData.student_name?.value,
						form_id: formData.form_id?.value,
						reg_date: formData.reg_date?.value,
						reg_year: formData.reg_year?.value,
						gender: formData.gender?.value ?? null,
						ic: formData.ic?.value ?? null,
						school: formData.school?.value ?? null,
						phone_number: formData.phone_number?.value ?? null,
						parent_phone_number: formData.parent_phone_number?.value ?? null,
						email: formData.email?.value ?? null,
						address: formData.address?.value ?? null,
					};

					const classIds: number[] = [];
					for (let i = 1; i <= CLASS_COUNT; i++) {
						classIds.push((formData[`class_${i}`]?.value as ClassesGetResponse).id);
					}

					await handler(submitData, classIds);
					await handler(submitData, []);

					setConfirmation(false);
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
				title={data ? `Edit Student` : `Create Student`}
				closeModal={() => (isDirty() ? setCloseConfirmation(true) : closeModal())}
				closeOnBlur={false}
				buttons={modalButtons}
			>
				<div className={clsx('grid')}>
					<TextInput label="Name" name="student_name" maxLength={200} required />

					<Row>
						<SelectInput
							label="Form"
							name="form_id"
							queryFn={() => getForms({ is_active: true, orderBy: 'form_name asc' })}
							required
						/>

						<DateInput label="Reg Date" name="reg_date" required />

						<NumberInput
							label="Academic Year"
							name="reg_year"
							min={2000}
							max={2200}
							step={1}
							required
						/>
					</Row>

					<Section title="Student Details" hideable defaultHide={!!data}>
						<SelectInput
							label="Gender"
							name="gender"
							placeholder="Not Specified"
							options={[
								{ value: 'male', label: 'Male' },
								{ value: 'female', label: 'Female' },
							]}
						/>

						<Row>
							<TextInput
								label="IC"
								name="ic"
								placeholder="010203070809"
								maxLength={20}
								onBlurFormat={icFormat}
								onFocusFormat={icFormatRevert}
							/>

							<TextInput label="School" name="school" maxLength={200} />
						</Row>

						<Row>
							<TextInput
								label="Phone Number"
								name="phone_number"
								placeholder="0123456789"
								maxLength={20}
								onBlurFormat={phoneNumberFormat}
								onFocusFormat={phoneNumberFormatRevert}
							/>

							<TextInput
								label="Parent H/P"
								name="parent_phone_number"
								placeholder="0123456789"
								maxLength={20}
								onBlurFormat={phoneNumberFormat}
								onFocusFormat={phoneNumberFormatRevert}
							/>
						</Row>

						<TextInput email label="Email" name="email" maxLength={200} />
						<TextAreaInput label="Address" name="address" maxLength={250} />
					</Section>

					<Section title="Classes" hideable>
						{new Array(CLASS_COUNT).fill(null).map((_, index) => {
							const count = index + 1;
							const formName = `class_${count}`;
							return (
								<div key={`class-${count}`} className={clsx('flex', 'items-center', 'gap-2')}>
									<SelectClass
										label={`Class ${count}`}
										name={formName}
										form={formData.form_id?.value}
										onUpdate={() => setPackageCount(getPackageCount(formData))}
									/>
									<span>{`RM ${getDiscountedFees(formData[formName]?.value as ClassesGetResponse, packageData?.[0])?.toFixed(2)}`}</span>
								</div>
							);
						})}
						<Separator />
						<div className={clsx('flex', 'justify-end')}>
							<span className={clsx('font-bold')}>{`RM ${getAllFees(
								formData,
								packageData?.[0],
							).toFixed(2)}`}</span>
						</div>
					</Section>
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
