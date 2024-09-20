import { ComboBox } from '../../../components/inputs/combo-box';
import { Form } from '../../../components/inputs/form';
import { SearchBar } from '../../../components/search-bar';
import { GeneralSearch } from '../../../components/searches/general-search';
import { StatusSearch } from '../../../components/searches/status-search';
import { useCustomQuery } from '../../../hooks/use-custom-query';
import { useGetStudentComboBoxOptionsIdOnly } from '../../../hooks/use-get-student-options';
import { BlueButtonClass } from '../../../utils/tailwindClass/button';
import { SearchBarButtons } from '../../../utils/types/search-bar-button';
import { searchDefaultValue, SearchFormId } from '../constants';

type PropType = {
	setToggleModal: (value: boolean) => void;
};

export function VouchersSearchAdd({ setToggleModal }: Readonly<PropType>) {
	const buttons: SearchBarButtons = [
		{
			text: 'New Voucher',
			className: BlueButtonClass,
			onClick: () => setToggleModal(true),
		},
	];

	const getStudents = useGetStudentComboBoxOptionsIdOnly();
	const { data: studentOptions } = useCustomQuery<{ id: number; student_name: string }[]>({
		queryKey: ['students'],
		queryFn: () => getStudents({ orderBy: 'student_name asc' }),
	});

	return (
		<SearchBar buttons={buttons}>
			<Form formId={SearchFormId} defaultValue={searchDefaultValue()}>
				<GeneralSearch />

				<ComboBox
					id="student-search"
					label="Student"
					name="student_search_id"
					columns={['id', 'student_name']}
					options={[{ id: -1, student_name: 'Everyone' }, ...(studentOptions ?? [])]}
					labelColumn="student_name"
					valueParser={value => value?.id}
					leftLabel
				/>

				<StatusSearch />
			</Form>
		</SearchBar>
	);
}
