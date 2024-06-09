import { QueryObserverResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { FormProvider } from '../../../components/providers/form-providers';
import { TableColumnType, TableTemplate } from '../../../components/tables/table-template';
import { usePost } from '../../../hooks/use-post';
import { DAY } from '../../../utils/constants/constants';
import {
	dateFormatter,
	getToday,
	isSameDayOrAfter,
	isSameDayOrBefore,
} from '../../../utils/dateOperations';
import { GreenBoldText, RedBoldText, YellowBoldText } from '../../../utils/tailwindClass/text';
import { ClassUpdateDto } from '../../../utils/types/dtos/classes/update';
import {
	ClassesGetResponse,
	ClassesGetResponses,
} from '../../../utils/types/responses/classes/get';
import { ErrorResponse } from '../../../utils/types/responses/error';
import { BackendPath, defaultSort, formDefaultValueFilled } from '../constants';
import { EditData } from '../types';
import { ClassesModal } from './classes-modal';

const getStatus = (start_date: Date, end_date: Date) => {
	let textColour = '';
	let text = '';
	const today = getToday();

	if (!isSameDayOrBefore(start_date, today)) {
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

	if (day === new Date().getDay()) {
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

type PropType = {
	data: ClassesGetResponses;
	search?: string;
	refetch: () => Promise<QueryObserverResult<ClassesGetResponses, AxiosError<ErrorResponse, any>>>;
	setOrderBy: (value: string) => void;
};

export function ClassTable({ data, search, refetch, setOrderBy }: Readonly<PropType>) {
	const [tableData, setTableData] = useState<ClassesGetResponses>([]);
	const [selected, setSelected] = useState<EditData>(undefined);
	const postClass = usePost<ClassUpdateDto, void>(BackendPath);

	const handleEdit = (data: EditData) => {
		setSelected(data);
	};

	const handleUpdate = async (data: ClassUpdateDto) => {
		await postClass(data, selected.id);
		await refetch();
	};

	useEffect(() => {
		let filteredData = data;
		if (search) {
			search = search.trim().toLowerCase();
			filteredData = filteredData.filter(
				value =>
					'#' + value.id === search ||
					value.form.form_name?.toLowerCase().includes(search) ||
					value.teacher.teacher_name?.toLowerCase().includes(search) ||
					value.class_name?.toLowerCase().includes(search),
			);
		}

		setTableData(filteredData);
	}, [data, search]);

	return (
		<React.Fragment>
			<TableTemplate
				columns={columns}
				data={tableData}
				setOrderBy={setOrderBy}
				defaultSort={defaultSort}
				handleEdit={handleEdit}
			/>

			{selected ? (
				<FormProvider defaultValue={formDefaultValueFilled(selected)}>
					<ClassesModal
						closeModal={() => setSelected(undefined)}
						handler={handleUpdate}
						data={selected}
					/>
				</FormProvider>
			) : null}
		</React.Fragment>
	);
}
