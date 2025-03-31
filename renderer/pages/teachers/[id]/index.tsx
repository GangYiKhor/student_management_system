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
import { CLASS_API_PATH, TEACHER_API_PATH } from '../../../utils/constants/constants';
import { parseDateTime } from '../../../utils/dateOperations';
import { RecordUpdatedMessage } from '../../../utils/notifications/record-updated';
import { tryParseInt } from '../../../utils/numberParsers';
import { TeacherUpdateDto } from '../../../utils/types/dtos/teachers/update';
import { TeachersGetResponse } from '../../../utils/types/responses/teachers/get';
import { TeachersInputForm } from '../teachers-input-form';

const parseTeacherData = (value: TeachersGetResponse) => {
	const newValue = { ...value };
	newValue.start_date = parseDateTime(newValue.start_date);
	newValue.end_date = parseDateTime(newValue.end_date);
	return newValue;
};

const formId = 'edit-teacher';

function TeacherEdit() {
	const router = useRouter();
	const teacherId = (router.query.id as string) ?? '';
	const { setNotification } = useNotificationContext();
	const { updateInitialValues } = useFormContext(formId);

	// Fetch Data
	const getTeachers = useGet<null, TeachersGetResponse>(TEACHER_API_PATH, parseTeacherData);
	const { data, isLoading, refetch } = useCustomQuery<TeachersGetResponse>({
		queryKey: ['view-teacher'],
		queryFn: () => teacherId && getTeachers(null, teacherId),
		fetchOnVariable: [teacherId],
		fetchOnlyIfDefined: [teacherId],
		disabled: true,
	});

	// Update
	const updateTeacher = usePost<TeacherUpdateDto, void>(CLASS_API_PATH);
	const handleUpdate = async (data: { [key: string]: { value: any } }) => {
		const updateDto = {};
		Object.keys(data).forEach(key => (updateDto[key] = data[key].value));
		try {
			await updateTeacher(updateDto, teacherId);
			refetch();
			setNotification(RecordUpdatedMessage('Teacher'));
			updateInitialValues();
			return true;
		} catch (error) {
			return false;
		}
	};

	return (
		<React.Fragment>
			<Head>
				<title>Edit Teacher</title>
			</Head>

			<Layout headerTitle="Edit Teacher">
				<Loader isLoading={isLoading || data?.id !== tryParseInt(teacherId, 0)}>
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
							<TeachersInputForm
								defaultValue={{
									teacher_name: data?.teacher_name,
									ic: data?.ic,
									phone_number: data?.phone_number,
									email: data?.email,
									address: data?.address,
								}}
							/>
						</Form>
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default TeacherEdit;
