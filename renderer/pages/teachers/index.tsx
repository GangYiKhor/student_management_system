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
import { TeacherCreateDto } from '../../utils/types/dtos/teachers/create';
import { TeachersGetDto } from '../../utils/types/dtos/teachers/get';
import { TeachersGetResponses } from '../../utils/types/responses/teachers/get';
import { TeachersSearchAdd } from './components/search-add';
import { TeachersTable } from './components/table';
import { TeachersModal } from './components/teachers-modal';
import { BackendPath, PageName, SearchFormId, defaultSortString } from './constants';
import { SearchDataType } from './types';

function Teachers() {
	const { setNotification } = useNotificationContext();
	const { formData } = useFormContextWithId<SearchDataType>(SearchFormId);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);
	const [toggleModal, setToggleModal] = useState(false);

	const getTeachers = useGet<TeachersGetDto, TeachersGetResponses>(BackendPath);
	const postTeacher = usePost<TeacherCreateDto, void>(BackendPath);

	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<TeachersGetResponses>({
		queryKey: ['teacher-list'],
		queryFn: () => getTeachers({ is_active: formData?.status?.value, orderBy }),
		fetchOnVariable: [formData?.status?.value, orderBy],
	});

	const handleAdd = async (data: TeacherCreateDto) => {
		await postTeacher(data);
		await refetch();
		setNotification(RecordCreatedMessage('Teacher'));
	};

	return (
		<React.Fragment>
			<Head>
				<title>{PageName}</title>
			</Head>
			<Layout headerTitle={PageName}>
				<Loader isLoading={isLoading}>
					<div className={ContentContainer}>
						<TeachersSearchAdd setToggleModal={setToggleModal} />
						<TeachersTable data={data} refetch={refetch} setOrderBy={setOrderBy} />
						<LastUpdatedAt lastUpdatedAt={dataUpdatedAt} refetch={refetch} />

						{toggleModal ? (
							<TeachersModal closeModal={() => setToggleModal(false)} handler={handleAdd} />
						) : null}
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default Teachers;
