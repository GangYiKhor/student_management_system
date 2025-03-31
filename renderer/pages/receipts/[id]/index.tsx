import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { CheckboxGroupInput } from '../../../components/inputs/checkbox-group-input';
import { DateInput } from '../../../components/inputs/date-input';
import { Form } from '../../../components/inputs/form';
import { NumberInput } from '../../../components/inputs/number-input';
import { SelectClass } from '../../../components/inputs/select-class';
import { TextInput } from '../../../components/inputs/text-input';
import { TextAreaInput } from '../../../components/inputs/textarea-input';
import { Loader } from '../../../components/loader';
import { NavigateBack } from '../../../components/navigate-back';
import { useFormContext } from '../../../components/providers/form-providers';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import Row from '../../../components/row';
import { Section } from '../../../components/section';
import Separator from '../../../components/separator';
import { useCustomQuery } from '../../../hooks/use-custom-query';
import { useGet } from '../../../hooks/use-get';
import { useGetClassComboBoxOptions } from '../../../hooks/use-get-class-options';
import { usePost } from '../../../hooks/use-post';
import { Layout } from '../../../layouts/basic_layout';
import {
	CLASS_API_PATH,
	CLASS_COUNT,
	MONTH_SHORT,
	RECEIPT_API_PATH,
} from '../../../utils/constants/constants';
import { parseDateTime } from '../../../utils/dateOperations';
import { RecordUpdatedMessage } from '../../../utils/notifications/record-updated';
import { tryParseInt } from '../../../utils/numberParsers';
import { RedButtonClass } from '../../../utils/tailwindClass/button';
import { ContentContainer } from '../../../utils/tailwindClass/containers';
import { ReceiptUpdateDto } from '../../../utils/types/dtos/receipts/update';
import { ClassesGetResponses } from '../../../utils/types/responses/classes/get';
import { ReceiptsGetResponse } from '../../../utils/types/responses/receipts/get';

const parseGetData = (value: ReceiptsGetResponse) => {
	const newValue = { ...value };
	newValue.date = parseDateTime(newValue.date);
	return newValue;
};

const formId = 'edit-receipt';

type FormDataType = {
	receipt_no: string;
	student_id: number;
	student: string;
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
	voucher_id?: string;
	remarks?: string;
	status?: string;
	[key: string]: any;
};

