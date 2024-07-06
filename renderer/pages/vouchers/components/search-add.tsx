import { useEffect } from 'react';
import { ComboBox } from '../../../components/inputs/combo-box';
import { useFormContext } from '../../../components/providers/form-providers';
import { SearchBar } from '../../../components/search-bar';
import { GeneralSearch } from '../../../components/searches/general-search';
import { StatusSearch } from '../../../components/searches/status-search';
import { useCustomQuery } from '../../../hooks/use-custom-query';
import { useGetStudentComboBoxOptions } from '../../../hooks/use-get-student-options';
import { BlueButtonClass } from '../../../utils/tailwindClass/button';
import { SearchBarButtons } from '../../../utils/types/search-bar-button';
import { SearchDataType } from '../types';

type PropType = {
	setSearch: (value: string) => void;
	setStudentId: (value: number) => void;
	setIsActive: (value: boolean) => void;
	setToggleModal: (value: boolean) => void;
};

export function VouchersSearchAdd({
	setSearch,
	setStudentId,
	setIsActive,
	setToggleModal,
}: Readonly<PropType>) {
	const { formData } = useFormContext<SearchDataType>();

	const buttons: SearchBarButtons = [
		{
			text: 'New Voucher',
			className: BlueButtonClass,
			onClick: () => setToggleModal(true),
		},
	];

	const getStudents = useGetStudentComboBoxOptions(true);
	const { data: studentOptions } = useCustomQuery<{ id: number; student_name: string }[]>({
		queryKey: ['students'],
		queryFn: () => getStudents({ orderBy: 'student_name asc' }),
	});

	useEffect(() => {
		setSearch(formData.general?.value);
	}, [formData.general?.value]);

	useEffect(() => {
		setStudentId(formData.student_search_id?.value);
	}, [formData.student_search_id?.value]);

	useEffect(() => {
		setIsActive(formData.status?.value);
	}, [formData.status?.value]);

	return (
		<SearchBar buttons={buttons}>
			<GeneralSearch />

			<ComboBox
				id="student-search"
				label="Student"
				name="student_search_id"
				columns={['id', 'student_name']}
				options={[{ id: -1, student_name: 'Everyone' }, ...studentOptions]}
				labelColumn="student_name"
				valueParser={value => value?.id}
				leftLabel
			/>

			<StatusSearch />
		</SearchBar>
	);
}
