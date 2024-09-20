import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { CheckboxGroupInput } from '../../../components/inputs/checkbox-group-input';
import { ComboBox } from '../../../components/inputs/combo-box';
import { DateInput } from '../../../components/inputs/date-input';
import { Form } from '../../../components/inputs/form';
import { NumberInput } from '../../../components/inputs/number-input';
import { SelectClass } from '../../../components/inputs/select-class';
import { SelectInput } from '../../../components/inputs/select-input';
import { TextAreaInput } from '../../../components/inputs/textarea-input';
import Modal, { ModalButtons } from '../../../components/modal';
import { useFormContextWithId } from '../../../components/providers/form-providers';
import Row from '../../../components/row';
import { Section } from '../../../components/section';
import Separator from '../../../components/separator';
import { useCustomQuery } from '../../../hooks/use-custom-query';
import { useGet, useGetOptions } from '../../../hooks/use-get';
import { useGetClassComboBoxOptions } from '../../../hooks/use-get-class-options';
import { useGetStudentComboBoxOptions } from '../../../hooks/use-get-student-options';
import {
	CLASS_COUNT,
	MONTH_SHORT,
	STUDENT_CLASS_API_PATH,
	VOUCHER_API_PATH,
} from '../../../utils/constants/constants';
import { parseDateTime, removeTimezoneOffset } from '../../../utils/dateOperations';
import { tryParseInt } from '../../../utils/numberParsers';
import {
	GrayButtonClass,
	GreenButtonClass,
	RedButtonClass,
} from '../../../utils/tailwindClass/button';
import { ReceiptCreateDto } from '../../../utils/types/dtos/receipts/create';
import { ReceiptGenerateDto } from '../../../utils/types/dtos/receipts/generate';
import { VouchersGetDto } from '../../../utils/types/dtos/vouchers/get';
import { ClassesGetResponses } from '../../../utils/types/responses/classes/get';
import { ReceiptCreateResponse } from '../../../utils/types/responses/receipts/create';
import { ReceiptGenerateResponse } from '../../../utils/types/responses/receipts/generate';
import { StudentClassesGetResponses } from '../../../utils/types/responses/student-classes/get';
import { StudentsGetResponses } from '../../../utils/types/responses/students/get';
import { VouchersGetResponse } from '../../../utils/types/responses/vouchers/get';
import { SelectOptions } from '../../../utils/types/select-options';
import { CreateFormId, formDefaultValue } from '../constants';
import { useIsDirty } from '../hooks/useIsDirty';
import { useVerifyInputs } from '../hooks/useVerifyInputs';
import { FormDataType } from '../types';
import { InvoiceModal } from './invoice-modal';

type PropType = {
	closeModal: () => void;
	handleCreate: (createData: ReceiptCreateDto) => Promise<ReceiptCreateResponse>;
	handleGenerate?: (createData: ReceiptGenerateDto) => Promise<ReceiptGenerateResponse>;
};

