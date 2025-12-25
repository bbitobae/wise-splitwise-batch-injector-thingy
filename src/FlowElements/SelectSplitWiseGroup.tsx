import {CSVRow} from "./CSVDataTable";
import React from "react";
import {EditTableProps} from "./EditTable";

export interface SelectSplitWiseGroupProps {
    onPrev: () => void;
    onNext: () => void;
    onChange: (data: { [key: string]: any}) => void;
    transactions: CSVRow[];
}


export const SelectSplitWiseGroup: React.FC<SelectSplitWiseGroupProps>  = ({}) => {


    return <></>
}