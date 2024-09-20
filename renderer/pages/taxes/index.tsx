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
import { ContentContainer } from '../../utils/tailwindClass/containers';
import { TaxCreateDto } from '../../utils/types/dtos/taxes/create';
import { TaxesGetDto } from '../../utils/types/dtos/taxes/get';
import { TaxesGetResponses } from '../../utils/types/responses/taxes/get';
import { TaxesSearchAdd } from './components/search-add';
import { HolidaysTable } from './components/table';
import { TaxesModal } from './components/taxes-modal';
import { BackendPath, PageName, SearchFormId, defaultSortString, parseGetData } from './constants';
import { SearchDataType } from './types';

function Taxes() {
	const { setNotification } = useNotificationContext();
	const { formData } = useFormContextWithId<SearchDataType>(SearchFormId);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);
	const [toggleModal, setToggleModal] = useState(false);

	const getTaxes = useGet<TaxesGetDto, TaxesGetResponses>(BackendPath, parseGetData);
	const postTax = usePost<TaxCreateDto, void>(BackendPath);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<TaxesGetResponses>({
		queryKey: ['tax-list'],
		queryFn: () => getTaxes({ is_active: formData?.status?.value, orderBy }),
		fetchOnVariable: [formData?.status?.value, orderBy],
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
						<TaxesSearchAdd setToggleModal={setToggleModal} />
						<HolidaysTable data={data} refetch={refetch} setOrderBy={setOrderBy} />
						<LastUpdatedAt lastUpdatedAt={dataUpdatedAt} refetch={refetch} />

						{toggleModal ? (
							<TaxesModal closeModal={() => setToggleModal(false)} handler={handleAdd} />
						) : null}
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default Taxes;
