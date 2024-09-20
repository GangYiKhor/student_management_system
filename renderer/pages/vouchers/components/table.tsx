import { QueryObserverResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useFormContextWithId } from '../../../components/providers/form-providers';
import { TableColumnType, TableTemplate } from '../../../components/tables/table-template';
import { usePost } from '../../../hooks/use-post';
import { dateFormatter, getToday, isSameDayOrAfter } from '../../../utils/dateOperations';
import { GreenBoldText, RedBoldText } from '../../../utils/tailwindClass/text';
import { VoucherUpdateDto } from '../../../utils/types/dtos/vouchers/update';
import { ErrorResponse } from '../../../utils/types/responses/error';
import {
	VouchersGetResponse,
	VouchersGetResponses,
} from '../../../utils/types/responses/vouchers/get';
import { BackendPath, defaultSort, SearchFormId } from '../constants';
import { EditData, SearchDataType } from '../types';
import { VouchersModal } from './vouchers-modal';

const columns: TableColumnType<VouchersGetResponse>[] = [
	{ title: 'ID', columnName: 'id' },
	{
		title: 'Student',
		columnName: 'student_name',
		valueParser: value => value?.student?.student_name || 'Everyone',
	},
	{
		title: 'Discount',
		columnName: 'discount',
		valueParser: value => {
			if (value.is_percentage) {
				return value?.discount?.toFixed(2) + ' %';
			} else {
				return 'RM ' + value?.discount?.toFixed(2);
			}
		},
	},
	{
		title: 'Start Date',
		columnName: 'start_date',
		valueParser: value => dateFormatter(value?.start_date),
	},
	{
		title: 'Expired At',
		columnName: 'expired_at',
		valueParser: value => dateFormatter(value?.expired_at),
	},
	{
		title: 'Status',
		columnName: 'used',
		valueParser: value => (
			<span
				className={
					value?.used || !isSameDayOrAfter(value?.expired_at, getToday())
						? RedBoldText
						: GreenBoldText
				}
			>
				{value?.used
					? 'Used'
					: !isSameDayOrAfter(value?.expired_at, getToday())
						? 'Expired'
						: 'Unused'}
			</span>
		),
	},
];

type PropType = {
	data: VouchersGetResponses;
	refetch: () => Promise<QueryObserverResult<VouchersGetResponses, AxiosError<ErrorResponse, any>>>;
	setOrderBy: (value: string) => void;
};

export function VoucherTable({ data, refetch, setOrderBy }: Readonly<PropType>) {
	const { formData } = useFormContextWithId<SearchDataType>(SearchFormId);
	const [tableData, setTableData] = useState<VouchersGetResponses>([]);
	const [selected, setSelected] = useState<EditData>(undefined);
	const postVoucher = usePost<VoucherUpdateDto, void>(BackendPath);

	const handleEdit = (data: EditData) => {
		setSelected(data);
	};

	const handleUpdate = async (data: VoucherUpdateDto) => {
		await postVoucher(data, selected.id);
		await refetch();
	};

	useEffect(() => {
		let filteredData = data;
		const search = formData?.general?.value?.trim().toLowerCase();
		if (search) {
			filteredData = filteredData.filter(
				value =>
					'#' + value.id.toLowerCase() === search ||
					value.student?.student_name?.toLowerCase().includes(search),
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
				<VouchersModal
					closeModal={() => setSelected(undefined)}
					handler={handleUpdate}
					data={selected}
				/>
			) : null}
		</React.Fragment>
	);
}
