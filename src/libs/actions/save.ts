'use server'

import { revalidatePath } from "next/cache";

//export async function createHoppy(previousState, formData: FormData) {
 
export async function saveAction(formData: FormData) {
 try{const content = formData.get("content") as string;
    console.log('hey')
 
    
}catch (e) {
    console.log("be attention, An error occurred.") ;
  }
// remember
revalidatePath("/");
}