export function ReceiptsCreateModal({
	closeModal,
	handleCreate,
	handleGenerate,
}: Readonly<PropType>) {
	const { formData, setFormData } = useFormContextWithId<FormDataType>(CreateFormId);
	const [viewFees, setViewFees] = useState(false);
	const [invoiceData, setInvoiceData] = useState<ReceiptGenerateResponse>();
	const [closeConfirmation, setCloseConfirmation] = useState(false);

	const verifyInputs = useVerifyInputs({ formData, setFormData });
	const isDirty = useIsDirty({ formData });

	const getVouchers = useGetOptions<VouchersGetDto, VouchersGetResponse>(
		VOUCHER_API_PATH,
		value => value.id,
		value => value.id,
	);
	const { data: voucherOptions } = useCustomQuery<SelectOptions<VouchersGetResponse>>({
		queryKey: ['vouchersOptionsFull'],
		queryFn: () =>
			getVouchers({
				student_id: formData?.student?.value?.id,
				is_active: true,
				include_everyone: true,
			}),
		fetchOnVariable: [formData?.student?.value?.id],
	});

	const getStudents = useGetStudentComboBoxOptions();
	const { data: studentOptions } = useCustomQuery<StudentsGetResponses>({
		queryKey: ['studentsOptionsFull'],
		queryFn: () => getStudents({ is_active: true }),
	});

	const getClass = useGetClassComboBoxOptions();
	const { data: classOptions } = useCustomQuery<ClassesGetResponses>({
		queryKey: ['classesOptionsFull'],
		queryFn: () =>
			getClass({
				form_id: tryParseInt(formData?.student?.value?.form?.id, 0),
				is_active: true,
				orderBy: 'class_name asc',
			}),
		fetchOnVariable: [formData?.student?.value?.form?.id],
	});

	const getStudentClasses = useGet<void, StudentClassesGetResponses>(STUDENT_CLASS_API_PATH);
	const { data: studentClasses } = useCustomQuery<StudentClassesGetResponses>({
		queryKey: ['studentClasses'],
		queryFn: async () =>
			formData?.student?.value?.id ? getStudentClasses(undefined, formData?.student.value.id) : [],
		fetchOnVariable: [formData?.student?.value?.id],
	});

	const parseFormData = (formData: FormDataType) => {
		const classIds: number[] = [];
		for (let i = 0; i < CLASS_COUNT; i++) {
			classIds.push(formData?.[`class_${i}`]?.value);
		}

		const submitData: ReceiptCreateDto = {
			student_id: formData?.student?.value?.id,
			student_name: formData?.student?.value?.student_name,
			form_id: formData?.student?.value?.form?.id,
			form_name: formData?.student?.value?.form?.form_name,
			date: removeTimezoneOffset(formData?.date?.value),
			payment_year: formData?.payment_year?.value,
			jan: formData?.jan?.value ?? 0,
			feb: formData?.feb?.value ?? 0,
			mar: formData?.mar?.value ?? 0,
			apr: formData?.apr?.value ?? 0,
			may: formData?.may?.value ?? 0,
			jun: formData?.jun?.value ?? 0,
			jul: formData?.jul?.value ?? 0,
			aug: formData?.aug?.value ?? 0,
			sep: formData?.sep?.value ?? 0,
			oct: formData?.oct?.value ?? 0,
			nov: formData?.nov?.value ?? 0,
			dec: formData?.dec?.value ?? 0,
			reg_fees: formData?.reg_fees?.value ?? 0,
			incentive: formData?.incentive?.value ?? 0,
			voucher_id: formData?.voucher_id?.value,
			remarks: formData?.remarks?.value,
			status: formData?.status?.value,
			class_ids: classIds,
		};

		return submitData;
	};

	useEffect(() => {
		for (let i = 0; i < CLASS_COUNT; i++) {
			setFormData({
				path: `class_${i}`,
				value: studentClasses?.[i]?.class?.id ?? null,
				valid: true,
			});
		}
	}, [studentClasses]);

	useEffect(() => {
		setFormData({ path: 'jan', valid: true });
		setFormData({ path: 'feb', valid: true });
		setFormData({ path: 'mar', valid: true });
		setFormData({ path: 'apr', valid: true });
		setFormData({ path: 'may', valid: true });
		setFormData({ path: 'jun', valid: true });
		setFormData({ path: 'jul', valid: true });
		setFormData({ path: 'aug', valid: true });
		setFormData({ path: 'sep', valid: true });
		setFormData({ path: 'oct', valid: true });
		setFormData({ path: 'nov', valid: true });
		setFormData({ path: 'dec', valid: true });
	}, [
		formData?.jan?.value,
		formData?.feb?.value,
		formData?.mar?.value,
		formData?.apr?.value,
		formData?.may?.value,
		formData?.jun?.value,
		formData?.jul?.value,
		formData?.aug?.value,
		formData?.sep?.value,
		formData?.oct?.value,
		formData?.nov?.value,
		formData?.dec?.value,
	]);

	const modalButtons: ModalButtons = [
		{
			text: 'Calculate Fees',
			class: GreenButtonClass,
			action: async () => {
				if (verifyInputs()) {
					const submitData = parseFormData(formData);
					const receipt = await handleGenerate(submitData);
					receipt.date = parseDateTime(receipt.date);
					setInvoiceData(receipt);
					setViewFees(true);
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

	const checkBoxComponent = (value: string) => (
		<CheckboxGroupInput
			key={value}
			labels={[value, '½']}
			name={value.toLowerCase()}
			valueGroup={[0, 1, 0.5]}
			labelLocation="top"
		/>
	);

	return (
		<React.Fragment>
			<Modal
				title="Create Receipt"
				closeModal={() => (isDirty() ? setCloseConfirmation(true) : closeModal())}
				closeOnBlur={false}
				buttons={modalButtons}
			>
				<Form formId={CreateFormId} defaultValue={formDefaultValue()}>
					<div className={clsx('grid')}>
						<Row>
							<DateInput label="Date" name="date" required />
							<NumberInput label="Year" name="payment_year" min={2000} step={1} required />
						</Row>

						<Separator />

						<ComboBox
							label="Student"
							name="student"
							options={studentOptions}
							columns={['student_name', 'form.form_name']}
							valueParser={value => ({
								id: value.id,
								student_name: value.student_name,
								form: value.form,
							})}
							labelColumn="student_name"
							required
						/>

						<Row>
							<NumberInput
								label="Reg"
								name="reg_fees"
								prefix="RM"
								placeholder="0.00"
								min={0}
								step={0.01}
							/>

							<NumberInput
								label="Incentive"
								name="incentive"
								prefix="RM"
								placeholder="0.00"
								min={0}
								step={0.01}
							/>

							<SelectInput label="Voucher" name="voucher_id" options={voucherOptions} />
						</Row>

						<TextAreaInput label="Remarks" name="remarks" notResizable />

						<Section title="Months" hideable>
							<Row>
								{Object.entries(MONTH_SHORT)
									.sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
									.slice(0, 6)
									.map(value => checkBoxComponent(value[1]))}
							</Row>

							<Row>
								{Object.entries(MONTH_SHORT)
									.sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
									.slice(6)
									.map(value => checkBoxComponent(value[1]))}
							</Row>
						</Section>

						<Section title="Classes" hideable>
							<div className={clsx('flex', 'flex-col', 'gap-1', 'pt-2', 'pb-4')}>
								{new Array(CLASS_COUNT).fill(null).map((_, index) => {
									const count = index + 1;
									const formName = `class_${index}`;
									return (
										<div key={`class-${count}`} className={clsx('flex', 'items-center', 'gap-2')}>
											<SelectClass
												label={`${count}`}
												name={formName}
												labelClassAddOn={clsx('w-6')}
												options={classOptions}
												onlyId
											/>
										</div>
									);
								})}
							</div>
						</Section>
					</div>
				</Form>
			</Modal>

			{viewFees ? (
				<InvoiceModal
					closeModal={() => setViewFees(false)}
					closeParentModal={closeModal}
					invoiceData={invoiceData}
					confirmReceipt={async () => await handleCreate(parseFormData(formData))}
				/>
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
