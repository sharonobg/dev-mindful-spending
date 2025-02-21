import {useFormStatus , useFormState}from 'react-dom';
import{deleteTargetprop}from '@/libs/actions/spendingplanactions';

const initialState = {
    message:null,
}

function DeleteButton() {

    const {pending} =useFormStatus()

    return(
        <button type="submit" aria-disabled={pending}>
            Delete
        </button>
    )
}
export function DeleteForm({targetid,targetprop}:{targetid:number;targetprop:string}){
  //  const [state,formAction] =useFormState(deleteTargetprop,initialState)
    return//(
        // <form action={formAction}>
        //     <input type="hidden" name="targetid" value={targetid} />
        //     <input type="hidden" name="targetprop" value={targetprop} />
        //     <DeleteButton />
        //      <p areia-live="polite" className="sr-only" role="status">
        //         {state?.message}
        //     </p> 
        // </form>
   // )
}
// function deleteTargetprop(state: any) {
//     throw new Error('Function not implemented.');
// }


