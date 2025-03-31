import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { CheckboxGroupInput } from '../../../components/inputs/checkbox-group-input';
import { ComboBox } from '../../../components/inputs/combo-box';
import { DateInput } from '../../../components/inputs/date-input';
import { Form } from '../../../components/inputs/form';
import { NumberInput } from '../../../components/inputs/number-input';
import { SelectClass } from '../../../components/inputs/select-class';
import { SelectInput } from '../../../components/inputs/select-input';
import { TextAreaInput } from '../../../components/inputs/textarea-input';
import { Loader } from '../../../components/loader';
import Modal, { ModalButtons } from '../../../components/modal';
import { NavigateBack } from '../../../components/navigate-back';
import { useFormContext } from '../../../components/providers/form-providers';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import Row from '../../../components/row';
import { Section } from '../../../components/section';
import Separator from '../../../components/separator';
import { useCustomQuery } from '../../../hooks/use-custom-query';
import { useGet, useGetOptions } from '../../../hooks/use-get';
import { useGetClassComboBoxOptions } from '../../../hooks/use-get-class-options';
import { useGetStudentComboBoxOptions } from '../../../hooks/use-get-student-options';
import { usePost } from '../../../hooks/use-post';
import { Layout } from '../../../layouts/basic_layout';
import {
	CLASS_API_PATH,
	CLASS_COUNT,
	MONTH_SHORT,
	RECEIPT_GENERATE_API_PATH,
	RECEIPT_PRINT_PREVIEW_SIZE,
	STUDENT_CLASS_API_PATH,
	VOUCHER_API_PATH,
} from '../../../utils/constants/constants';
import { getToday, removeTimezoneOffset } from '../../../utils/dateOperations';
import { tryParseInt } from '../../../utils/numberParsers';
import { GreenButtonClass } from '../../../utils/tailwindClass/button';
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
import ReceiptPreview from '../components/receipt-preview';

const formId = 'new-receipt';

type FormDataType = {
	student: { id: number; student_name: string; form: { id: number; form_name: string } };
	date: Date;
	payment_year: number;
	jan: number;
	feb: number;
	mar: number;
	apr: number;
	may: number;
	jun: number;
	jul: number;
	aug: number;
	sep: number;
	oct: number;
	nov: number;
	dec: number;
	reg_fees: number;
	incentive: number;
	voucher_id: string;
	remarks: string;
	status: string;
	[key: string]: any;
};

