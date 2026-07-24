import type { DataTableProps } from "./types";

import styles from "./DataTable.module.css";

export default function DataTable<T extends object>({

    columns,

    data,

    loading,

    emptyMessage="No records found.",

    onRowClick,

}:DataTableProps<T>){

    if(loading){

        return(

            <div className={styles.loading}>

                Loading...

            </div>

        );

    }

    if(data.length===0){

        return(

            <div className={styles.empty}>

                {emptyMessage}

            </div>

        );

    }

    return(

        <div className={styles.wrapper}>

            <table className={styles.table}>

                <thead>

                    <tr>

                        {

                            columns.map(column=>(

                                <th

                                    key={String(column.key)}

                                    style={{

                                        width:column.width,

                                        textAlign:column.align,

                                    }}

                                >

                                    {column.title}

                                </th>

                            ))

                        }

                    </tr>

                </thead>

                <tbody>

                    {

                        data.map((row,index)=>(

                            <tr

                                key={index}

                                onClick={()=>onRowClick?.(row)}

                            >

                                {

                                    columns.map(column=>(

                                        <td

                                            key={String(column.key)}

                                            style={{

                                                textAlign:column.align,

                                            }}

                                        >

                                            {

                                                column.render

                                                ?

                                                column.render(row)

                                                :

                                                String(

                                                    row[
                                                        column.key as keyof T
                                                    ] ?? ""

                                                )

                                            }

                                        </td>

                                    ))

                                }

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}