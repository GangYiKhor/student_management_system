import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { ComboBox } from '../../../components/inputs/combo-box';
import { DateInput } from '../../../components/inputs/date-input';
import { Form } from '../../../components/inputs/form';
import { NumberInput } from '../../../components/inputs/number-input';
import { SelectInput } from '../../../components/inputs/select-input';
import { TextInput } from '../../../components/inputs/text-input';
import Modal, { ModalButtons } from '../../../components/modal';
import { useFormContextWithId } from '../../../components/providers/form-providers';
import Row from '../../../components/row';
import Separator from '../../../components/separator';
import { useCustomQuery } from '../../../hooks/use-custom-query';
import { useGetStudentComboBoxOptionsIdOnly } from '../../../hooks/use-get-student-options';
import { dateOperator } from '../../../utils/dateOperations';
import {
	GrayButtonClass,
	GreenButtonClass,
	RedButtonClass,
} from '../../../utils/tailwindClass/button';
import { GrayInfoText } from '../../../utils/tailwindClass/text';
import { VoucherCreateDto } from '../../../utils/types/dtos/vouchers/create';
import { VoucherUpdateDto } from '../../../utils/types/dtos/vouchers/update';
import { EditFormId, formDefaultValue, formDefaultValueFilled } from '../constants';
import { useIsDirty } from '../hooks/useIsDirty';
import { useVerifyInputs } from '../hooks/useVerifyInputs';
import { EditData, FormDataType } from '../types';

type PropType = {
	closeModal: () => void;
	handler: (createData: VoucherCreateDto | VoucherUpdateDto) => Promise<void>;
	data?: EditData;
};

export function VouchersModal({ closeModal, data, handler }: Readonly<PropType>) {
	const { formData, setFormData } = useFormContextWithId<FormDataType>(EditFormId);
	const [confirmation, setConfirmation] = useState(false);
	const [closeConfirmation, setCloseConfirmation] = useState(false);

	const verifyInputs = useVerifyInputs({ formData, setFormData });
	const isDirty = useIsDirty({ formData, data });

	const getStudents = useGetStudentComboBoxOptionsIdOnly();
	const { data: studentOptions } = useCustomQuery<{ id: number; student_name: string }[]>({
		queryKey: ['students'],
		queryFn: () => getStudents({ is_active: true, orderBy: 'student_name asc' }),
	});

	useEffect(() => {
		if (formData?.duration?.value && formData?.start_date?.value == undefined) {
			setFormData({ path: 'start_date', valid: false });
			return;
		}

		switch (formData?.duration?.value) {
			case '1W':
				setFormData({
					path: 'expired_at',
					value: dateOperator(formData?.start_date?.value, 7, 'd'),
					valid: true,
				});
				break;

			case '3W':
				setFormData({
					path: 'expired_at',
					value: dateOperator(formData?.start_date?.value, 21, 'd'),
					valid: true,
				});
				break;

			case '1M':
				setFormData({
					path: 'expired_at',
					value: dateOperator(formData?.start_date?.value, 1, 'M'),
					valid: true,
				});
				break;

			case '3M':
				setFormData({
					path: 'expired_at',
					value: dateOperator(formData?.start_date?.value, 3, 'M'),
					valid: true,
				});
				break;

			case '1Y':
				setFormData({
					path: 'expired_at',
					value: dateOperator(formData?.start_date?.value, 1, 'y'),
					valid: true,
				});
				break;
		}
	}, [formData?.duration?.value]);

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
					const submitData: VoucherCreateDto | VoucherUpdateDto = {
						id: formData?.id?.value,
						student_id: formData?.student_id?.value ?? null,
						discount: formData?.discount?.value,
						is_percentage: formData?.is_percentage?.value,
						start_date: formData?.start_date?.value,
						expired_at: formData?.expired_at?.value,
						used: formData?.used?.value,
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
				title={data ? `Edit Voucher` : `Create Voucher`}
				closeModal={() => (isDirty() ? setCloseConfirmation(true) : closeModal())}
				closeOnBlur={false}
				buttons={modalButtons}
			>
				<Form
					formId={EditFormId}
					defaultValue={data ? formDefaultValueFilled(data) : formDefaultValue()}
				>
					<div className={clsx('grid')}>
						<Row>
							<TextInput
								label="Voucher ID"
								name="id"
								placeholder="Voucher123"
								maxLength={50}
								required
								locked={!!data}
							/>

							<SelectInput
								label="Condition"
								name="used"
								placeholder=""
								options={[
									{ label: 'Used', value: true },
									{ label: 'Available', value: false },
								]}
								required
							/>
						</Row>

						<ComboBox
							id="student-id"
							label="For Student"
							name="student_id"
							placeholder="Everyone"
							columns={['id', 'student_name']}
							options={studentOptions}
							labelColumn="student_name"
							valueParser={value => value?.id}
						/>
						<span className={GrayInfoText}>
							If specify student, it can only be used by that student once
						</span>
						<br />

						<Row>
							<SelectInput
								label="Voucher Type"
								name="is_percentage"
								placeholder=""
								options={[
									{ label: 'Percentage (%)', value: true },
									{ label: 'Value (RM)', value: false },
								]}
								required
								locked={!!data}
							/>

							<NumberInput
								label="Discount"
								name="discount"
								prefix={formData?.is_percentage?.value ? null : 'RM'}
								suffix={formData?.is_percentage?.value ? '%' : null}
								min={0}
								max={formData?.is_percentage?.value ? 100 : null}
								step={0.01}
								required
								locked={!!data}
							/>
						</Row>

						<Separator />

						<Row>
							<DateInput label="Start Date" name="start_date" required />
							<DateInput
								label="Expiry Date"
								name="expired_at"
								min={formData?.start_date?.value}
								required
							/>
							<SelectInput
								label="Duration"
								name="duration"
								placeholder="Custom"
								options={[
									{ label: '1 Week', value: '1W' },
									{ label: '3 Weeks', value: '3W' },
									{ label: '1 Month', value: '1M' },
									{ label: '3 Month', value: '3M' },
									{ label: '1 Year', value: '1Y' },
								]}
							/>
						</Row>
					</div>
				</Form>
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
