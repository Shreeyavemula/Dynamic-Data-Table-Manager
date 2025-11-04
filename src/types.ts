export type Row = {
id: string;
name: string;
email: string;
age: number | null;
role: string;
[key: string]: any;
};


export type ColumnDef = {
key: string;
label: string;
visible: boolean;
};
