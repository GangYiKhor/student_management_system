import clsx from 'clsx';
import Head from 'next/head';
import React, { useState } from 'react';
import { LastUpdatedAt } from '../../components/last-updated';
import { Loader } from '../../components/loader';
import { FormProvider } from '../../components/providers/form-providers';
import { useNotificationContext } from '../../components/providers/notification-providers';
import { useCustomQuery } from '../../hooks/use-custom-query';
import { useGet } from '../../hooks/use-get';
import { usePost } from '../../hooks/use-post';
import { Layout } from '../../layouts/basic_layout';
import { RECEIPT_GENERATE_API_PATH } from '../../utils/constants/constants';
import { RecordCreatedMessage } from '../../utils/notifications/record-created';
import { ReceiptCreateDto } from '../../utils/types/dtos/receipts/create';
import { ReceiptGenerateDto } from '../../utils/types/dtos/receipts/generate';
import { ReceiptsGetDto } from '../../utils/types/dtos/receipts/get';
import { ReceiptCreateResponse } from '../../utils/types/responses/receipts/create';
import { ReceiptGenerateResponse } from '../../utils/types/responses/receipts/generate';
import { ReceiptsGetResponses } from '../../utils/types/responses/receipts/get';
import { ReceiptsCreateModal } from './components/receipts-create-modal';
import { ReceiptsSearchAdd } from './components/search-add';
import { ReceiptTable } from './components/table';
import {
	BackendPath,
	PageName,
	defaultSortString,
	formDefaultValue,
	parseGetData,
	searchDefaultValue,
} from './constants';

function Receipts() {
	const { setNotification } = useNotificationContext();
	const [search, setSearch] = useState<string>(searchDefaultValue.general.value);
	const [studentId, setStudentId] = useState<number>(searchDefaultValue.student_id.value);
	const [classId, setClassId] = useState<number>(searchDefaultValue.class_id.value);
	const [teacherId, setTeacherId] = useState<number>(searchDefaultValue.teacher_id.value);
	const [startDate, setStartDate] = useState<Date>(searchDefaultValue.start_date.value);
	const [endDate, setEndDate] = useState<Date>(searchDefaultValue.end_date.value);
	const [year, setYear] = useState<number>(searchDefaultValue.payment_year.value);
	const [month, setMonth] = useState<number>(searchDefaultValue.payment_month.value);
	const [voucherId, setVoucherId] = useState<string>(searchDefaultValue.voucher_id.value);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);
	const [toggleModal, setToggleModal] = useState(false);

	const getReceipts = useGet<ReceiptsGetDto, ReceiptsGetResponses>(BackendPath, parseGetData);
	const postGenerateReceipt = usePost<ReceiptGenerateDto, ReceiptGenerateResponse>(
		RECEIPT_GENERATE_API_PATH,
	);
	const postConfirmReceipt = usePost<ReceiptCreateDto, ReceiptCreateResponse>(BackendPath);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<ReceiptsGetResponses>({
		queryKey: ['receipts'],
		queryFn: () =>
			getReceipts({
				student_id: studentId,
				class_id: classId,
				teacher_id: teacherId,
				start_date: startDate,
				end_date: endDate,
				payment_year: year,
				payment_month: month,
				voucher_id: voucherId,
				orderBy,
			}),
		fetchOnVariable: [
			studentId,
			classId,
			teacherId,
			startDate,
			endDate,
			year,
			month,
			voucherId,
			orderBy,
		],
	});

	const handleGenerate = async (data: ReceiptGenerateDto) => {
		return await postGenerateReceipt(data);
	};

	const handleCreate = async (data: ReceiptCreateDto) => {
		const receipt = await postConfirmReceipt(data);
		await refetch();
		setNotification(RecordCreatedMessage('Class'));
		return receipt;
	};

	return (
		<React.Fragment>
			<Head>
				<title>{PageName}</title>
			</Head>
			<Layout headerTitle={PageName}>
				<Loader isLoading={isLoading}>
					<div className={clsx('flex', 'flex-col', 'gap-4')}>
						<FormProvider defaultValue={searchDefaultValue}>
							<ReceiptsSearchAdd
								setSearch={setSearch}
								setStudentId={setStudentId}
								setClassId={setClassId}
								setTeacherId={setTeacherId}
								setStartDate={setStartDate}
								setEndDate={setEndDate}
								setYear={setYear}
								setMonth={setMonth}
								setVoucherId={setVoucherId}
								setToggleModal={setToggleModal}
							/>
						</FormProvider>

						<ReceiptTable data={data} search={search} refetch={refetch} setOrderBy={setOrderBy} />

						<LastUpdatedAt lastUpdatedAt={dataUpdatedAt} refetch={refetch} />

						{toggleModal ? (
							<FormProvider defaultValue={formDefaultValue()}>
								<ReceiptsCreateModal
									closeModal={() => setToggleModal(false)}
									handleCreate={handleCreate}
									handleGenerate={handleGenerate}
								/>
							</FormProvider>
						) : null}
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default Receipts;
