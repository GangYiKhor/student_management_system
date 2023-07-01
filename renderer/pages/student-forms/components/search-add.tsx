import clsx from 'clsx';
import { BlueButtonClass, GrayButtonClass } from '../../../utils/class/button';
import { LabelLeftClass, TextBoxClass } from '../../../utils/class/inputs';
import { useState } from 'react';
import { StudentFormCreateModal } from './create-modal';

const layoutClass = clsx('flex', 'justify-between');
const searchClass = clsx('flex', 'flex-row', 'gap-8', 'items-baseline');
const buttonClass = clsx('flex', 'justify-end', 'gap-4', 'items-center');

type PropType = {
	setSearch: CallableFunction;
	setStatus: CallableFunction;
	handleAdd: CallableFunction;
};

export function StudentFormsSearchAdd({ setSearch, setStatus, handleAdd }: PropType) {
	const [toggleModal, setToggleModal] = useState(false);

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
						className={TextBoxClass}
						placeholder="Type to search.."
						onChange={e => setSearch(e.target.value)}
					/>
				</div>
				<div>
					<label className={LabelLeftClass}>Status:</label>
					<select
						className={TextBoxClass}
						onChange={e =>
							setStatus(e.target.value === 'All' ? undefined : e.target.value === 'Active')
						}
					>
						<option value="All">All</option>
						<option value="Active">Active</option>
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
				<StudentFormCreateModal closeModal={() => setToggleModal(false)} handleAdd={handleAdd} />
			) : null}
		</div>
	);
}
