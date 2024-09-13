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
import { RecordCreatedMessage } from '../../utils/notifications/record-created';
import { VoucherCreateDto } from '../../utils/types/dtos/vouchers/create';
import { VouchersGetDto } from '../../utils/types/dtos/vouchers/get';
import { VouchersGetResponses } from '../../utils/types/responses/vouchers/get';
import { VouchersSearchAdd } from './components/search-add';
import { VoucherTable } from './components/table';
import { VouchersModal } from './components/vouchers-modal';
import {
	BackendPath,
	PageName,
	defaultSortString,
	formDefaultValue,
	parseGetData,
	searchDefaultValue,
} from './constants';

function Vouchers() {
	const { setNotification } = useNotificationContext();
	const [search, setSearch] = useState<string>(searchDefaultValue.general.value);
	const [studentId, setStudentId] = useState<number>(searchDefaultValue.student_search_id.value);
	const [isActive, setIsActive] = useState<boolean>(true);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);
	const [toggleModal, setToggleModal] = useState(false);

	const getVouchers = useGet<VouchersGetDto, VouchersGetResponses>(BackendPath, parseGetData);
	const postVoucher = usePost<VoucherCreateDto, void>(BackendPath);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<VouchersGetResponses>({
		queryKey: ['vouchers'],
		queryFn: () =>
			getVouchers({
				student_id: studentId,
				is_active: isActive,
				orderBy,
			}),
		fetchOnVariable: [studentId, isActive, orderBy],
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
						<FormProvider defaultValue={searchDefaultValue}>
							<VouchersSearchAdd
								setSearch={setSearch}
								setStudentId={setStudentId}
								setIsActive={setIsActive}
								setToggleModal={setToggleModal}
							/>
						</FormProvider>

						<VoucherTable data={data} search={search} refetch={refetch} setOrderBy={setOrderBy} />

						<LastUpdatedAt lastUpdatedAt={dataUpdatedAt} refetch={refetch} />

						{toggleModal ? (
							<FormProvider defaultValue={formDefaultValue()}>
								<VouchersModal closeModal={() => setToggleModal(false)} handler={handleAdd} />
							</FormProvider>
						) : null}
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default Vouchers;
