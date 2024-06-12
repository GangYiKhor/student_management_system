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
import { PackageCreateDto } from '../../utils/types/dtos/packages/create';
import { PackagesGetDto } from '../../utils/types/dtos/packages/get';
import { PackagesGetResponses } from '../../utils/types/responses/packages/get';
import { PackagesModal } from './components/packages-modal';
import { PackagesSearchAdd } from './components/search-add';
import { PackagesTable } from './components/table';
import {
	BackendPath,
	PageName,
	defaultSortString,
	formDefaultValue,
	parseGetData,
	searchDefaultValue,
} from './constants';

function Packages() {
	const { setNotification } = useNotificationContext();
	const [search, setSearch] = useState<string>(searchDefaultValue.general.value);
	const [formId, setFormId] = useState<number>(searchDefaultValue.form_id.value);
	const [subjectCount, setSubjectCount] = useState<number>(searchDefaultValue.subject_count.value);
	const [isActive, setIsActive] = useState<boolean>(searchDefaultValue.status.value);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);
	const [toggleModal, setToggleModal] = useState(false);

	const getPackages = useGet<PackagesGetDto, PackagesGetResponses>(BackendPath, parseGetData);
	const postPackage = usePost<PackageCreateDto, void>(BackendPath);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<PackagesGetResponses>({
		queryKey: ['packages'],
		queryFn: () =>
			getPackages({
				form_id: formId,
				subject_count: subjectCount,
				is_active: isActive,
				orderBy,
			}),
		fetchOnVariable: [formId, subjectCount, isActive, orderBy],
	});

	const handleAdd = async (data: PackageCreateDto) => {
		await postPackage(data);
		await refetch();
		setNotification(RecordCreatedMessage('Package'));
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
							<PackagesSearchAdd
								setSearch={setSearch}
								setFormId={setFormId}
								setSubjectCount={setSubjectCount}
								setIsActive={setIsActive}
								setToggleModal={setToggleModal}
							/>
						</FormProvider>

						<PackagesTable data={data} search={search} refetch={refetch} setOrderBy={setOrderBy} />

						<LastUpdatedAt lastUpdatedAt={dataUpdatedAt} refetch={refetch} />

						{toggleModal ? (
							<FormProvider defaultValue={formDefaultValue}>
								<PackagesModal closeModal={() => setToggleModal(false)} handler={handleAdd} />
							</FormProvider>
						) : null}
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default Packages;
