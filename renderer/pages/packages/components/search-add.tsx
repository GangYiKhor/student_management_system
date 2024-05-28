import clsx from 'clsx';
import { useEffect } from 'react';
import { SelectInput } from '../../../components/inputs/select-input';
import { useFormContext } from '../../../components/providers/form-providers';
import { GeneralSearch } from '../../../components/searches/general-search';
import { StatusSearch } from '../../../components/searches/status-search';
import { useGetOptions } from '../../../hooks/use-get';
import { BlueButtonClass } from '../../../utils/class/button';
import { StudentFormsGetDto } from '../../../utils/types/dtos/student-forms/get';
import { StudentFormsGetResponse } from '../../../utils/types/responses/student-forms/get';
import { SearchDataType } from '../types';

type PropType = {
	setSearch: (value: string) => void;
	setFormId: (value: number) => void;
	setIsActive: (value: boolean) => void;
	setToggleModal: (value: boolean) => void;
};

export function PackagesSearchAdd({
	setSearch,
	setFormId,
	setIsActive,
	setToggleModal,
}: Readonly<PropType>) {
	const { formData } = useFormContext<SearchDataType>();
	const getForms = useGetOptions<StudentFormsGetDto, StudentFormsGetResponse>(
		'/api/student-forms',
		value => value.form_name,
		value => value.id,
	);

	useEffect(() => {
		setSearch(formData.general?.value);
	}, [formData.general?.value]);

	useEffect(() => {
		setFormId(formData.form_id?.value);
	}, [formData.form_id?.value]);

	useEffect(() => {
		setIsActive(formData.status?.value);
	}, [formData.status?.value]);

	return (
		<div className={clsx('flex', 'justify-between')}>
			<div className={clsx('flex', 'flex-row', 'items-baseline')}>
				<GeneralSearch />
				<SelectInput
					id="form-search"
					label="Form"
					name="form_id"
					placeholder="All"
					queryFn={() => getForms({ is_active: true, orderBy: 'form_name asc' })}
					leftLabel
				/>
				<StatusSearch />
			</div>

			<div className={clsx('flex', 'justify-end', 'gap-4', 'items-center')}>
				<button className={BlueButtonClass} onClick={() => setToggleModal(true)}>
					New Package
				</button>
			</div>
		</div>
	);
}
