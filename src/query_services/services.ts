import {NextRequest,NextResponse} from 'next/server';
import axios from 'axios';

//CATEGORY QUERRIES
 export async function getCategories(){
    return (await axios.get("http://localhost:3000/api/category")).data;
 }
 export async function getCategory(id:any){
  console.log('author get api id',id)
   return (await axios.get(`http://localhost:3000/api/category/${id}`)).data;
}

//TRANSACTIONS
//new transactions 3/10
export const getTransactionsIds = async () => {
  return (await axios.get<TransactionsAggregate[]>(`http://localhost:3000/api/transaction`)).data.map((transaction) => transaction._id);
}
export const getTransactions = async () => {
  return (await axios.get<TransactionsAggregate[]>("http://localhost:3000/api/transaction")).data
}
export const getTransactionsAggrMonth = async () => {
  return (await axios.get<TransactionsAggregate[]>("http://localhost:3000/api/transactionsagg")).data
}
export const  getTransactionsById = async (id:string) => {
  return (await axios.get<TransactionsAggregate>(`http://localhost:3000/api/transaction/${id}`)).data
}
export const newUpdateTransaction = async (data:TransactionType)=> {
  await axios.put(`http://localhost:3000/api/transaction/${data._id}`,data)}
//end new transactions
export async function getTransactions2(){
 
   return (await axios.get("http://localhost:3000/api/transaction")).data
}
export async function getTransactionById(id:any){
  console.log('author api _id',id)
  // console.log('api data',data)
  return (await axios.get(`http://localhost:3000/api/transaction/${id}`)).data
}
export async function createTransaction(data:TransactionType){
  return (await axios.post("http://localhost:3000/api/transaction",data)).data
}
export async function editTransaction(data:TransactionType){
  console.log('author PUT  api _id',data._id)
  console.log('PUT api passedid',{data})
  return (await axios.put(`http://localhost:3000/api/transaction/${data._id}`),data)
}
export async function deleteTransaction(id:any){
  console.log('delete Transaction  api _id',id)
  // console.log('delete api passed data',{data})
  return (await axios.delete(`http://localhost:3000/api/transaction?id=${id}`)).data
}
export async function deleteTransactions(id:any){
  console.log('delete Transactions  api _id',id)
  // console.log('delete api passed data',{data})
  if (confirm("delete this transaction?")) {
  return (await axios.delete(`http://localhost:3000/api/transaction?id=${id}`)).data
}}
//SPENDINGPLANS
// export async function getSpendingplansSimple(){
//   return (await axios.get<SpendingplanType[]>("http://localhost:3000/api/spendingplan")).data
// }
export async function getSpendingplans(){
   return (await axios.get<SpendingplanTypeAll[]>("http://localhost:3000/api/spendingplan")).data
}
export async function getSpendingplansaAggr(){
  return (await axios.get<SpendingplanTypeAll[]>("http://localhost:3000/api/spendingplanagg")).data
}
export async function getSpendingplansById(id:string){
  console.log('spendind plan api _id',id)
  return (await axios.get<SpendingplanTypeAll>(`http://localhost:3000/api/spendingplanagg/${id}`)).data
}
export async function getSpendingplanById(id:string){
  console.log('spendind plan api _id',id)
  return (await axios.get<SpendingplanTypeAll>(`http://localhost:3000/api/spendingplan/${id}`)).data
}
export async function getSpendingplanByIdsim(id:string){
  console.log('spendind plan api _id',id)
  return (await axios.get<SpendingplanTypeAll>(`http://localhost:3000/api/spendingplanagg/${id}`)).data
}
export async function getSpendingplanByIdAggr(id:string){
  console.log('spendind plan api _id',id)
  // console.log('api data',data)
  return (await axios.get<SpendingplanTypeAll>(`http://localhost:3000/api/spendingplan/${id}`)).data
}
export async function createSpendingplan(newSpendingPlan:any){
    return (await axios.post("http://localhost:3000/api/spendingplan",newSpendingPlan)).data
 }
 export async function patchSpendingplan(id:any){
   return (await axios.patch<SpendingplanType>(`http://localhost:3000/api/spendingplan/${id}`)).data
 }
 export const updateSpendingplan = async (data:SpendingplanType)=> {
  await axios.put(`http://localhost:3000/api/spendingplan/${data._id}`,data)}

 export async function deleteSpendingplan(id:any){
  if (confirm("delete this Spending Plan?")) {
    console.log('id to be deleted', id)
    return (await axios.delete(`http://localhost:3000/api/spendingplan/${id}`)).data}
 }
//INCOMES
//INCOMEPLANS