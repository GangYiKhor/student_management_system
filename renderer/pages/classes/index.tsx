import clsx from 'clsx';
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
import { ClassCreateDto } from '../../utils/types/dtos/classes/create';
import { ClassesGetDto } from '../../utils/types/dtos/classes/get';
import { ClassesGetResponses } from '../../utils/types/responses/classes/get';
import { ClassesModal } from './components/classes-modal';
import { ClassesSearchAdd } from './components/search-add';
import { ClassTable } from './components/table';
import { BackendPath, PageName, SearchFormId, defaultSortString, parseGetData } from './constants';
import { SearchDataType } from './types';

function ClassRegistration() {
	const { setNotification } = useNotificationContext();
	const { formData } = useFormContextWithId<SearchDataType>(SearchFormId);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);
	const [toggleModal, setToggleModal] = useState(false);

	const getClasses = useGet<ClassesGetDto, ClassesGetResponses>(BackendPath, parseGetData);
	const postClass = usePost<ClassCreateDto, void>(BackendPath);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<ClassesGetResponses>({
		queryKey: ['class-list'],
		queryFn: () =>
			getClasses({
				form_id: formData?.form_id?.value,
				teacher_id: formData?.teacher_id?.value,
				class_year: formData?.class_year?.value,
				day: formData?.day?.value,
				is_active: formData?.status?.value,
				orderBy,
			}),
		fetchOnVariable: [
			formData?.form_id?.value,
			formData?.teacher_id?.value,
			formData?.class_year?.value,
			formData?.day?.value,
			formData?.status?.value,
			orderBy,
		],
	});

	const handleAdd = async (data: ClassCreateDto) => {
		await postClass(data);
		await refetch();
		setNotification(RecordCreatedMessage('Class'));
	};

	return (
		<React.Fragment>
			<Head>
				<title>{PageName}</title>
			</Head>
			<Layout headerTitle={PageName}>
				<Loader isLoading={isLoading}>
					<div className={clsx('flex', 'flex-col', 'gap-4')}>
						<ClassesSearchAdd setToggleModal={setToggleModal} />
						<ClassTable data={data} refetch={refetch} setOrderBy={setOrderBy} />
						<LastUpdatedAt lastUpdatedAt={dataUpdatedAt} refetch={refetch} />

						{toggleModal ? (
							<ClassesModal closeModal={() => setToggleModal(false)} handler={handleAdd} />
						) : null}
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default ClassRegistration;
