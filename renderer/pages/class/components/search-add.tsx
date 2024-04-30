import clsx from 'clsx';
import { BlueButtonClass } from '../../../utils/class/button';
import { LabelLeftClass, TextBoxRightClass } from '../../../utils/class/inputs';
import { useCallback, useState } from 'react';
import { ClassCreateModal } from './create-modal';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import { useGet } from '../../../hooks/use-get';
import { StudentFormsGetDto } from '../../../dtos/student-forms/get';
import { StudentFormsGetResponse } from '../../../responses/student-forms/get';
import { ErrorResponse } from '../../../responses/error';
import { QueryObserverResult, useQuery } from '@tanstack/react-query';
import { parseIntOrUndefined } from '../../../utils/parser';
import { TeachersGetResponse } from '../../../responses/teachers/get';
import { ClassGetResponse } from '../../../responses/class/get';
import { ClassCreateDto } from '../../../dtos/class/create';

const layoutClass = clsx('flex', 'justify-between');
const searchClass = clsx('flex', 'flex-row', 'gap-8', 'items-baseline');
const buttonClass = clsx('flex', 'justify-end', 'gap-4', 'items-center');

type PropType = {
	setSearch: (value: string) => void;
	setFormId: (value: number) => void;
	setTeacherId: (value: number) => void;
	setClassYear: (value: number) => void;
	setDay: (value: number) => void;
	setIsActive: (value: boolean) => void;
	refetch: () => Promise<QueryObserverResult<ClassGetResponse[], AxiosError<ErrorResponse, any>>>;
};

export function ClassSearchAdd({
	setSearch,
	setFormId,
	setTeacherId,
	setClassYear,
	setDay,
	setIsActive,
	refetch,
}: PropType) {
	const { setNotification } = useNotificationContext();
	const [toggleModal, setToggleModal] = useState(false);

	const getForms = useGet<StudentFormsGetDto>('/api/student-forms');
	const { data: formData, refetch: refetchForm } = useQuery<
		StudentFormsGetResponse,
		AxiosError<ErrorResponse>
	>({
		queryKey: ['forms'],
		queryFn: () => getForms({ is_active: true, orderBy: 'form_name asc' }),
		enabled: true,
	});

	const getTeachers = useGet<StudentFormsGetDto>('/api/teachers');
	const { data: teacherData, refetch: refetchTeacher } = useQuery<
		TeachersGetResponse,
		AxiosError<ErrorResponse>
	>({
		queryKey: ['teachers'],
		queryFn: () => getTeachers({ is_active: true, orderBy: 'teacher_name asc' }),
		enabled: true,
	});

	const handleAdd = useCallback(
		async (createData: ClassCreateDto) => {
			try {
				await axios.post<any, AxiosResponse<any, any>, ClassCreateDto>(`/api/class/`, createData);
				await refetch();
				setNotification({
					title: 'New Class Added!',
					message: 'Class Added Successfully!',
					type: 'INFO',
				});
			} catch (error: any) {
				if (error instanceof AxiosError) {
					setNotification({
						title: error.response.data.error.title,
						message: error.response.data.error.message,
						source: error.response.data.error.source,
						type: 'ERROR',
					});
				} else {
					setNotification({ title: 'Server Error', message: error.message });
				}
				throw error;
			}
		},
		[refetch, setNotification],
	);

	return (
		<div className={layoutClass}>
			<div className={searchClass}>
				<div>
					<label className={LabelLeftClass} htmlFor="search">
						Search:
					</label>
					<input
						type="text"
						id="search"
						className={TextBoxRightClass}
						placeholder="Search... (#1 to search ID)"
						onChange={e => setSearch(e.target.value)}
					/>
				</div>
				<div>
					<label className={LabelLeftClass} htmlFor="form">
						Form:
					</label>
					<select
						className={TextBoxRightClass}
						id="form"
						onChange={e => setFormId(parseIntOrUndefined(e.target.value))}
						onClick={() => refetchForm()}
					>
						<option value="">All</option>
						{formData
							? formData.map(({ id, form_name }) => (
									<option key={id} value={id}>
										{form_name}
									</option>
							  ))
							: null}
					</select>
				</div>
				<div>
					<label className={LabelLeftClass} htmlFor="teacher">
						Teacher:
					</label>
					<select
						className={TextBoxRightClass}
						id="teacher"
						onChange={e => setTeacherId(parseIntOrUndefined(e.target.value))}
						onClick={() => refetchTeacher()}
					>
						<option value="">All</option>
						{teacherData
							? teacherData.map(({ id, teacher_name }) => (
									<option key={id} value={id}>
										{teacher_name}
									</option>
							  ))
							: null}
					</select>
				</div>
				<div>
					<label className={LabelLeftClass} htmlFor="year">
						Year:
					</label>
					<input
						type="number"
						min={2010}
						id="year"
						className={TextBoxRightClass}
						placeholder="E.g. 2022"
						onChange={e => setClassYear(parseIntOrUndefined(e.target.value))}
					/>
				</div>
				<div>
					<label className={LabelLeftClass} htmlFor="active">
						Active:
					</label>
					<select
						className={TextBoxRightClass}
						id="active"
						onChange={e => setIsActive(e.target.value ? e.target.value === 'active' : undefined)}
					>
						<option value="">All</option>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</div>
			</div>
			<div className={buttonClass}>
				<button className={BlueButtonClass} onClick={() => setToggleModal(true)}>
					New Package
				</button>
			</div>
			{toggleModal ? (
				<ClassCreateModal closeModal={() => setToggleModal(false)} handleAdd={handleAdd} />
			) : null}
		</div>
	);
}
