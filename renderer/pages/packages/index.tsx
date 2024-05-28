import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import clsx from 'clsx';
import Head from 'next/head';
import React, { useCallback, useEffect, useState } from 'react';
import { LastUpdatedAt } from '../../components/last-updated';
import { Loader } from '../../components/loader';
import { FormProvider } from '../../components/providers/form-providers';
import { useNotificationContext } from '../../components/providers/notification-providers';
import { useGet } from '../../hooks/use-get';
import { Layout } from '../../layouts/basic_layout';
import { SERVER_CONNECTION_ERROR } from '../../utils/constants/ErrorResponses';
import { PackageCreateDto } from '../../utils/types/dtos/packages/create';
import { PackagesGetDto } from '../../utils/types/dtos/packages/get';
import { ErrorResponse } from '../../utils/types/responses/error';
import { PackagesGetResponses } from '../../utils/types/responses/packages/get';
import { PackagesModal } from './components/packages-modal';
import { PackagesSearchAdd } from './components/search-add';
import { PackagesTable } from './components/table';
import { formDefaultValue, searchDefaultValue } from './constants';

function Packages() {
	const { setNotification } = useNotificationContext();
	const [search, setSearch] = useState<string>('');
	const [formId, setFormId] = useState<number>(undefined);
	const [isActive, setIsActive] = useState<boolean>(undefined);
	const [orderBy, setOrderBy] = useState<string>('form_name asc');
	const [toggleModal, setToggleModal] = useState(false);

	const parseData = (data: PackagesGetResponses) => {
		for (const row of data) {
			row.start_date = new Date(row.start_date);
			row.end_date = row.end_date && new Date(row.end_date);
		}

		return data;
	};

	const getPackages = useGet<PackagesGetDto, PackagesGetResponses>('/api/packages', parseData);
	const { data, isLoading, error, isError, dataUpdatedAt, refetch } = useQuery<
		PackagesGetResponses,
		AxiosError<ErrorResponse>
	>({
		queryKey: ['packages'],
		queryFn: () =>
			getPackages({
				form_id: formId,
				is_active: isActive,
				orderBy,
			}),
		enabled: true,
	});

	const handleAdd = useCallback(
		async (createData: PackageCreateDto) => {
			try {
				await axios.post<any, AxiosResponse<any, any>, PackageCreateDto>(
					`/api/packages`,
					createData,
				);
				await refetch();
				setNotification({
					title: 'New Package Added!',
					message: 'Package Added Successfully!',
					type: 'INFO',
				});
			} catch (error: any) {
				if (error instanceof AxiosError) {
					setNotification({ ...error?.response?.data?.error });
				} else {
					setNotification(SERVER_CONNECTION_ERROR);
				}
			}
		},
		[refetch, setNotification],
	);

	useEffect(() => {
		if (isError) {
			if (error instanceof AxiosError) {
				setNotification({ ...error?.response?.data?.error });
			} else {
				setNotification(SERVER_CONNECTION_ERROR);
			}
		}
	}, [isError]);

	useEffect(() => {
		void refetch();
	}, [formId, isActive, orderBy]);

	return (
		<React.Fragment>
			<Head>
				<title>Packages</title>
			</Head>
			<Layout headerTitle={'Packages'}>
				{isLoading ? (
					<Loader />
				) : (
					<div className={clsx('flex', 'flex-col', 'gap-4')}>
						<FormProvider defaultValue={searchDefaultValue}>
							<PackagesSearchAdd
								setSearch={setSearch}
								setFormId={setFormId}
								setIsActive={setIsActive}
								setToggleModal={setToggleModal}
							/>
						</FormProvider>

						<PackagesTable data={data} search={search} refetch={refetch} setOrderBy={setOrderBy} />

						<LastUpdatedAt
							lastUpdatedAt={dataUpdatedAt ?? new Date(dataUpdatedAt)}
							refetch={refetch}
						/>

						{toggleModal ? (
							<FormProvider defaultValue={formDefaultValue}>
								<PackagesModal closeModal={() => setToggleModal(false)} handler={handleAdd} />
							</FormProvider>
						) : null}
					</div>
				)}
			</Layout>
		</React.Fragment>
	);
}

export default Packages;
