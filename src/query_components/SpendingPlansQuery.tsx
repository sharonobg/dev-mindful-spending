"use client"
import {useQuery,useIsFetching} from "@tanstack/react-query";
import {useSpendingplansPromise} from './RQSpendingplansProvider';

export default function SpendingPlansQuery() {
    const spendingplansPromise = useSpendingplansPromise();
    //console.log(categoriesPromise)
    //const foods= use(foodPromise);
    //const data = ["foods"];
    const { data:spendingplans,isLoading } = useQuery({
        queryKey:["spendingplans"], 
        queryFn: () => spendingplansPromise
        // ,{
        //     initialData: use(foodPromise),
        //     refetchOnMount: false,
        //     refetchOnWindowFocus: false,
        //     refetchOnReconnect: false,
        // }
        
    });
    if (isLoading) return <div>Loading...</div>
return(
    <>
    <h2>SpendingPlans Query</h2>
    {/* <pre>JSON.stringify(categories,null,2)</pre>
    <pre>{JSON.stringify(spendingplans,null,2)}</pre> */}
    <div>
        <h1>Hello from Spendingplans Client Query</h1>
        <div>Spending Plans: {spendingplans?.map((spendingplan:any) => 
        <div key={spendingplan._id}>
            <div>Author:{spendingplan.authorId}</div>
            <div>Date:{spendingplan.planmonthyear}</div>
            {spendingplan.mycategories.map((mycategory:any)=>
            
                <div key={spendingplan._id}>
                    <ul key={mycategory.mycategoryId}>
                        
                        <li key={mycategory.mycategoryId}>
                        {/* {categories.map((categoryName) =>
                        <span> */}
                            {mycategory.mycategoryId}
                           
                        {/* </span>
                        
                        } */}
                        </li>
                        

                        <li>
                        {mycategory.categorynotes}
                        </li>
                        
                        <li>
                        {mycategory.isChecked}
                        </li>
                        <li>
                        {mycategory.planamount.$numberDecimal}
                        </li>
                    </ul>
                </div>
                )}
            </div>
        
        )}</div>
       
    </div>
    </>)
}