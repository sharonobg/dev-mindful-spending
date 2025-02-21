'use server'

import {revalidatePath} from 'next/cache';
import z from 'zod';
export async function deleteTargetprop(prevState:any,formData:FormData) {
    //zod schema

    const schema = z.object({
        targetid: z.string().nonempty(),//these are simplefied-ck for other parameters like english chars, numer chars,etc
        targetprop:z.string().nonempty(),
    })
    const data = schema.parse({
        targetid: formData.get('targetid'),
        targetprop: formData.get('targetprop'),
    })
    try{
        //mongo delete the target prop(s)
        revalidatePath('/')
        return{message:`Deleted it $(data.targetprop)`}
    }
    catch(error){
        return {message: 'Failed to delete'}
    }
}