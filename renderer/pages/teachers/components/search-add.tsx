import { useEffect } from 'react';
import { useFormContext } from '../../../components/providers/form-providers';
import { SearchBar } from '../../../components/search-bar';
import { GeneralSearch } from '../../../components/searches/general-search';
import { StatusSearch } from '../../../components/searches/status-search';
import { BlueButtonClass } from '../../../utils/tailwindClass/button';
import { SearchBarButtons } from '../../../utils/types/search-bar-button';
import { SearchDataType } from '../types';

type PropType = {
	setSearch: (value: string) => void;
	setIsActive: (value: boolean) => void;
	setToggleModal: (value: boolean) => void;
};

export function TeachersSearchAdd({ setSearch, setIsActive, setToggleModal }: Readonly<PropType>) {
	const { formData } = useFormContext<SearchDataType>();

	const buttons: SearchBarButtons = [
		{
			text: 'Register',
			className: BlueButtonClass,
			onClick: () => setToggleModal(true),
		},
	];

	useEffect(() => {
		setSearch(formData.general?.value);
	}, [formData.general?.value]);

	useEffect(() => {
		setIsActive(formData.status?.value);
	}, [formData.status?.value]);

	return (
		<SearchBar buttons={buttons}>
			<GeneralSearch />
			<StatusSearch />
		</SearchBar>
	);
}
