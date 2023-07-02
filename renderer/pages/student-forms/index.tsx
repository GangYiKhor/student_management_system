import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useGet } from '../../hooks/use-get';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../../layouts/basic_layout';
import { StudentFormsGetResponse } from '../../responses/student-forms/get';
import { Loader } from '../../components/loader';
import { StudentFormsTable } from './components/student-forms-table';
import clsx from 'clsx';
import { BlueButtonClass, GrayButtonClass } from '../../utils/class/button';
import { LabelLeftClass, TextBoxClass } from '../../utils/class/inputs';
import axios, { AxiosResponse } from 'axios';
import { StudentFormsCreateDto } from '../../dtos/student-forms/create';
import { StudentFormsUpdateDto } from '../../dtos/student-forms/update';
import { StudentFormsSearchAdd } from './components/search-add';
import { LastUpdatedAt } from '../../components/last-updated';

const layoutClass = clsx('flex', 'flex-col', 'gap-4');

function StudentForm() {
	const getForms = useGet('/api/student-forms');
	const { data, isLoading, dataUpdatedAt, refetch } = useQuery<StudentFormsGetResponse>({
		queryKey: [],
		queryFn: () => getForms(),
		enabled: true,
	});
	const [lastUpdated, setLastUpdated] = useState<Date>();
	const [search, setSearch] = useState<string>('');
	const [status, setStatus] = useState<boolean>(undefined);

	const handleAction = useCallback(async (id: number, status: boolean) => {
		await axios.put<any, AxiosResponse<any, any>, StudentFormsUpdateDto>(
			`/api/student-forms/update/${id}/`,
			{ status },
		);
		await refetch();
	}, []);

	const handleAdd = useCallback(async (formName: string) => {
		console.log('Adding');
		await axios.post<any, AxiosResponse<any, any>, StudentFormsCreateDto>(
			`/api/student-forms/create/`,
			{ formName },
		);
		await refetch();
	}, []);

	useEffect(() => {
		if (dataUpdatedAt) {
			setLastUpdated(new Date(dataUpdatedAt));
		}
	}, [dataUpdatedAt]);

	return (
		<React.Fragment>
			<Head>
				<title>Student Forms</title>
			</Head>
			<Layout headerTitle={'Student Forms'}>
				{isLoading ? (
					<Loader />
				) : (
					<div className={layoutClass}>
						<StudentFormsSearchAdd
							setSearch={setSearch}
							setStatus={setStatus}
							handleAdd={handleAdd}
						/>
						<StudentFormsTable
							data={data}
							search={search}
							status={status}
							handleAction={handleAction}
						/>
						<LastUpdatedAt lastUpdatedAt={lastUpdated} refetch={refetch} />
					</div>
				)}
			</Layout>
		</React.Fragment>
	);
}

export default StudentForm;
