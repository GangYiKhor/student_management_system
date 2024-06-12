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
import { ClassCreateDto } from '../../utils/types/dtos/classes/create';
import { ClassesGetDto } from '../../utils/types/dtos/classes/get';
import { ClassesGetResponses } from '../../utils/types/responses/classes/get';
import { ClassesModal } from './components/classes-modal';
import { ClassesSearchAdd } from './components/search-add';
import { ClassTable } from './components/table';
import {
	BackendPath,
	PageName,
	defaultSortString,
	formDefaultValue,
	parseGetData,
	searchDefaultValue,
} from './constants';

function ClassRegistration() {
	const { setNotification } = useNotificationContext();
	const [search, setSearch] = useState<string>(searchDefaultValue.general.value);
	const [formId, setFormId] = useState<number>(searchDefaultValue.form_id.value);
	const [teacherId, setTeacherId] = useState<number>(searchDefaultValue.teacher_id.value);
	const [classYear, setClassYear] = useState<number>(searchDefaultValue.class_year.value);
	const [day, setDay] = useState<number>(searchDefaultValue.day.value);
	const [isActive, setIsActive] = useState<boolean>(true);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);
	const [toggleModal, setToggleModal] = useState(false);

	const getClasses = useGet<ClassesGetDto, ClassesGetResponses>(BackendPath, parseGetData);
	const postClass = usePost<ClassCreateDto, void>(BackendPath);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<ClassesGetResponses>({
		queryKey: ['class'],
		queryFn: () =>
			getClasses({
				form_id: formId,
				teacher_id: teacherId,
				class_year: classYear,
				day,
				is_active: isActive,
				orderBy,
			}),
		fetchOnVariable: [formId, teacherId, classYear, day, isActive, orderBy],
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
						<FormProvider defaultValue={searchDefaultValue}>
							<ClassesSearchAdd
								setSearch={setSearch}
								setFormId={setFormId}
								setTeacherId={setTeacherId}
								setClassYear={setClassYear}
								setDay={setDay}
								setIsActive={setIsActive}
								setToggleModal={setToggleModal}
							/>
						</FormProvider>

						<ClassTable data={data} search={search} refetch={refetch} setOrderBy={setOrderBy} />

						<LastUpdatedAt lastUpdatedAt={dataUpdatedAt} refetch={refetch} />

						{toggleModal ? (
							<FormProvider defaultValue={formDefaultValue}>
								<ClassesModal closeModal={() => setToggleModal(false)} handler={handleAdd} />
							</FormProvider>
						) : null}
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default ClassRegistration;
