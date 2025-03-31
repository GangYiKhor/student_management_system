import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { Form } from '../../../components/inputs/form';
import { Loader } from '../../../components/loader';
import { NavigateBack } from '../../../components/navigate-back';
import { useFormContext } from '../../../components/providers/form-providers';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import { useCustomQuery } from '../../../hooks/use-custom-query';
import { useGet } from '../../../hooks/use-get';
import { usePost } from '../../../hooks/use-post';
import { Layout } from '../../../layouts/basic_layout';
import { CLASS_API_PATH } from '../../../utils/constants/constants';
import { parseDateTime } from '../../../utils/dateOperations';
import { RecordUpdatedMessage } from '../../../utils/notifications/record-updated';
import { tryParseInt } from '../../../utils/numberParsers';
import { ClassUpdateDto } from '../../../utils/types/dtos/classes/update';
import { ClassesGetResponse } from '../../../utils/types/responses/classes/get';
import { ClassesInputForm } from '../classes-input-form';

const parseClassData = (value: ClassesGetResponse) => {
	const newValue = { ...value };
	newValue.start_date = parseDateTime(newValue.start_date);
	newValue.end_date = parseDateTime(newValue.end_date);
	newValue.start_time = parseDateTime(newValue.start_time);
	newValue.end_time = parseDateTime(newValue.end_time);
	return newValue;
};

const formId = 'edit-class';

function ClassEdit() {
	const router = useRouter();
	const classId = (router.query.id as string) ?? '';
	const { setNotification } = useNotificationContext();
	const { updateInitialValues } = useFormContext(formId);

	// Fetch Data
	const getClasses = useGet<null, ClassesGetResponse>(CLASS_API_PATH, parseClassData);
	const { data, isLoading, refetch } = useCustomQuery<ClassesGetResponse>({
		queryKey: ['view-class'],
		queryFn: () => classId && getClasses(null, classId),
		fetchOnVariable: [classId],
		fetchOnlyIfDefined: [classId],
		disabled: true,
	});

	// Update
	const updateClass = usePost<ClassUpdateDto, void>(CLASS_API_PATH);
	const handleUpdate = async (data: { [key: string]: { value: any } }) => {
		const updateDto = {};
		Object.keys(data).forEach(key => (updateDto[key] = data[key].value));
		try {
			await updateClass(updateDto, classId);
			refetch();
			setNotification(RecordUpdatedMessage('Class'));
			updateInitialValues();
			return true;
		} catch (error) {
			return false;
		}
	};

	return (
		<React.Fragment>
			<Head>
				<title>Edit Class</title>
			</Head>

			<Layout headerTitle="Edit Class">
				<Loader isLoading={isLoading || data?.id !== tryParseInt(classId, 0)}>
					<div
						className={clsx(
							'flex flex-col gap-5',
							'max-w-2xl',
							'm-auto px-10 py-5',
							'bg-slate-200 dark:bg-[rgba(0,0,0,0.2)]',
							'rounded-lg',
							'drop-shadow',
						)}
					>
						<div className={clsx('text-left')}>
							<NavigateBack />
						</div>

						<Form
							formId={formId}
							submitText="Update"
							onSubmit={handleUpdate}
							defaultLocked
							lockable
							revertible
						>
							<ClassesInputForm
								defaultValue={{
									class_name: data?.class_name,
									class_year: data?.class_year,
									day: data?.day,
									end_date: data?.end_date,
									end_time: data?.end_time,
									fees: data?.fees,
									form_id: data?.form_id,
									is_package: data?.is_package,
									start_date: data?.start_date,
									start_time: data?.start_time,
									teacher_id: data?.teacher?.id,
								}}
							/>
						</Form>
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default ClassEdit;
