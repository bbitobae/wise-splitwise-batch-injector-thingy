import {CSVDataTable, CSVRow} from "./CSVDataTable";
import {useEffect, useId, useState} from "react";
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

    const applyFilters = () => {
        console.log(csvRows.length);
        console.log(filters.startDate.format(dateTimeFormat));
        const filteredRows = csvRows.filter(row => {
            if (!parseDate(row.createdOn).isBetween(filters.startDate, filters.endDate)) return false;
            if (!filters.categories.includes(row.category)) return false;
            return true;
        });
        console.log(filteredRows.length);
        onChange({"transactions": filteredRows});
        setFilteredRows(filteredRows);
    }

    const handleStartDateChange = (sd: string | Moment.Moment) => {
        // console.log(sd.format(dateTimeFormat));
        setFilters({...filters, startDate: parseDate(sd)})
        applyFilters();
    }
    const handleEndDateChange = (ed: string | Moment.Moment) => {
        setFilters({...filters, endDate: parseDate(ed)})
        applyFilters();
    }

    const handleCategoriesChange = (selected: string[]) => {
        setFilters({...filters, categories: selected})
        applyFilters();
    }

    return <div>
        <div>
            <h1 className="bold text-lg font-black">Filter data</h1>
        </div>
        <div className="filters pt-8">
            <h2 className="text-md">Filters</h2>
            <div className="pt-4">
                <label htmlFor={startDataId}>Start time</label>
                <Datetime id={startDataId} initialValue={parseDate(filteredRows[0]?.createdOn)} onChange={handleStartDateChange}/>
            </div>
            <div className="pt-4">
                <label htmlFor={endDateId}>End time</label>
                <Datetime initialValue={parseDate(filteredRows[filteredRows.length - 1]?.createdOn)} onChange={handleEndDateChange}/>
            </div>
            <div>
                <label htmlFor={categoryId}>Categories</label>
                <MultiSelectDropdown
                    options={[...allCategories]}
                    onFilterChange={handleCategoriesChange}
                    placeholder={""}
                />
            </div>

        </div>
        <div>
            <CSVDataTable rows={filteredRows} />
        </div>
        <footer>
            <button onClick={onPrev}>Previous</button>
            <button onClick={onNext}>Next</button>
        </footer>
    </div>
}