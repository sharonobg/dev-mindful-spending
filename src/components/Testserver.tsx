"use client"

import {saveAction} from "@/libs/actions/save";
import { useActionState } from "react";

export default function Page(){
    //const [error, action, isPending ]= useActionState(saveAction, null);
    return(
    <form action={saveAction}>
        <input 
            name="address"
            placeholder="Address"
            className="border rounded-lg text-xl p-2 bg-blue-400 text-white"
        />
        <button
        type="submit"
        // disabled={isPending}
        className="bg-blue-500 text-white py-2 px-3 rounded-sm"
      >Submit</button>
      {/* {isPending && <p>Please wait...</p>}
      { error?? <p className="text-red-500">{error?error:
        "no"}</p>} */}
    </form>
    )
}