function ReceiptNew() {
	const router = useRouter();
	const { formData, getValues, resetForm, updateFieldValue, updateFieldValid } =
		useFormContext<FormDataType>(formId);
	const { setNotification } = useNotificationContext();
	const [studentPreset, setStudentPreset] = useState(false);
	const [isPreview, setIsPreview] = useState(false);
	const [previewData, setPreviewData] = useState<ReceiptGenerateResponse>();

	// Create
	const generatePreviewReceipt = usePost<ReceiptGenerateDto, ReceiptGenerateResponse>(
		RECEIPT_GENERATE_API_PATH,
	);
	const handleGenerate = async (data: { [key: string]: { value: any } }) => {
		const createDto = {};
		const classDto = [];
		const classIds = new Map();
		let validClass = true;
		let validMonth = true;

		Object.keys(data).forEach(key => {
			if (key?.startsWith('class_')) {
				const index = tryParseInt(key.split('_')[1], classDto.length);
				classDto[index] = data[key].value;
				if (data[key].value !== null) {
					if (classIds.has(data[key].value)) {
						updateFieldValid([
							{ field: `class_${index}`, valid: false },
							{ field: `class_${classIds.get(data[key].value)}`, valid: false },
						]);
						validClass = false;
					} else {
						classIds.set(data[key].value, index);
					}
				}
			} else {
				createDto[key] = data[key].value;
			}
		});

		if (classIds.size > 0) {
			validMonth = Object.values(MONTH_SHORT)
				.map(value => value.toLowerCase())
				.some(value => createDto[value] > 0);
		}

		if (!validMonth) {
			setNotification({ title: 'Please select a month!', source: 'Form' });
		}

		if (!validClass) {
			setNotification({ title: 'Duplicate Class', source: 'Form' });
		}

		if (!validMonth || !validClass) {
			return false;
		}

		createDto['student_id'] = createDto['student']['id'];
		createDto['student_name'] = createDto['student']['student_name'];
		createDto['form_id'] = createDto['student']['form']['id'];
		createDto['form_name'] = createDto['student']['form']['form_name'];
		createDto['class_ids'] = classDto;
		createDto['date'] = removeTimezoneOffset(createDto['date']);

		try {
			const result = await generatePreviewReceipt(createDto as ReceiptGenerateDto);
			setPreviewData(result);
			setIsPreview(true);
			return true;
		} catch (error) {
			return false;
		}
	};

	const createClass = usePost<ReceiptCreateDto, ReceiptCreateResponse>(CLASS_API_PATH);
	const handleCreate = async () => {
		const data = getValues();

		const createDto = {};
		const classDto = [];
		const classIds = new Map();
		let valid = true;

		Object.keys(data).forEach(key => {
			if (key?.startsWith('class_')) {
				const index = tryParseInt(key.split('_')[1], classDto.length);
				classDto[index] = data[key].value;
				if (data[key].value !== null) {
					if (classIds.has(data[key].value)) {
						updateFieldValid([
							{ field: `class_${index}`, valid: false },
							{ field: `class_${classIds.get(data[key].value)}`, valid: false },
						]);
						valid = false;
					} else {
						classIds.set(data[key].value, index);
					}
				}
			} else {
				createDto[key] = data[key].value;
			}
		});

		if (!valid) {
			setNotification({ title: 'Duplicate Class', source: 'Form' });
			return;
		}

		createDto['student_id'] = createDto['student']['id'];
		createDto['student_name'] = createDto['student']['student_name'];
		createDto['form_id'] = createDto['student']['form']['id'];
		createDto['form_name'] = createDto['student']['form']['form_name'];
		createDto['class_ids'] = classDto;
		createDto['date'] = removeTimezoneOffset(createDto['date']);

		try {
			const result = await createClass(createDto as ReceiptCreateDto);
			resetForm();
			router.replace('receipts');
			window.open(
				`/receipts/print/${result?.id}`,
				'_blank',
				`${RECEIPT_PRINT_PREVIEW_SIZE},contextIsolation=no,nodeIntegration=yes`,
			);
		} catch (error) {
			return;
		}
	};

	// Fetch Options
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
		queryKey: ['students-options-full'],
		queryFn: () => getStudents({ is_active: true }),
	});

	const getClass = useGetClassComboBoxOptions();
	const { data: classOptions } = useCustomQuery<ClassesGetResponses>({
		queryKey: ['classes-options-full'],
		queryFn: () =>
			getClass({
				form_id: tryParseInt(formData?.student?.value?.form?.id, 0),
				is_active: true,
				orderBy: 'class_name asc',
			}),
		fetchOnVariable: [formData?.student?.value?.form?.id],
	});

	useEffect(() => {
		if (!studentPreset && router?.query?.student_id && !!studentOptions) {
			const presetId = tryParseInt(router?.query?.student_id as string, -1);
			const found = studentOptions.find(value => value.id === presetId);

			if (found) {
				const foundStudent = {
					id: found.id,
					student_name: found.student_name,
					form: { id: found.form.id, form_name: found.form.form_name },
				};
				updateFieldValue([{ field: 'student', value: foundStudent }]);
				setStudentPreset(true);
			}
		}
	}, [router?.query?.student_id, studentOptions]);

	const getStudentClasses = useGet<void, StudentClassesGetResponses>(STUDENT_CLASS_API_PATH);
	const { data: studentClasses } = useCustomQuery<StudentClassesGetResponses>({
		queryKey: ['receipt-student-classes'],
		queryFn: async () =>
			formData?.student?.value?.id ? getStudentClasses(undefined, formData?.student.value.id) : [],
		fetchOnVariable: [formData?.student?.value?.id],
	});

	useEffect(() => {
		for (let i = 0; i < CLASS_COUNT; i++) {
			updateFieldValue([{ field: `class_${i}`, value: studentClasses?.[i]?.class?.id ?? null }]);
		}
	}, [studentClasses]);

	useEffect(() => {
		updateFieldValid([
			{ field: 'jan', valid: true },
			{ field: 'feb', valid: true },
			{ field: 'mar', valid: true },
			{ field: 'apr', valid: true },
			{ field: 'may', valid: true },
			{ field: 'jun', valid: true },
			{ field: 'jul', valid: true },
			{ field: 'aug', valid: true },
			{ field: 'sep', valid: true },
			{ field: 'oct', valid: true },
			{ field: 'nov', valid: true },
			{ field: 'dec', valid: true },
		]);
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

	const checkBoxComponent = (value: string) => (
		<CheckboxGroupInput
			key={value}
			id={value.toLowerCase()}
			labels={[value, '½']}
			values={[1, 0.5]}
			allUncheckedValue={0}
			labelLocation="top"
		/>
	);

	return (
		<React.Fragment>
			<Head>
				<title>New Receipt</title>
			</Head>

			<Layout headerTitle="New Receipt">
				<Loader isLoading={!!studentOptions}>
					<div
						className={clsx(
							'flex flex-col gap-5',
							'max-w-2xl',
							'm-auto px-10 py-5',
							'bg-slate-200 dark:bg-[rgba(0,0,0,0.2)]',
							'rounded-lg',
							'drop-shadow',
						)}
					>
						<div className={clsx('text-left')}>
							<NavigateBack />
						</div>

						<Form
							formId={formId}
							submitText="Preview"
							onSubmit={handleGenerate}
							revertible
							keepData
						>
							<div className={clsx('grid')}>
								<Row>
									<DateInput id="date" label="Date" defaultValue={getToday()} required />
									<NumberInput
										id="payment_year"
										label="Year"
										min={2000}
										step={1}
										defaultValue={getToday().getFullYear()}
										required
									/>
								</Row>

								<Separator />

								<ComboBox
									id="student"
									label="Student"
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
										id="reg_fees"
										label="Reg"
										prefix="RM"
										placeholder="0.00"
										min={0}
										step={0.01}
									/>

									<NumberInput
										id="incentive"
										label="Incentive"
										prefix="RM"
										placeholder="0.00"
										min={0}
										step={0.01}
									/>

									<SelectInput id="voucher_id" label="Voucher" options={voucherOptions} />
								</Row>

								<TextAreaInput id="remarks" label="Remarks" notResizable />

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
												<div
													key={`class-${count}`}
													className={clsx('flex', 'items-center', 'gap-2')}
												>
													<SelectClass
														id={formName}
														label={`${count}`}
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
					</div>
				</Loader>

				{isPreview ? (
					<InvoiceModal
						closeModal={() => setIsPreview(false)}
						invoiceData={previewData}
						confirmReceipt={async () => await handleCreate()}
					/>
				) : null}
			</Layout>
		</React.Fragment>
	);
}

type PreviewPropType = {
	closeModal: () => void;
	invoiceData: ReceiptGenerateResponse;
	confirmReceipt: () => Promise<void>;
};

function InvoiceModal({ closeModal, invoiceData, confirmReceipt }: Readonly<PreviewPropType>) {
	const modalButtons: ModalButtons = [
		{
			text: 'Confirm Payment',
			class: GreenButtonClass,
			action: async () => {
				await confirmReceipt();
			},
		},
	];

	return (
		<Modal title="Preview" closeModal={closeModal} buttons={modalButtons} closeOnBlur={false}>
			<ReceiptPreview data={invoiceData} />
		</Modal>
	);
}

export default ReceiptNew;
