import { Injectable } from "@angular/core";
import writeXlsxFile, { Cell, ColumnSchema, Row, Schema, SheetData, ValueType, WithSchemaOptions } from 'write-excel-file';

type cellSchema<T> = {
    column: string,
    value:  (data: T) => any,
    type?: StringConstructor | NumberConstructor | BooleanConstructor | DateConstructor | "Format",
    format?: string,
}

type cell<T> = cellSchema<T> & {id: string};

type data = { [id: string]: unknown };

@Injectable({
    providedIn: "root",
})
export class ExcelService {
    constructor() {}

    createExcel = async <T>(data: SheetData, def: cell<T>[]) => {
        const schema2 = def.map(d => (
            {
                column: d.column,
                type: d.type ?? String,
                format: d.format ?? "@",
                value: (item: T) => item[d.id as keyof T]
            }
        ))
writeXlsxFile.
interface IStudent {name: string}
            //const v: ValueType = student => student.name
            const c: Cell = {}
        const schema3: Schema<IStudent> = [
            {
                column: 'Name',
                type: String,
                value: student =>student.name
            },
        ]
        // const schema = [
        //     {
        //         column: "Name",
        //         type: String,
        //         value: ()(student: T) => student["name" as keyof T],
        //     },
        //     {
        //         column: "Date of Birth",
        //         type: Date,
        //         format: "mm/dd/yyyy",
        //         value: (student: T) => student["name" as keyof T],
        //     },
        //     {
        //         column: "Cost",
        //         type: Number,
        //         format: "#,##0.00",
        //         value: (student: T) => student["name" as keyof T],
        //     },
        //     {
        //         column: "Paid",
        //         type: Boolean,
        //         value: (student: T) => student["name" as keyof T],
        //     },
        // ];
        //const header = def.map(d => ({value: d.column, fontWeight: 'bold'}));

        await writeXlsxFile(data, {
            schema3,
            fileName: 'users.xlsx'
        })

    }
}
