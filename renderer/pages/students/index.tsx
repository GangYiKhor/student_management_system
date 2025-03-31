import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { DateRangeInput } from '../../components/inputs/date-range-input';
import { Form } from '../../components/inputs/form';
import { NumberInput } from '../../components/inputs/number-input';
import { SelectInput } from '../../components/inputs/select-input';
import { TextInput } from '../../components/inputs/text-input';
import { LastUpdatedAt } from '../../components/last-updated';
import { Loader } from '../../components/loader';
import { useFormContext } from '../../components/providers/form-providers';
import { SearchBar } from '../../components/search-bar';
import { StatusSearch } from '../../components/searches/status-search';
import {
	DefaultSort,
	TableColumnType,
	TableTemplate,
} from '../../components/tables/table-template';
import { useCustomQuery } from '../../hooks/use-custom-query';
import { useGet } from '../../hooks/use-get';
import { useGetFormOptionsIdOnly } from '../../hooks/use-get-form-options';
import { Layout } from '../../layouts/basic_layout';
import { STUDENT_API_PATH } from '../../utils/constants/constants';
import { parseDateTime } from '../../utils/dateOperations';
import { BlueButtonClass } from '../../utils/tailwindClass/button';
import { GreenBoldText, RedBoldText } from '../../utils/tailwindClass/text';
import { StudentsGetDto } from '../../utils/types/dtos/students/get';
import {
	StudentsGetResponse,
	StudentsGetResponses,
} from '../../utils/types/responses/students/get';
import { SearchBarButtons } from '../../utils/types/search-bar-button';

const SearchFormId = 'students-searchbar';
const defaultSort: DefaultSort = { field: 'student_name', asc: true };
const defaultSortString: string = `${defaultSort.field} ${defaultSort.asc ? 'asc' : 'desc'}`;

type SearchDataType = {
	text: string;
	form_id: number;
	reg_date_start: Date;
	reg_date_end: Date;
	reg_year: number;
	status: boolean;
};

const columns: TableColumnType<StudentsGetResponse>[] = [
	{ title: 'ID', columnName: 'id', addOnClass: 'w-[5rem]' },
	{ title: 'Name', columnName: 'student_name' },
	{
		title: 'Form',
		columnName: 'form_name',
		valueParser: value => value.form?.form_name,
	},
	{ title: 'Year', columnName: 'reg_year' },
	{
		title: 'Status',
		columnName: 'is_active',
		valueParser: value => (
			<span className={value.is_active ? GreenBoldText : RedBoldText}>
				{value.is_active ? 'Active' : 'Inactive'}
			</span>
		),
	},
];

const parseGetData = (data: StudentsGetResponses) =>
	data.map(value => {
		value.reg_date = parseDateTime(value.reg_date);
		return value;
	});

function Students() {
	const router = useRouter();
	const { formData, getValues } = useFormContext<SearchDataType>(SearchFormId);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);

	// Fetch Data
	const getStudents = useGet<StudentsGetDto, StudentsGetResponses>(STUDENT_API_PATH, parseGetData);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<StudentsGetResponses>({
		queryKey: ['student-list'],
		queryFn: () => {
			const {
				text: search_text,
				form_id,
				reg_date_start,
				reg_date_end,
				reg_year,
				status: is_active,
			} = getValues();
			return getStudents({
				search_text,
				form_id,
				reg_date_start,
				reg_date_end,
				reg_year,
				is_active,
				orderBy,
			});
		},
		fetchOnVariable: [
			formData?.text?.value,
			formData?.form_id?.value,
			formData?.reg_date_start?.value,
			formData?.reg_date_end?.value,
			formData?.reg_year?.value,
			formData?.status?.value,
			orderBy,
		],
	});

	const handleEdit = (data: StudentsGetResponse) => {
		router.push(`/students/${data.id}`);
	};

	const handleCreate = () => {
		router.push(`/students/new`);
	};

	const buttons: SearchBarButtons = [
		{
			text: 'New Student',
			className: BlueButtonClass,
			onClick: () => handleCreate(),
		},
	];

	const getForms = useGetFormOptionsIdOnly();

	return (
		<React.Fragment>
			<Head>
				<title>Students</title>
			</Head>
			<Layout headerTitle="Students">
				<Loader isLoading={isLoading}>
					<div className={clsx('flex', 'flex-col', 'gap-4')}>
						<Form formId={SearchFormId} keepData revertible>
							<SearchBar buttons={buttons}>
								<TextInput
									id="text-search"
									label="Search"
									name="text"
									placeholder="Search any details"
									leftLabel
								/>

								<SelectInput
									id="form-search"
									label="Form"
									name="form_id"
									placeholder="All"
									queryFn={() => getForms({ is_active: true, orderBy: 'form_name asc' })}
									leftLabel
								/>

								<DateRangeInput label="Reg" startId="reg_date_start" endId="reg_date_end" />

								<NumberInput
									id="year-search"
									label="Year"
									name="reg_year"
									min={1990}
									max={2200}
									step={1}
									defaultValue={new Date().getFullYear()}
									leftLabel
								/>

								<StatusSearch />
							</SearchBar>
						</Form>

						<TableTemplate
							columns={columns}
							data={data}
							setOrderBy={setOrderBy}
							defaultSort={defaultSort}
							handleEdit={handleEdit}
						/>
						<LastUpdatedAt lastUpdatedAt={dataUpdatedAt} refetch={refetch} />
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default Students;
