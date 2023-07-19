import clsx from 'clsx';
import { BlueButtonClass } from '../../../utils/class/button';
import { LabelLeftClass, TextBoxRightClass } from '../../../utils/class/inputs';
import { useCallback, useState } from 'react';
import { TeachersCreateModal } from './create-modal';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import { TeachersCreateDto } from '../../../dtos/teachers/create';

const layoutClass = clsx('flex', 'justify-between');
const searchClass = clsx('flex', 'flex-row', 'gap-8', 'items-baseline');
const buttonClass = clsx('flex', 'justify-end', 'gap-4', 'items-center');

type PropType = {
	setSearch: CallableFunction;
	setStatus: CallableFunction;
	refetch: CallableFunction;
};

export function TeachersSearchAdd({ setSearch, setStatus, refetch }: PropType) {
	const { setNotification } = useNotificationContext();
	const [toggleModal, setToggleModal] = useState(false);

	const handleAdd = useCallback(
		async (createData: TeachersCreateDto) => {
			try {
				await axios.post<any, AxiosResponse<any, any>, TeachersCreateDto>(
					`/api/teachers/`,
					createData,
				);
				await refetch();
				setNotification({
					title: 'New Teacher Registered!',
					message: 'Teacher Registered Successfully!',
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
						placeholder="Search... (#1 to search ID)"
						onChange={e => setSearch(e.target.value)}
					/>
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
					Register
				</button>
			</div>
			{toggleModal ? (
				<TeachersCreateModal closeModal={() => setToggleModal(false)} handleAdd={handleAdd} />
			) : null}
		</div>
	);
}
