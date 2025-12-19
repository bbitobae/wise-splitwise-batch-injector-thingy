import {CSVDataTable, CSVRow} from "./CSVDataTable";
import React, {useEffect, useId, useState} from "react";
import Datetime from "react-datetime";
import '../css/datetime.css'
import Moment from "moment";
import {MultiSelectDropdown} from "./MultiSelectDropdown";
import {start} from "node:repl";

export interface FilterTableProps {
    onPrev: () => void;
    onNext: () => void;
    onChange: (data: { [key: string]: any}) => void;
    csvRows: CSVRow[];
}

export const dateTimeFormat = 'YYYY-MM-DDTHH:mm:ss';

export const FilterTable: React.FC<FilterTableProps> = ({onPrev, onNext, onChange, csvRows}) => {

    const startDataId = useId()
    const endDateId = useId()
    const categoryId = useId()

    const parseDate = (dt: number | Date | string | Moment.Moment | undefined): Moment.Moment => {
        if (!dt) return Moment(0)
        if (typeof dt === 'string') return Moment(Date.parse(dt));
        if (typeof dt === 'number') return Moment(dt);
        else return Moment(dt);
    }

    const allCategories = new Set(csvRows.map(row => row.category))

    const [filteredRows, setFilteredRows] = useState(csvRows);
    const [filters, setFilters] = useState({
        startDate: parseDate(csvRows[0]?.createdOn),
        endDate: parseDate(csvRows[csvRows.length - 1]?.createdOn),
        categories: [...allCategories]
    })

    useEffect(() => {
        const newRows = csvRows.filter(row => {
            if (!parseDate(row.createdOn).isBetween(filters.startDate, filters.endDate)) return false;
            if (!filters.categories.includes(row.category)) return false;
            return true;
        });
        if (newRows.length != filteredRows.length) {
            onChange({"transactions": filteredRows});
            setFilteredRows(newRows);
        }
    }, [filteredRows, filters]);

    const handleStartDateChange = (sd: string | Moment.Moment) => setFilters({...filters, startDate: parseDate(sd)})
    const handleEndDateChange = (ed: string | Moment.Moment) => setFilters({...filters, endDate: parseDate(ed)})
    const handleCategoriesChange = (selected: string[]) => setFilters({...filters, categories: selected})

    return <div>
        <div>
            <h1 className="bold text-lg font-black">Filter data</h1>
        </div>
        <div className="filters pt-8">
            <h2 className="text-md">Filters</h2>
            <div className="pt-4">
                <label htmlFor={startDataId}>Start time</label>
                <Datetime initialValue={parseDate(filteredRows[0]?.createdOn)} onChange={handleStartDateChange}/>
            </div>
            <div className="pt-4">
                <label htmlFor={endDateId}>End time</label>
                <Datetime initialValue={parseDate(filteredRows[filteredRows.length - 1]?.createdOn)} onChange={handleEndDateChange}/>
            </div>
            <div className="pt-4 w-40">
                <label htmlFor={categoryId}>Categories</label>
                <MultiSelectDropdown
                    options={[...allCategories]}
                    onFilterChange={handleCategoriesChange}
                    placeholder={""}
                />
            </div>
        </div>
        <div className="pt-4">
            <CSVDataTable rows={filteredRows} />
        </div>
        <footer className="pt-8">
            <div className="inline-flex">
                <button
                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-l"
                    onClick={onPrev}>Previous</button>
                <button
                    className={ "bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-r"}
                    onClick={onNext}>Next</button>
            </div>
        </footer>
    </div>
}