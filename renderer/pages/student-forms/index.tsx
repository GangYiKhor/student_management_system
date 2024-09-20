import Head from 'next/head';
import React, { useState } from 'react';
import { LastUpdatedAt } from '../../components/last-updated';
import { Loader } from '../../components/loader';
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
import { BackendPath, PageName, defaultSortString } from './constants';

function StudentForms() {
	const { setNotification } = useNotificationContext();
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);
	const [toggleModal, setToggleModal] = useState(false);

	const postForm = usePost<StudentFormCreateDto | StudentFormUpdateDto, void>(BackendPath);
	const getForms = useGet<StudentFormsGetDto, StudentFormsGetResponses>(BackendPath);

	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<StudentFormsGetResponses>({
		queryKey: ['student-form-list'],
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
						<StudentFormsSearchAdd setToggleModal={setToggleModal} />
						<StudentFormsTable
							data={data}
							refetch={refetch}
							handler={handleUpdate}
							setOrderBy={setOrderBy}
						/>
						<LastUpdatedAt lastUpdatedAt={dataUpdatedAt} refetch={refetch} />

						{toggleModal ? (
							<StudentFormsModal closeModal={() => setToggleModal(false)} handler={handleAdd} />
						) : null}
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default StudentForms;