function ReceiptEdit() {
	const router = useRouter();
	const receiptId = (router.query.id as string) ?? '';
	const { getValues, updateFieldValue, updateInitialValues } = useFormContext<FormDataType>(formId);
	const { setNotification } = useNotificationContext();

	// Fetch Data
	const getReceipt = useGet<null, ReceiptsGetResponse>(RECEIPT_API_PATH, parseGetData);
	const { data, isLoading, refetch } = useCustomQuery<ReceiptsGetResponse>({
		queryKey: ['view-receipt'],
		queryFn: () => receiptId && getReceipt(null, receiptId),
		fetchOnVariable: [receiptId],
		fetchOnlyIfDefined: [receiptId],
		disabled: true,
	});

	// Update
	const updateClass = usePost<ReceiptUpdateDto, void>(CLASS_API_PATH);
	const handleUpdate = async () => {
		const remarks = getValues().remarks;

		try {
			await updateClass({ remarks });
			refetch();
			setNotification(RecordUpdatedMessage('Receipt'));
			updateInitialValues();
			return true;
		} catch (error) {
			return false;
		}
	};

	const handleCancel = async () => {
		await updateClass({ status: 'Cancelled' });
		refetch();
		setNotification(RecordUpdatedMessage('Receipt'));
		updateInitialValues();
	};

	const checkBoxComponent = (value: string, data: number) => (
		<CheckboxGroupInput
			key={value}
			id={value.toLowerCase()}
			labels={[value, '½']}
			values={[1, 0.5]}
			allUncheckedValue={0}
			labelLocation="top"
			defaultValue={data}
			locked
		/>
	);

	const getClass = useGetClassComboBoxOptions();
	const { data: classOptions } = useCustomQuery<ClassesGetResponses>({
		queryKey: ['classes-options-full'],
		queryFn: () =>
			getClass({
				form_id: tryParseInt(data?.form_id, 0),
				is_active: true,
				orderBy: 'class_name asc',
			}),
		fetchOnVariable: [data?.form_id],
	});

	useEffect(() => {
		if (classOptions && data?.receipt_class) {
			data?.receipt_class?.forEach((value, index) => {
				updateFieldValue([{ field: `class-${index}`, value: value.class_id }]);
			});
		}
	}, [classOptions, data?.receipt_class]);

	return (
		<React.Fragment>
			<Head>
				<title>Edit Receipt</title>
			</Head>

			<Layout headerTitle="Edit Receipt">
				<Loader isLoading={isLoading || data?.id !== tryParseInt(receiptId, 0)}>
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

						<Form formId={formId} submitText="Preview" onSubmit={handleUpdate} revertible keepData>
							<div className={clsx('relative')}>
								<div className={clsx('grid')}>
									<Row>
										<TextInput
											id="receipt_no"
											label="Receipt No"
											defaultValue={data?.receipt_no}
											locked
										/>
										<DateInput id="date" label="Date" defaultValue={data?.date} required locked />
										<NumberInput
											id="payment_year"
											label="Year"
											defaultValue={data?.payment_year}
											required
											locked
										/>
									</Row>

									<Separator />

									<NumberInput
										id="student_id"
										label="Student ID"
										defaultValue={data?.student_id}
										locked
									/>
									<TextInput
										id="student"
										label="Student"
										defaultValue={`${data?.student_name} ${data?.form_name}`}
										required
										locked
									/>

									<Row>
										<NumberInput
											id="reg_fees"
											label="Reg"
											prefix="RM"
											placeholder="0.00"
											defaultValue={data?.reg_fees}
											locked
										/>

										<NumberInput
											id="incentive"
											label="Incentive"
											prefix="RM"
											placeholder="0.00"
											defaultValue={data?.incentive}
											locked
										/>

										<TextInput
											id="voucher_id"
											label="Voucher"
											defaultValue={data?.voucher_id}
											locked
										/>
									</Row>

									<TextAreaInput
										id="remarks"
										label="Remarks"
										notResizable
										defaultValue={data?.remarks}
									/>

									<Section title="Months" hideable>
										<Row>
											{Object.entries(MONTH_SHORT)
												.sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
												.slice(0, 6)
												.map(value => checkBoxComponent(value[1], data?.[value[1].toLowerCase()]))}
										</Row>

										<Row>
											{Object.entries(MONTH_SHORT)
												.sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
												.slice(6)
												.map(value => checkBoxComponent(value[1], data?.[value[1].toLowerCase()]))}
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
															locked
														/>
													</div>
												);
											})}
										</div>
									</Section>
								</div>

								{data && data?.status !== 'Received' ? (
									<div
										className={clsx(
											'absolute',
											'w-full',
											'h-full',
											'top-0',
											'flex',
											'flex-col',
											'justify-around',
											'text-center',
											'bg-[rgba(0,0,0,0.2)]',
											'pointer-events-none',
										)}
									>
										{[1, 2, 3].map(value => (
											<h3
												key={`watermark-${value}`}
												className={clsx(
													'-rotate-[15deg]',
													'text-[50pt]',
													'uppercase',
													'font-semibold',
													'opacity-20',
												)}
											>
												{data?.status}
											</h3>
										))}
									</div>
								) : null}
							</div>
						</Form>

						{data?.status === 'Received' ? (
							<div className={ContentContainer}>
								<button className={RedButtonClass} onClick={handleCancel}>
									Cancel Receipt
								</button>
							</div>
						) : null}
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default ReceiptEdit;
