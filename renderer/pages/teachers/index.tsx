import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Form } from '../../components/inputs/form';
import { LastUpdatedAt } from '../../components/last-updated';
import { Loader } from '../../components/loader';
import { useFormContext } from '../../components/providers/form-providers';
import { SearchBar } from '../../components/search-bar';
import { GeneralSearch } from '../../components/searches/general-search';
import { StatusSearch } from '../../components/searches/status-search';
import {
	DefaultSort,
	TableColumnType,
	TableTemplate,
} from '../../components/tables/table-template';
import { useCustomQuery } from '../../hooks/use-custom-query';
import { useGet } from '../../hooks/use-get';
import { Layout } from '../../layouts/basic_layout';
import { TEACHER_API_PATH } from '../../utils/constants/constants';
import { BlueButtonClass } from '../../utils/tailwindClass/button';
import { ContentContainer } from '../../utils/tailwindClass/containers';
import { GreenBoldText, RedBoldText } from '../../utils/tailwindClass/text';
import { TeachersGetDto } from '../../utils/types/dtos/teachers/get';
import {
	TeachersGetResponse,
	TeachersGetResponses,
} from '../../utils/types/responses/teachers/get';
import { SearchBarButtons } from '../../utils/types/search-bar-button';

const SearchFormId = 'teachers-searchbar';
const defaultSort: DefaultSort = { field: 'teacher_name', asc: true };
const defaultSortString: string = `${defaultSort.field} ${defaultSort.asc ? 'asc' : 'desc'}`;

type SearchDataType = {
	general: string;
	status: boolean;
};

const columns: TableColumnType<TeachersGetResponse>[] = [
	{ title: 'ID', columnName: 'id', addOnClass: 'w-[5rem]' },
	{ title: 'Name', columnName: 'teacher_name' },
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

function Teachers() {
	const router = useRouter();
	const { formData, getValues } = useFormContext<SearchDataType>(SearchFormId);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);

	// Fetch Data
	const getTeachers = useGet<TeachersGetDto, TeachersGetResponses>(TEACHER_API_PATH);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<TeachersGetResponses>({
		queryKey: ['teacher-list'],
		queryFn: () => {
			const { status: is_active } = getValues();
			return getTeachers({ is_active, orderBy });
		},
		fetchOnVariable: [formData?.status?.value, orderBy],
	});

	const handleEdit = (data: TeachersGetResponse) => {
		router.push(`/teachers/${data.id}`);
	};

	const handleCreate = () => {
		router.push(`/teachers/new`);
	};

	const buttons: SearchBarButtons = [
		{
			text: 'Register',
			className: BlueButtonClass,
			onClick: () => handleCreate(),
		},
	];

	const [tableData, setTableData] = useState<TeachersGetResponses>([]);
	useEffect(() => {
		let filteredData = data;
		const search = getValues()?.general?.trim().toLowerCase();
		if (search) {
			filteredData = filteredData.filter(
				value =>
					'#' + value.id === search ||
					value.teacher_name?.toLowerCase().includes(search) ||
					value.phone_number?.includes(search) ||
					value.phone_number?.replace(/-/g, '').replace(/\s/g, '').includes(search) ||
					value.ic?.includes(search) ||
					value.ic?.replace(/-/g, '').includes(search),
			);
		}

		setTableData(filteredData);
	}, [data, formData?.general?.value]);

	return (
		<React.Fragment>
			<Head>
				<title>Teachers</title>
			</Head>
			<Layout headerTitle="Teachers">
				<Loader isLoading={isLoading}>
					<div className={ContentContainer}>
						<Form formId={SearchFormId} keepData revertible>
							<SearchBar buttons={buttons}>
								<GeneralSearch />
								<StatusSearch />
							</SearchBar>
						</Form>

						<TableTemplate
							columns={columns}
							data={tableData}
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

export default Teachers;
