import {CSVDataTable, CSVRow} from "./CSVDataTable";
import React from "react";


export interface EditTableProps {
    onPrev: () => void;
    onNext: () => void;
    onChange: (data: { [key: string]: any}) => void;
    transactions: CSVRow[];
}


export const EditTable: React.FC<EditTableProps> = (props: EditTableProps) =>  {

   const [editedTransactions, setEditedTransactions] = React.useState(props.transactions);




    return <div>

        <div className="pt-4">
            <CSVDataTable rows={editedTransactions} />
        </div>
    </div>
}
