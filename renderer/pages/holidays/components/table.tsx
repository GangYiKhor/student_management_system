import { QueryObserverResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useFormContextWithId } from '../../../components/providers/form-providers';
import { TableColumnType, TableTemplate } from '../../../components/tables/table-template';
import { usePost } from '../../../hooks/use-post';
import { dateFormatter } from '../../../utils/dateOperations';
import { HolidayUpdateDto } from '../../../utils/types/dtos/holidays/update';
import { ErrorResponse } from '../../../utils/types/responses/error';
import {
	HolidaysGetResponse,
	HolidaysGetResponses,
} from '../../../utils/types/responses/holidays/get';
import { BackendPath, defaultSort, SearchFormId } from '../constants';
import { EditData, SearchDataType } from '../types';
import { HolidaysModal } from './holidays-modal';

const columns: TableColumnType<HolidaysGetResponse>[] = [
	{ title: 'ID', columnName: 'id', addOnClass: 'w-[5rem]', notSortable: true },
	{
		title: 'Date',
		columnName: 'date',
		valueParser: value => dateFormatter(value.date),
	},
	{ title: 'Description', columnName: 'description', notSortable: true },
];

type PropType = {
	data: HolidaysGetResponses;
	refetch: () => Promise<QueryObserverResult<HolidaysGetResponses, AxiosError<ErrorResponse, any>>>;
	setOrderBy: (value: string) => void;
};

export function HolidaysTable({ data, refetch, setOrderBy }: Readonly<PropType>) {
	const { formData } = useFormContextWithId<SearchDataType>(SearchFormId);
	const [tableData, setTableData] = useState<HolidaysGetResponses>([]);
	const [selected, setSelected] = useState<EditData>(undefined);
	const postHoliday = usePost<HolidayUpdateDto, void>(BackendPath);

	const handleEdit = (data: EditData) => {
		setSelected(data);
	};

	const handleUpdate = async (data: HolidayUpdateDto) => {
		await postHoliday(data, selected.id);
		await refetch();
	};

	useEffect(() => {
		let filteredData = data;
		const search = formData?.general?.value?.trim().toLowerCase();
		if (search) {
			filteredData = filteredData.filter(
				value => '#' + value.id === search || value.description?.toLowerCase().includes(search),
			);
		}

		setTableData(filteredData);
	}, [data, formData?.general?.value]);

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
				<HolidaysModal
					closeModal={() => setSelected(undefined)}
					handler={handleUpdate}
					data={selected}
				/>
			) : null}
		</React.Fragment>
	);
}
