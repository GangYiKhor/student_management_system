import clsx from 'clsx';
import { BlueButtonClass } from '../../../utils/class/button';
import { LabelLeftClass, TextBoxRightClass } from '../../../utils/class/inputs';
import { useCallback, useEffect, useState } from 'react';
import { SubjectsCreateModal } from './create-modal';
import { SubjectsCreateDto } from '../../../dtos/subjects/create';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import { useGet } from '../../../hooks/use-get';
import { StudentFormsGetResponse } from '../../../responses/student-forms/get';
import { ErrorResponse } from '../../../responses/error';
import { useQuery } from '@tanstack/react-query';

const layoutClass = clsx('flex', 'justify-between');
const searchClass = clsx('flex', 'flex-row', 'gap-8', 'items-baseline');
const buttonClass = clsx('flex', 'justify-end', 'gap-4', 'items-center');

type PropType = {
	setSearch: CallableFunction;
	setForm: CallableFunction;
	setStatus: CallableFunction;
	refetch: CallableFunction;
};

export function SubjectsSearchAdd({ setSearch, setForm, setStatus, refetch }: PropType) {
	const { setNotification } = useNotificationContext();
	const [toggleModal, setToggleModal] = useState(false);

	const getForms = useGet('/api/student-forms');
	const {
		data: formData,
		error,
		isError,
		refetch: formRefetch,
	} = useQuery<StudentFormsGetResponse, AxiosError<ErrorResponse>>({
		queryKey: ['forms'],
		queryFn: () => getForms({ is_active: true }),
		enabled: true,
	});

	useEffect(() => {
		if (isError) {
			if (error) {
				setNotification({
					title: error.response.data.error.title,
					message: error.response.data.error.message,
					source: error.response.data.error.source,
					type: 'ERROR',
				});
			} else {
				setNotification({
					title: 'Server Error!',
					message: 'Unknown Error! Unable to connect to server!',
					source: 'Server',
					type: 'ERROR',
				});
			}
			console.log(error);
		}
	}, [isError]);

	const handleAdd = useCallback(
		async (createData: SubjectsCreateDto) => {
			console.log('Adding');
			try {
				await axios.post<any, AxiosResponse<any, any>, SubjectsCreateDto>(
					`/api/subjects/create/`,
					createData,
				);
				await refetch();
				setNotification({
					title: 'New Student Form Created!',
					message: 'Student Form Created Successfully!',
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
						placeholder="Type to search.."
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
						onChange={e => setForm(e.target.value === 'All' ? undefined : e.target.value)}
						onFocus={async () => await formRefetch()}
					>
						<option value="All">All</option>
						{formData?.map(value => (
							<option key={value.id} value={value.id}>
								{value.form_name}
							</option>
						))}
					</select>
				</div>
				<div>
					<label className={LabelLeftClass} htmlFor="status">
						Status:
					</label>
					<select
						className={TextBoxRightClass}
						id="status"
						onChange={e =>
							setStatus(e.target.value === 'All' ? undefined : e.target.value === 'Active')
						}
					>
						<option value="All">All</option>
						<option value="Active" selected>
							Active
						</option>
						<option value="Inactive">Inactive</option>
					</select>
				</div>
			</div>
			<div className={buttonClass}>
				<button className={BlueButtonClass} onClick={() => setToggleModal(true)}>
					New Form
				</button>
			</div>
			{toggleModal ? (
				<SubjectsCreateModal closeModal={() => setToggleModal(false)} handleAdd={handleAdd} />
			) : null}
		</div>
	);
}
