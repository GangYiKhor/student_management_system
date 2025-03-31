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
import { CLASS_API_PATH, STUDENT_CLASS_API_PATH } from '../../../utils/constants/constants';
import { parseDateTime } from '../../../utils/dateOperations';
import { RecordUpdatedMessage } from '../../../utils/notifications/record-updated';
import { tryParseInt } from '../../../utils/numberParsers';
import { StudentClassCreateDto } from '../../../utils/types/dtos/student-classes/create';
import { StudentUpdateDto } from '../../../utils/types/dtos/students/update';
import { StudentClassesGetResponses } from '../../../utils/types/responses/student-classes/get';
import { StudentsGetResponse } from '../../../utils/types/responses/students/get';
import { StudentsInputForm } from '../students-input-form';

const parseStudentData = (value: StudentsGetResponse) => {
	const newValue = { ...value };
	newValue.reg_date = parseDateTime(newValue.reg_date);
	return newValue;
};

const parseGetStudentClassData = (data: StudentClassesGetResponses) =>
	data.map(value => {
		if (value.class) {
			value.class.start_date = parseDateTime(value.class.start_date);
			value.class.end_date = parseDateTime(value.class.end_date);
			value.class.start_time = parseDateTime(value.class.start_time);
			value.class.end_time = parseDateTime(value.class.end_time);
		}
		return value;
	});

const formId = 'edit-student';

function StudentEdit() {
	const router = useRouter();
	const studentId = (router.query.id as string) ?? '';
	const { setNotification } = useNotificationContext();
	const { updateInitialValues, updateFieldValid } = useFormContext(formId);

	// Fetch Data
	const getStudent = useGet<null, StudentsGetResponse>(CLASS_API_PATH, parseStudentData);
	const getStudentClasses = useGet<void, StudentClassesGetResponses>(
		STUDENT_CLASS_API_PATH,
		parseGetStudentClassData,
	);
	const { data, isLoading, refetch } = useCustomQuery<StudentsGetResponse>({
		queryKey: ['view-student'],
		queryFn: () => studentId && getStudent(null, studentId),
		fetchOnVariable: [studentId],
		fetchOnlyIfDefined: [studentId],
		disabled: true,
	});
	const {
		data: classData,
		isLoading: classIsLoading,
		refetch: classRefetch,
	} = useCustomQuery<StudentClassesGetResponses>({
		queryKey: ['view-student-class'],
		queryFn: () => studentId && getStudentClasses(null, studentId),
		fetchOnVariable: [studentId],
		fetchOnlyIfDefined: [studentId],
		disabled: true,
	});

	// Update
	const updateStudent = usePost<StudentUpdateDto, void>(STUDENT_CLASS_API_PATH);
	const postStudentClass = usePost<StudentClassCreateDto, void>(STUDENT_CLASS_API_PATH);
	const handleUpdate = async (data: { [key: string]: { value: any } }) => {
		const createDto = {};
		const classDto = [];
		const classIds = new Map();
		let valid = true;

		Object.keys(data).forEach(key => {
			if (key?.startsWith('class_') && data[key].value?.id) {
				const index = tryParseInt(key.split('_')[1], classDto.length);
				classDto[index] = { class_id: data[key].value.id };
				if (data[key].value.id !== null) {
					if (classIds.has(data[key].value.id)) {
						updateFieldValid([
							{ field: `class_${index}`, valid: false },
							{ field: `class_${classIds.get(data[key].value.id)}`, valid: false },
						]);
						valid = false;
					} else {
						classIds.set(data[key].value.id, index);
					}
				}
			} else {
				createDto[key] = data[key].value;
			}
		});

		if (!valid) {
			setNotification({ title: 'Duplicate Class', source: 'Form' });
			return false;
		}

		try {
			await updateStudent(createDto as StudentUpdateDto);
			await postStudentClass(classDto as StudentClassCreateDto, studentId);
			refetch();
			classRefetch();
			setNotification(RecordUpdatedMessage('Students'));
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
				<Loader isLoading={isLoading || classIsLoading || data?.id !== tryParseInt(studentId, 0)}>
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
							<StudentsInputForm
								defaultValue={{
									student_name: data?.student_name,
									form_id: data?.form?.id,
									reg_date: data?.reg_date,
									reg_year: data?.reg_year,
									gender: data?.gender,
									ic: data?.ic,
									school: data?.school,
									phone_number: data?.phone_number,
									parent_phone_number: data?.parent_phone_number,
									email: data?.email,
									address: data?.address,
									classes: classData,
								}}
							/>
						</Form>
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default StudentEdit;
