import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ComboBox } from '../../components/inputs/combo-box';
import { Form } from '../../components/inputs/form';
import { NumberInput } from '../../components/inputs/number-input';
import { SelectInput } from '../../components/inputs/select-input';
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
import { useGetFormOptionsIdOnly } from '../../hooks/use-get-form-options';
import { Layout } from '../../layouts/basic_layout';
import {
	CLASS_API_PATH,
	DAY,
	DAY_OPTIONS,
	TEACHER_API_PATH,
} from '../../utils/constants/constants';
import {
	dateFormatter,
	getCurrentDayOfWeek,
	getToday,
	isDayAfter,
	isSameDayOrAfter,
	parseDateTime,
} from '../../utils/dateOperations';
import { BlueButtonClass } from '../../utils/tailwindClass/button';
import { ContentContainer } from '../../utils/tailwindClass/containers';
import { GreenBoldText, RedBoldText, YellowBoldText } from '../../utils/tailwindClass/text';
import { ClassesGetDto } from '../../utils/types/dtos/classes/get';
import { TeachersGetDto } from '../../utils/types/dtos/teachers/get';
import { ClassesGetResponse, ClassesGetResponses } from '../../utils/types/responses/classes/get';
import { TeachersGetResponses } from '../../utils/types/responses/teachers/get';
import { SearchBarButtons } from '../../utils/types/search-bar-button';

const SearchFormId = 'classes-searchbar';
const defaultSort: DefaultSort = { field: 'start_time', asc: true };
const defaultSortString: string = `${defaultSort.field} ${defaultSort.asc ? 'asc' : 'desc'}`;

type SearchDataType = {
	general: string;
	form_id: number;
	teacher_id: number;
	class_year: number;
	day: number;
	status: boolean;
};

const getStatus = (start_date: Date, end_date: Date) => {
	const today = getToday();
	let textColour = '';
	let text = '';

	if (isDayAfter(start_date, today)) {
		textColour = YellowBoldText;
		text = 'Not Started Yet';
	} else if (end_date === undefined || isSameDayOrAfter(end_date, today)) {
		textColour = GreenBoldText;
		text = 'Active';
	} else {
		textColour = RedBoldText;
		text = 'Class Stopped';
	}

	return <span className={textColour}>{text}</span>;
};

const getCurrentDay = (day: number) => {
	let textColour = '';

	if (day === getCurrentDayOfWeek()) {
		textColour = GreenBoldText;
	}

	return <span className={textColour}>{DAY[day]}</span>;
};

const columns: TableColumnType<ClassesGetResponse>[] = [
	{ title: 'ID', columnName: 'id', addOnClass: 'w-[5rem]' },
	{ title: 'Class', columnName: 'class_name' },
	{
		title: 'Teacher',
		columnName: 'teacher_name',
		valueParser: value => value.teacher.teacher_name,
	},
	{ title: 'Form', columnName: 'form_name', valueParser: value => value.form.form_name },
	{ title: 'Day', columnName: 'day', valueParser: value => getCurrentDay(value.day) },
	{
		title: 'Time',
		columnName: 'start_time',
		valueParser: value =>
			`${dateFormatter(value.start_time, { format: 'hh:mm a' })} - ${dateFormatter(value.end_time, { format: 'hh:mm a' })}`,
	},
	{
		title: 'Fees',
		columnName: 'fees',
		valueParser: value => `RM ${value.fees.toFixed(2)}`,
	},
	{
		title: 'Package',
		columnName: 'is_package',
		valueParser: value => (value.is_package ? 'Yes' : 'No'),
		notSortable: true,
	},
	{
		title: 'Status',
		columnName: 'end_date',
		valueParser: value => getStatus(value.start_date, value.end_date),
		notSortable: true,
	},
];

const parseGetData = (data: ClassesGetResponses) =>
	data.map(value => {
		value.start_date = parseDateTime(value.start_date);
		value.end_date = parseDateTime(value.end_date);
		value.start_time = parseDateTime(value.start_time);
		value.end_time = parseDateTime(value.end_time);
		return value;
	});

function ClassRegistration() {
	const router = useRouter();
	const { formData, getValues } = useFormContext<SearchDataType>(SearchFormId);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);

	// Fetch Data
	const getClasses = useGet<ClassesGetDto, ClassesGetResponses>(CLASS_API_PATH, parseGetData);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<ClassesGetResponses>({
		queryKey: ['class-list'],
		queryFn: () => {
			const { form_id, teacher_id, class_year, day, status: is_active } = getValues();
			return getClasses({ form_id, teacher_id, class_year, day, is_active, orderBy });
		},
		fetchOnVariable: [
			formData?.form_id?.value,
			formData?.teacher_id?.value,
			formData?.class_year?.value,
			formData?.day?.value,
			formData?.status?.value,
			orderBy,
		],
	});

	const handleEdit = (data: ClassesGetResponse) => {
		router.push(`/classes/${data.id}`);
	};

	const handleCreate = () => {
		router.push(`/classes/new`);
	};

	const buttons: SearchBarButtons = [
		{
			text: 'New Class',
			className: BlueButtonClass,
			onClick: () => handleCreate(),
		},
	];

	// Fetch Options
	const getForms = useGetFormOptionsIdOnly();
	const getTeachers = useGet<TeachersGetDto, TeachersGetResponses>(TEACHER_API_PATH);
	const { data: teacherOptions } = useCustomQuery<TeachersGetResponses>({
		queryKey: ['teacher_options'],
		queryFn: () => getTeachers({ orderBy: 'teacher_name asc' }),
	});

	const [tableData, setTableData] = useState<ClassesGetResponses>([]);
	useEffect(() => {
		let filteredData = data;
		const search = getValues()?.general?.trim().toLowerCase();
		if (search) {
			filteredData = filteredData.filter(
				value =>
					'#' + value.id === search ||
					value.form.form_name?.toLowerCase().includes(search) ||
					value.teacher.teacher_name?.toLowerCase().includes(search) ||
					value.class_name?.toLowerCase().includes(search),
			);
		}

		setTableData(filteredData);
	}, [data, formData?.general?.value]);

	return (
		<React.Fragment>
			<Head>
				<title>Classes</title>
			</Head>
			<Layout headerTitle="Classes">
				<Loader isLoading={isLoading}>
					<div className={ContentContainer}>
						<Form formId={SearchFormId} keepData revertible>
							<SearchBar buttons={buttons}>
								<GeneralSearch />

								<SelectInput
									id="form_id"
									label="Form"
									queryFn={() => getForms({ is_active: true, orderBy: 'form_name asc' })}
									leftLabel
								/>

								<ComboBox
									id="teacher_id"
									label="Teacher"
									options={teacherOptions}
									labelColumn="teacher_name"
									columns={['teacher_name']}
									valueParser={value => value.id}
									leftLabel
								/>

								<NumberInput
									id="class_year"
									label="Year"
									defaultValue={new Date().getFullYear()}
									min={2000}
									max={2200}
									step={1}
									leftLabel
								/>

								<SelectInput
									id="day"
									label="Day"
									defaultValue={getCurrentDayOfWeek()}
									options={DAY_OPTIONS}
									leftLabel
								/>

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

export default ClassRegistration;
