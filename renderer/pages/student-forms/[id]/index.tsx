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
import { STUDENT_FORM_API_PATH } from '../../../utils/constants/constants';
import { RecordUpdatedMessage } from '../../../utils/notifications/record-updated';
import { tryParseInt } from '../../../utils/numberParsers';
import { StudentFormUpdateDto } from '../../../utils/types/dtos/student-forms/update';
import { StudentFormsGetResponse } from '../../../utils/types/responses/student-forms/get';
import { StudentFormsInputForm } from '../student-forms-input-form';

const formId = 'edit-student-forms';

function StudentFormEdit() {
	const router = useRouter();
	const classId = (router.query.id as string) ?? '';
	const { setNotification } = useNotificationContext();
	const { updateInitialValues } = useFormContext(formId);

	// Fetch Data
	const getStudentForm = useGet<null, StudentFormsGetResponse>(STUDENT_FORM_API_PATH);
	const { data, isLoading, refetch } = useCustomQuery<StudentFormsGetResponse>({
		queryKey: ['view-student-form'],
		queryFn: () => classId && getStudentForm(null, classId),
		fetchOnVariable: [classId],
		fetchOnlyIfDefined: [classId],
		disabled: true,
	});

	// Update
	const updateStudentForm = usePost<StudentFormUpdateDto, void>(STUDENT_FORM_API_PATH);
	const handleUpdate = async (data: { [key: string]: { value: any } }) => {
		const updateDto = {};
		Object.keys(data).forEach(key => (updateDto[key] = data[key].value));
		try {
			await updateStudentForm(updateDto, classId);
			refetch();
			setNotification(RecordUpdatedMessage('Student Form'));
			updateInitialValues();
			return true;
		} catch (error) {
			return false;
		}
	};

	return (
		<React.Fragment>
			<Head>
				<title>Edit Form</title>
			</Head>

			<Layout headerTitle="Edit Form">
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
							<StudentFormsInputForm
								defaultValue={{
									form_name: data?.form_name,
									is_active: data?.is_active,
								}}
							/>
						</Form>
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default StudentFormEdit;
