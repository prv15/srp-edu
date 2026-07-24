import type { ReactNode } from "react";

export interface DataColumn<T>{

    key:keyof T | string;

    title:string;

    width?:string;

    align?:"left"|"center"|"right";

    sortable?:boolean;

    render?:(row:T)=>ReactNode;

}

export interface DataTableProps<T>{

    columns:DataColumn<T>[];

    data:T[];

    loading?:boolean;

    emptyMessage?:string;

    onRowClick?:(row:T)=>void;

}