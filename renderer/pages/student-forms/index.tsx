import clsx from 'clsx';
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
import { usePost } from '../../hooks/use-post';
import { Layout } from '../../layouts/basic_layout';
import { STUDENT_FORM_API_PATH } from '../../utils/constants/constants';
import {
	BlueButtonClass,
	GreenButtonClass,
	RedButtonClass,
} from '../../utils/tailwindClass/button';
import { ContentContainer } from '../../utils/tailwindClass/containers';
import { GreenBoldText, RedBoldText } from '../../utils/tailwindClass/text';
import { StudentFormCreateDto } from '../../utils/types/dtos/student-forms/create';
import { StudentFormsGetDto } from '../../utils/types/dtos/student-forms/get';
import { StudentFormUpdateDto } from '../../utils/types/dtos/student-forms/update';
import {
	StudentFormsGetResponse,
	StudentFormsGetResponses,
} from '../../utils/types/responses/student-forms/get';
import { SearchBarButtons } from '../../utils/types/search-bar-button';

const SearchFormId = 'student-forms-searchbar';
const defaultSort: DefaultSort = { field: 'form_name', asc: true };
const defaultSortString: string = `${defaultSort.field} ${defaultSort.asc ? 'asc' : 'desc'}`;

type SearchDataType = {
	general: string;
	status: boolean;
};

const columns = (
	handleAction: (id: number, is_active: boolean) => void,
): TableColumnType<StudentFormsGetResponse>[] => {
	return [
		{ title: 'ID', columnName: 'id', addOnClass: 'w-[5rem]' },
		{ title: 'Form', columnName: 'form_name' },
		{
			title: 'Status',
			columnName: 'is_active',
			valueParser: value => (
				<span className={value.is_active ? GreenBoldText : RedBoldText}>
					{value.is_active ? 'Active' : 'Inactive'}
				</span>
			),
		},
		{
			title: 'Action',
			columnName: 'action',
			addOnClass: 'w-[150px]',
			valueParser: value => (
				<button
					onClick={() => handleAction(value.id, !value.is_active)}
					className={clsx(value.is_active ? RedButtonClass : GreenButtonClass, 'w-[125px]')}
				>
					{value.is_active ? 'Deactivate' : 'Activate'}
				</button>
			),
			notClickable: true,
			notSortable: true,
		},
	];
};

function StudentForms() {
	const router = useRouter();
	const { formData } = useFormContext<SearchDataType>(SearchFormId);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);

	// Fetch Data
	const getForms = useGet<StudentFormsGetDto, StudentFormsGetResponses>(STUDENT_FORM_API_PATH);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<StudentFormsGetResponses>({
		queryKey: ['student-form-list'],
		queryFn: () => getForms({ orderBy }),
		fetchOnVariable: [orderBy],
	});

	const handleEdit = (data: StudentFormsGetResponse) => {
		router.push(`/student-forms/${data.id}`);
	};

	const handleCreate = () => {
		router.push(`/student-forms/new`);
	};

	const postForm = usePost<StudentFormCreateDto | StudentFormUpdateDto, void>(
		STUDENT_FORM_API_PATH,
	);
	const handleUpdate = async (id: number, is_active: boolean) => {
		await postForm({ is_active }, id);
		await refetch();
	};

	const buttons: SearchBarButtons = [
		{
			text: 'New Form',
			className: BlueButtonClass,
			onClick: () => handleCreate(),
		},
	];

	const [tableData, setTableData] = useState<StudentFormsGetResponses>([]);
	useEffect(() => {
		let filteredData = data;
		const search = formData?.general?.value?.trim().toLowerCase();
		if (search) {
			filteredData = filteredData.filter(
				value => '#' + value.id === search || value.form_name?.toLowerCase().includes(search),
			);
		}

		const status = formData?.status?.value;
		if (status !== undefined) {
			filteredData = filteredData.filter(value => value.is_active === status);
		}

		setTableData(filteredData);
	}, [data, formData?.general?.value, formData?.status?.value]);

	return (
		<React.Fragment>
			<Head>
				<title>Student Forms</title>
			</Head>
			<Layout headerTitle="Student Forms">
				<Loader isLoading={isLoading}>
					<div className={ContentContainer}>
						<Form formId={SearchFormId} keepData revertible>
							<SearchBar buttons={buttons}>
								<GeneralSearch />
								<StatusSearch />
							</SearchBar>
						</Form>

						<TableTemplate
							columns={columns(handleUpdate)}
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

export default StudentForms;
