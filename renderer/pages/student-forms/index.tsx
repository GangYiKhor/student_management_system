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
import { StudentFormCreateDto } from '../../utils/types/dtos/student-forms/create';
import { StudentFormsGetDto } from '../../utils/types/dtos/student-forms/get';
import { StudentFormUpdateDto } from '../../utils/types/dtos/student-forms/update';
import { StudentFormsGetResponses } from '../../utils/types/responses/student-forms/get';
import { StudentFormsSearchAdd } from './components/search-add';
import { StudentFormsModal } from './components/student-forms-modal';
import { StudentFormsTable } from './components/table';
import {
	BackendPath,
	PageName,
	defaultSortString,
	formDefaultValue,
	searchDefaultValue,
} from './constants';

function StudentForms() {
	const { setNotification } = useNotificationContext();
	const [search, setSearch] = useState<string>(searchDefaultValue.general.value);
	const [isActive, setIsActive] = useState<boolean>(searchDefaultValue.status.value);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);
	const [toggleModal, setToggleModal] = useState(false);

	const postForm = usePost<StudentFormCreateDto | StudentFormUpdateDto, void>(BackendPath);
	const getForms = useGet<StudentFormsGetDto, StudentFormsGetResponses>(BackendPath);

	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<StudentFormsGetResponses>({
		queryKey: ['forms'],
		queryFn: () => getForms({ orderBy }),
		fetchOnVariable: [orderBy],
	});

	const handleUpdate = async (id: number, is_active: boolean) => {
		await postForm({ is_active }, id);
		await refetch();
	};

	const handleAdd = async (data: StudentFormCreateDto) => {
		await postForm(data);
		await refetch();
		setNotification(RecordCreatedMessage('Student Form'));
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
							<StudentFormsSearchAdd
								setSearch={setSearch}
								setIsActive={setIsActive}
								setToggleModal={setToggleModal}
							/>
						</FormProvider>

						<StudentFormsTable
							data={data}
							search={search}
							status={isActive}
							refetch={refetch}
							handler={handleUpdate}
							setOrderBy={setOrderBy}
						/>

						<LastUpdatedAt lastUpdatedAt={dataUpdatedAt} refetch={refetch} />

						{toggleModal ? (
							<FormProvider defaultValue={formDefaultValue()}>
								<StudentFormsModal closeModal={() => setToggleModal(false)} handler={handleAdd} />
							</FormProvider>
						) : null}
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default StudentForms;
