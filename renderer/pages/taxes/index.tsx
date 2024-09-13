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
import { ContentContainer } from '../../utils/tailwindClass/containers';
import { TaxCreateDto } from '../../utils/types/dtos/taxes/create';
import { TaxesGetDto } from '../../utils/types/dtos/taxes/get';
import { TaxesGetResponses } from '../../utils/types/responses/taxes/get';
import { TaxesSearchAdd } from './components/search-add';
import { HolidaysTable } from './components/table';
import { TaxesModal } from './components/taxes-modal';
import {
	BackendPath,
	PageName,
	defaultSortString,
	formDefaultValue,
	parseGetData,
	searchDefaultValue,
} from './constants';

function Taxes() {
	const { setNotification } = useNotificationContext();
	const [search, setSearch] = useState<string>(searchDefaultValue.general.value);
	const [isActive, setIsActive] = useState<boolean>(searchDefaultValue.status.value);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);
	const [toggleModal, setToggleModal] = useState(false);

	const getTaxes = useGet<TaxesGetDto, TaxesGetResponses>(BackendPath, parseGetData);
	const postTax = usePost<TaxCreateDto, void>(BackendPath);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<TaxesGetResponses>({
		queryKey: ['taxes'],
		queryFn: () => getTaxes({ is_active: isActive, orderBy }),
		fetchOnVariable: [isActive, orderBy],
	});

	const handleAdd = async (data: TaxCreateDto) => {
		await postTax(data);
		await refetch();
		setNotification(RecordCreatedMessage('Tax'));
	};

	return (
		<React.Fragment>
			<Head>
				<title>{PageName}</title>
			</Head>
			<Layout headerTitle={PageName}>
				<Loader isLoading={isLoading}>
					<div className={ContentContainer}>
						<FormProvider defaultValue={searchDefaultValue}>
							<TaxesSearchAdd
								setSearch={setSearch}
								setIsActive={setIsActive}
								setToggleModal={setToggleModal}
							/>
						</FormProvider>

						<HolidaysTable data={data} search={search} refetch={refetch} setOrderBy={setOrderBy} />

						<LastUpdatedAt lastUpdatedAt={dataUpdatedAt} refetch={refetch} />

						{toggleModal ? (
							<FormProvider defaultValue={formDefaultValue()}>
								<TaxesModal closeModal={() => setToggleModal(false)} handler={handleAdd} />
							</FormProvider>
						) : null}
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default Taxes;
