import type { ReactNode } from "react";
import styles from "./DataTable.module.css";

export interface Column<T> {

    key:keyof T | string;

    title:string;

    width?:string;

    render?:(row:T)=>ReactNode;

}

interface DataTableProps<T>{

    columns:Column<T>[];

    data:T[];

    onRowClick?:(row:T)=>void;

}

export default function DataTable<T extends { id:string | number }>({

    columns,

    data,

    onRowClick,

}:DataTableProps<T>){

    return(

        <div className={styles.tableCard}>

            <table className={styles.table}>

                <thead>

                    <tr>

                        {columns.map(column=>(

                            <th

                                key={String(column.key)}

                                style={{

                                    width:column.width

                                }}

                            >

                                {column.title}

                            </th>

                        ))}

                    </tr>

                </thead>

                <tbody>

                    {data.map(row=>(

                        <tr

                            key={row.id}

                            onClick={()=>onRowClick?.(row)}

                        >

                            {columns.map(column=>(

                                <td key={String(column.key)}>

                                    {column.render

                                        ? column.render(row)

                                        : String(row[column.key as keyof T] ?? "")}

                                </td>

                            ))}

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}