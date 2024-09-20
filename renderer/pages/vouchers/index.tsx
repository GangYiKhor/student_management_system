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
import { RecordCreatedMessage } from '../../utils/notifications/record-created';
import { VoucherCreateDto } from '../../utils/types/dtos/vouchers/create';
import { VouchersGetDto } from '../../utils/types/dtos/vouchers/get';
import { VouchersGetResponses } from '../../utils/types/responses/vouchers/get';
import { VouchersSearchAdd } from './components/search-add';
import { VoucherTable } from './components/table';
import { VouchersModal } from './components/vouchers-modal';
import { BackendPath, PageName, SearchFormId, defaultSortString, parseGetData } from './constants';
import { SearchDataType } from './types';

function Vouchers() {
	const { setNotification } = useNotificationContext();
	const { formData } = useFormContextWithId<SearchDataType>(SearchFormId);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);
	const [toggleModal, setToggleModal] = useState(false);

	const getVouchers = useGet<VouchersGetDto, VouchersGetResponses>(BackendPath, parseGetData);
	const postVoucher = usePost<VoucherCreateDto, void>(BackendPath);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<VouchersGetResponses>({
		queryKey: ['voucher-list'],
		queryFn: () =>
			getVouchers({
				student_id: formData?.student_search_id?.value,
				is_active: formData?.status?.value,
				orderBy,
			}),
		fetchOnVariable: [formData?.student_search_id?.value, formData?.status?.value, orderBy],
	});

	const handleAdd = async (data: VoucherCreateDto) => {
		await postVoucher(data);
		await refetch();
		setNotification(RecordCreatedMessage('Voucher'));
	};

	return (
		<React.Fragment>
			<Head>
				<title>{PageName}</title>
			</Head>
			<Layout headerTitle={PageName}>
				<Loader isLoading={isLoading}>
					<div className={clsx('flex', 'flex-col', 'gap-4')}>
						<VouchersSearchAdd setToggleModal={setToggleModal} />
						<VoucherTable data={data} refetch={refetch} setOrderBy={setOrderBy} />
						<LastUpdatedAt lastUpdatedAt={dataUpdatedAt} refetch={refetch} />

						{toggleModal ? (
							<VouchersModal closeModal={() => setToggleModal(false)} handler={handleAdd} />
						) : null}
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default Vouchers;
