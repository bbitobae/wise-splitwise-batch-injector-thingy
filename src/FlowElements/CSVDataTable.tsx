import 'react-data-grid/lib/styles.css';

import { DataGrid, type Column } from 'react-data-grid';
import Moment from "moment";
import {dateTimeFormat} from "./FilterTable";

export interface CSVRow {
    id: string,
    amount: number,
    currency: string,
    name: string,
    spender: string,
    category: string,
    createdOn: number | Date | Moment.Moment | string,
}

export interface CSVDataTableProps {
    rows: CSVRow[];
}

export const CSVDataTable: React.FC<CSVDataTableProps> = (props: CSVDataTableProps) => {
    const columns: readonly Column<CSVRow>[] = [
        { key: 'id', name: 'ID'},
        { key: 'amount', name: 'Amount'},
        { key: 'currency', name: 'Currency'},
        { key: 'name', name: 'Name'},
        { key: 'spender', name: 'Spender'},
        { key: 'category', name: 'Category'},
        { key: 'createdOn', name: 'CreatedOn'},
    ]

    const humanReadableDate = (table: CSVRow[]) => {
        return table.map(row => {
            return {...row, createdOn: Moment(row.createdOn).format(dateTimeFormat)}
        })
    }

    return <DataGrid columns={columns} rows={humanReadableDate(props.rows)}></DataGrid>;
}



