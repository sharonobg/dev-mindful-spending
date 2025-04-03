"use client"
import {useRouter} from 'next/navigation';
import {useSpendingplans} from '@/query_services/queries';
import {useDeleteSpendingplan} from '@/query_services/mutations';
import { AiFillDelete } from 'react-icons/ai'
import { BsFillPencilFill } from 'react-icons/bs'
import Link from 'next/link';

const SpendingplanList = () => {
    const router = useRouter();
    const deleteSpendingplanMutation = useDeleteSpendingplan()
    const {isPending,isError,data:spendingplans,error}= useSpendingplans();
    if(isPending) return <span>Loading Categories...</span>
    if(isError) return `Error: ${error.message}`
    const handleDelete = (id: any) => deleteSpendingplanMutation.mutate(id)
    
    return(
    <>
            {/* Spendingplans: {JSON.stringify(spendingplans,null,2)} */}
            <h2>My Spending Plans</h2>
            
            {spendingplans?.length > -1 ? (spendingplans.slice(1).map((thisspendingplan:any) =>
            
            <div key={thisspendingplan._id} className="flex flex-col gap-x-0.5 my-5">
                <div>ID:{thisspendingplan._id}</div>  
                <div>Date:{thisspendingplan.planmonth}</div>   
                <div>Date:{thisspendingplan.planyear}</div>  
                <h2>My categories:</h2>
                {thisspendingplan.mycategories?.length > -1 ? (thisspendingplan.mycategories.map((planmycategory:any,index:number) =>
                <div key={index} className="flex flex-col border border-b-2 placeholder:">
                    <div>title:{planmycategory.title}</div>
                    <div>Notes:{planmycategory.categorynotes}</div>
                    <div>Explain:{planmycategory.explain}</div>
                    <div>Planamount:{planmycategory.planamount.$numberDecimal}</div>
                </div>)):"no mycategories found"}
              
            <hr />
    <button onClick={() => router.push(`/author-single-category/${thisspendingplan._id}`)}>Edit<BsFillPencilFill /></button>
    <button onClick={handleDelete}>Delete<AiFillDelete /></button>
            </div>

             )):"no spendingplans found"}
        
    </>
    )
}
export default SpendingplanList
