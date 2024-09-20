import { Form } from '../../../components/inputs/form';
import { NumberInput } from '../../../components/inputs/number-input';
import { SelectInput } from '../../../components/inputs/select-input';
import { SearchBar } from '../../../components/search-bar';
import { GeneralSearch } from '../../../components/searches/general-search';
import { StatusSearch } from '../../../components/searches/status-search';
import { useGetOptions } from '../../../hooks/use-get';
import { useGetFormOptionsIdOnly } from '../../../hooks/use-get-form-options';
import { DAY_OPTIONS, TEACHER_API_PATH } from '../../../utils/constants/constants';
import { BlueButtonClass } from '../../../utils/tailwindClass/button';
import { TeachersGetDto } from '../../../utils/types/dtos/teachers/get';
import { TeachersGetResponse } from '../../../utils/types/responses/teachers/get';
import { SearchBarButtons } from '../../../utils/types/search-bar-button';
import { searchDefaultValue, SearchFormId } from '../constants';

type PropType = {
	setToggleModal: (value: boolean) => void;
};

export function ClassesSearchAdd({ setToggleModal }: Readonly<PropType>) {
	const buttons: SearchBarButtons = [
		{
			text: 'New Class',
			className: BlueButtonClass,
			onClick: () => setToggleModal(true),
		},
	];

	const getForms = useGetFormOptionsIdOnly();
	const getTeachers = useGetOptions<TeachersGetDto, TeachersGetResponse>(
		TEACHER_API_PATH,
		value => value.teacher_name,
		value => value.id,
	);

	return (
		<SearchBar buttons={buttons}>
			<Form formId={SearchFormId} defaultValue={searchDefaultValue()}>
				<GeneralSearch />

				<SelectInput
					id="form-search"
					label="Form"
					name="form_id"
					queryFn={() => getForms({ is_active: true, orderBy: 'form_name asc' })}
					leftLabel
				/>

				<SelectInput
					id="teacher-search"
					label="Teacher"
					name="teacher_id"
					queryFn={() => getTeachers({ is_active: true, orderBy: 'teacher_name asc' })}
					leftLabel
				/>

				<NumberInput
					id="year-search"
					label="Year"
					name="class_year"
					min={2000}
					max={2200}
					step={1}
					leftLabel
				/>

				<SelectInput id="day-search" label="Day" name="day" options={DAY_OPTIONS} leftLabel />

				<StatusSearch />
			</Form>
		</SearchBar>
	);
}
