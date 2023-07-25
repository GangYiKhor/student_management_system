import clsx from 'clsx';
import { BlueButtonClass } from '../../../utils/class/button';
import { LabelLeftClass, TextBoxRightClass } from '../../../utils/class/inputs';
import { useCallback, useState } from 'react';
import { PackagesCreateModal } from './create-modal';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import { PackagesCreateDto } from '../../../dtos/packages/create';
import { useGet } from '../../../hooks/use-get';
import { StudentFormsGetDto } from '../../../dtos/student-forms/get';
import { StudentFormsGetResponse } from '../../../responses/student-forms/get';
import { ErrorResponse } from '../../../responses/error';
import { QueryObserverResult, useQuery } from '@tanstack/react-query';
import { PackagesGetResponse } from '../../../responses/packages/get';
import { parseIntOrUndefined } from '../../../utils/parser';

const layoutClass = clsx('flex', 'justify-between');
const searchClass = clsx('flex', 'flex-row', 'gap-8', 'items-baseline');
const buttonClass = clsx('flex', 'justify-end', 'gap-4', 'items-center');

type PropType = {
	setSearch: (value: string) => void;
	setFormId: (value: number) => void;
	setIsActive: (value: boolean) => void;
	refetch: () => Promise<
		QueryObserverResult<PackagesGetResponse[], AxiosError<ErrorResponse, any>>
	>;
};

export function PackagesSearchAdd({ setSearch, setFormId, setIsActive, refetch }: PropType) {
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

	const handleAdd = useCallback(
		async (createData: PackagesCreateDto) => {
			try {
				await axios.post<any, AxiosResponse<any, any>, PackagesCreateDto>(
					`/api/packages/`,
					createData,
				);
				await refetch();
				setNotification({
					title: 'New Package Added!',
					message: 'Package Added Successfully!',
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
					<label className={LabelLeftClass} htmlFor="active">
						Active:
					</label>
					<select
						id="active"
						className={TextBoxRightClass}
						placeholder=""
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
				<PackagesCreateModal closeModal={() => setToggleModal(false)} handleAdd={handleAdd} />
			) : null}
		</div>
	);
}
