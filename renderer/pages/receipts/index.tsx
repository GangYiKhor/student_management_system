import clsx from 'clsx';
import Head from 'next/head';
import React, { useState } from 'react';
import { LastUpdatedAt } from '../../components/last-updated';
import { Loader } from '../../components/loader';
import { useFormContextWithId } from '../../components/providers/form-providers';
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
import { BackendPath, PageName, SearchFormId, defaultSortString, parseGetData } from './constants';
import { SearchDataType } from './types';

function Receipts() {
	const { setNotification } = useNotificationContext();
	const { formData } = useFormContextWithId<SearchDataType>(SearchFormId);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);
	const [toggleModal, setToggleModal] = useState(false);

	const getReceipts = useGet<ReceiptsGetDto, ReceiptsGetResponses>(BackendPath, parseGetData);
	const postGenerateReceipt = usePost<ReceiptGenerateDto, ReceiptGenerateResponse>(
		RECEIPT_GENERATE_API_PATH,
	);
	const postConfirmReceipt = usePost<ReceiptCreateDto, ReceiptCreateResponse>(BackendPath);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<ReceiptsGetResponses>({
		queryKey: ['receipt-list'],
		queryFn: () =>
			getReceipts({
				student_id: formData?.student_id?.value,
				class_id: formData?.class_id?.value,
				teacher_id: formData?.teacher_id?.value,
				start_date: formData?.start_date?.value,
				end_date: formData?.end_date?.value,
				payment_year: formData?.payment_year?.value,
				payment_month: formData?.payment_month?.value,
				voucher_id: formData?.voucher_id?.value,
				orderBy,
			}),
		fetchOnVariable: [
			formData?.student_id?.value,
			formData?.class_id?.value,
			formData?.teacher_id?.value,
			formData?.start_date?.value,
			formData?.end_date?.value,
			formData?.payment_year?.value,
			formData?.payment_month?.value,
			formData?.voucher_id?.value,
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
						<ReceiptsSearchAdd setToggleModal={setToggleModal} />
						<ReceiptTable data={data} refetch={refetch} setOrderBy={setOrderBy} />
						<LastUpdatedAt lastUpdatedAt={dataUpdatedAt} refetch={refetch} />

						{toggleModal ? (
							<ReceiptsCreateModal
								closeModal={() => setToggleModal(false)}
								handleCreate={handleCreate}
								handleGenerate={handleGenerate}
							/>
						) : null}
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default Receipts;
