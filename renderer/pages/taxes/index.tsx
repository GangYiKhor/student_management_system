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
import { TaxesCreateDto } from '../../utils/types/dtos/taxes/create';
import { TaxesGetDto } from '../../utils/types/dtos/taxes/get';
import { ErrorResponse } from '../../utils/types/responses/error';
import { TaxesGetResponses } from '../../utils/types/responses/taxes/get';
import { TaxesSearchAdd } from './components/search-add';
import { HolidaysTable } from './components/table';
import { TaxesModal } from './components/taxes-modal';
import { formDefaultValue, searchDefaultValue } from './constants';

function Taxes() {
	const { setNotification } = useNotificationContext();
	const [isActive, setIsActive] = useState<boolean>(undefined);
	const [orderBy, setOrderBy] = useState<'start_date asc' | 'start_date desc'>('start_date desc');
	const [toggleModal, setToggleModal] = useState(false);

	const parseData = (data: TaxesGetResponses) =>
		data.map(value => {
			value.start_date = new Date(value.start_date);
			value.end_date = value.end_date && new Date(value.end_date);
			return value;
		});

	const getTaxes = useGet<TaxesGetDto, TaxesGetResponses>('/api/taxes', parseData);
	const { data, isLoading, error, isError, dataUpdatedAt, refetch } = useQuery<
		TaxesGetResponses,
		AxiosError<ErrorResponse>
	>({
		queryKey: ['taxes'],
		queryFn: () => getTaxes({ is_active: isActive, orderBy }),
		enabled: true,
	});

	const handleAdd = useCallback(
		async (createData: TaxesCreateDto) => {
			try {
				await axios.post<any, AxiosResponse<any, any>, TaxesCreateDto>(`/api/taxes`, createData);
				await refetch();
				setNotification({
					title: 'New Tax Added!',
					message: 'Tax Added Successfully!',
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
	}, [isActive, orderBy]);

	return (
		<React.Fragment>
			<Head>
				<title>Taxes</title>
			</Head>
			<Layout headerTitle={'Taxes'}>
				{isLoading ? (
					<Loader />
				) : (
					<div className={clsx('flex', 'flex-col', 'gap-4')}>
						<FormProvider defaultValue={searchDefaultValue}>
							<TaxesSearchAdd setIsActive={setIsActive} setToggleModal={setToggleModal} />
						</FormProvider>

						<HolidaysTable data={data} refetch={refetch} setOrderBy={setOrderBy} />
						<LastUpdatedAt
							lastUpdatedAt={dataUpdatedAt ?? new Date(dataUpdatedAt)}
							refetch={refetch}
						/>

						{toggleModal ? (
							<FormProvider defaultValue={formDefaultValue}>
								<TaxesModal closeModal={() => setToggleModal(false)} handler={handleAdd} />
							</FormProvider>
						) : null}
					</div>
				)}
			</Layout>
		</React.Fragment>
	);
}

export default Taxes;
