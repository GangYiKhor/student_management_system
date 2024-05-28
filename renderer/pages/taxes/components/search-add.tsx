import clsx from 'clsx';
import { useEffect } from 'react';
import { useFormContext } from '../../../components/providers/form-providers';
import { StatusSearch } from '../../../components/searches/status-search';
import { BlueButtonClass } from '../../../utils/class/button';
import { SearchDataType } from '../types';

type PropType = {
	setIsActive: (value: boolean) => void;
	setToggleModal: (value: boolean) => void;
};

export function TaxesSearchAdd({ setIsActive, setToggleModal }: Readonly<PropType>) {
	const { formData } = useFormContext<SearchDataType>();

	useEffect(() => {
		setIsActive(formData.status?.value);
	}, [formData.status?.value]);

	return (
		<div className={clsx('flex', 'justify-between')}>
			<div className={clsx('flex', 'flex-row', 'gap-8', 'items-baseline')}>
				<StatusSearch />
			</div>

			<div className={clsx('flex', 'justify-end', 'gap-4', 'items-center')}>
				<button className={BlueButtonClass} onClick={() => setToggleModal(true)}>
					New Tax
				</button>
			</div>
		</div>
	);
}
