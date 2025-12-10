import {useDropzone} from "react-dropzone";
import React, {useMemo, useState} from "react";
import Papa from 'papaparse';
import {CSVDataTable, CSVRow} from "./CSVDataTable";

export interface UploadCSVProps {
    onNext: () => void;
    onPrev: () => void;
    onChange: (data: { [key: string]: any}) => void;
}

export enum SplitwiseCategories {
    utilities = 1,
    uncategorized = 2,
    entertainment = 19,
    foodAndDrink = 25,
    home = 27,
    transportation = 31,
    life = 40
}



export const UploadCSVFlow: React.FC<UploadCSVProps> = ({onNext, onPrev, onChange}) => {

    const determineCategory = (category: string) => {
        switch (category) {
            case 'Shopping':
                return SplitwiseCategories.home
            case 'Groceries':
                return SplitwiseCategories.foodAndDrink
            case 'Eating out':
                return SplitwiseCategories.foodAndDrink
            case 'Transport':
                return SplitwiseCategories.transportation
            case 'Trips':
                return SplitwiseCategories.entertainment
            default:
                return SplitwiseCategories.uncategorized
        }
    }

    const {acceptedFiles, getRootProps, getInputProps} = useDropzone()

    const parseFiles = acceptedFiles.map(async file => {
        const f = await file.text();
        const parsedCSV = Papa.parse(f,
            {
                delimiter: ',',
                header: true
            });
        if (parsedCSV.errors) {
            console.debug(parsedCSV.errors.map(e => e.message));
        }
        const rows: CSVRow[] = parsedCSV.data
            .filter(data => {
                const d = data as { [key: string]: any; };
                const direction = d['Direction'];
                return direction ? direction === 'OUT' : false;
            })
            .map(data => {
                const d = data as { [key: string]: any; };
                return {
                    id: d['ID'],
                    amount: d['Target amount (after fees)'],
                    currency: d['Target currency'],
                    name: d['Target name'],
                    spender: d['Created by'],
                    category: d['Category'],
                    createdOn: Date.parse(d['Created on'])
                };
            })
            .sort((a, b) => {
                if (a.createdOn > b.createdOn) return 1;
                if (a.createdOn < b.createdOn) return -1;
                return 0
            });
        if (rows.length > 0) {
            onChange({"csvRows": rows});
            setNextDisabled(false);
            return <div className="pt-8">
                <div className="p-4"><p>Previewing first 10 rows</p></div>
                <CSVDataTable rows={rows.slice(0, 10)}></CSVDataTable>
            </div>;
        } else {
            return <div/>;
        }
    })

    const [preview, setPreview] = useState(<div></div>)
    const [nextDisabled, setNextDisabled] = useState<boolean>(true);
    parseFiles.shift()?.then(result => {
        return setPreview(result);
    })

    return <div>
        <div>
            <h1 className="bold text-lg font-black">CSV file</h1>
            <p>Upload your transactions CSV file. </p>
            <p>This can be found at...</p>
        </div>
       <div className="pt-8">
           <section className="container">
               <div {...getRootProps({className: "dropzone"})}>
                   <input {...getInputProps()} />
                   <p>Drag 'n' drop some files here, or click to select files</p>
               </div>
               {preview ?? <div className="pt-8">
                   <div>
                       <p>previewing the first 10 rows</p>
                   </div>
                   <div>
                       {preview}
                   </div>
               </div>}
           </section>
       </div>
        <footer className="pt-8">
            <div className="inline-flex">
                <button
                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-l"
                    onClick={onPrev}>Previous</button>
                <button
                    className={ nextDisabled ? "bg-gray-500 text-grey py-2 px-4 rounded-r" : "bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-r"}
                    onClick={onNext} disabled={nextDisabled}>Next</button>
            </div>
        </footer>
    </div>
}