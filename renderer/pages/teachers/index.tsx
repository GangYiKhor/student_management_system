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
import { TeacherCreateDto } from '../../utils/types/dtos/teachers/create';
import { TeachersGetDto } from '../../utils/types/dtos/teachers/get';
import { TeachersGetResponses } from '../../utils/types/responses/teachers/get';
import { TeachersSearchAdd } from './components/search-add';
import { TeachersTable } from './components/table';
import { TeachersModal } from './components/teachers-modal';
import {
	BackendPath,
	PageName,
	defaultSortString,
	formDefaultValue,
	searchDefaultValue,
} from './constants';

function Teachers() {
	const { setNotification } = useNotificationContext();
	const [search, setSearch] = useState<string>(searchDefaultValue.general.value);
	const [isActive, setIsActive] = useState<boolean>(searchDefaultValue.status.value);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);
	const [toggleModal, setToggleModal] = useState(false);

	const getTeachers = useGet<TeachersGetDto, TeachersGetResponses>(BackendPath);
	const postTeacher = usePost<TeacherCreateDto, void>(BackendPath);

	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<TeachersGetResponses>({
		queryKey: ['teachers'],
		queryFn: () => getTeachers({ is_active: isActive, orderBy }),
		fetchOnVariable: [isActive, orderBy],
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
						<FormProvider defaultValue={searchDefaultValue}>
							<TeachersSearchAdd
								setSearch={setSearch}
								setIsActive={setIsActive}
								setToggleModal={setToggleModal}
							/>
						</FormProvider>

						<TeachersTable data={data} search={search} refetch={refetch} setOrderBy={setOrderBy} />

						<LastUpdatedAt
							lastUpdatedAt={dataUpdatedAt ?? new Date(dataUpdatedAt)}
							refetch={refetch}
						/>

						{toggleModal ? (
							<FormProvider defaultValue={formDefaultValue}>
								<TeachersModal closeModal={() => setToggleModal(false)} handler={handleAdd} />
							</FormProvider>
						) : null}
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default Teachers;
