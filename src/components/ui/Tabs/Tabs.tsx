import styles from "./Tabs.module.css";

export interface TabItem{

    id:string;

    label:string;

}

interface TabsProps{

    tabs:TabItem[];

    activeTab:string;

    onChange:(tabId:string)=>void;

}

export default function Tabs({

    tabs,

    activeTab,

    onChange,

}:TabsProps){

    return(

        <div className={styles.wrapper}>

            {

                tabs.map(tab=>(

                    <button

                        key={tab.id}

                        type="button"

                        className={`${styles.tab}

                        ${activeTab===tab.id

                            ?styles.active

                            :""

                        }`}

                        onClick={()=>

                            onChange(tab.id)

                        }

                    >

                        {tab.label}

                    </button>

                ))

            }

        </div>

    );

}