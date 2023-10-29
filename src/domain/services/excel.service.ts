import { Injectable } from "@angular/core";
import writeXlsxFile, { Schema, SheetData, ValueType } from 'write-excel-file';

export type cellSchema<T> = {
    key: string,
    column: string,
    value:  (data: T) => ValueType,
    type?: ValueType,
    format?: string,
}

@Injectable({
    providedIn: "root",
})
export class ExcelService {
    constructor() {}

    createExcel = async <T>(data: SheetData, def: cellSchema<T>[], file: string) => {
        const schema: Schema<unknown> = []
        def.forEach(v => schema.push({column: v.column, value: v.value}))

        await writeXlsxFile(data, {
            schema: schema,
            fileName: file
        })

    }
}
