// types/global.d.ts

export {}
// declare module globalThis {
//   var signin: () => string[];
// }

declare global {
var mongoose: any; // This must be a `var` and not a `let / const`
interface Idtype {
  id: String,
  params:any
}
interface UserDb {
  _id:string;
  name:string|null;
  email:string;
  image:string | null;
  accessToken?:string;
  resetToken?:string;
  tokenExpiry?:Date;
}
type SearchParamsType={
  searchParams?:string | null | undefined;
  fyear:string,
  fmonth:string,
  fcategory:string 
}
interface UserInfo {_id:string}
  type User = {
    _id:string;
    name?: string | undefined;
    username?: string | undefined;
    email?: string | undefined;
    image?:string  |undefined;
    
} | undefined
type UserProps={user:User,}
type Props = {user:User,pagename:string}
type PageProps = {
  //user:User,
  pagename: string,
}
type DateProps ={
  fyear:string,
  fmonth:string,
  fcategory:string 
}
interface UserData {
    username: string;
    id: string;
    email:string;
  }
interface Category {
   
   _id:string;
   title:string
  }
interface CategoriesArr {
  [categories?: CategoryList[]]
  //length:number;]
  
}

interface CategoryList {
  [{
    _id:string,
    title:string
  }]
  length:number;
}
type EachCategory = { 
  [key: string]: categoryList,
  [value: string]: categoryList }

interface myCategoriesData {
  mycategories:(number | string | object)[];
  planamount:number,
  mycategoryId:string,
}
interface MyCategory{
  mycategoryId:string,
  isChecked:boolean,
  planamount:decimal,
  categorynotes:string,
  explain:explain,
}

type AccountType = "debit" | "cash" | "bank_account" | "other";
enum Accounttype{
    debit = "debit",
    cash =  "cash",
    bankaccount= "bank_account",
    other = "other",
 }
interface Transaction{
  descr:string,
  amount:string,
  categoryId:string,
  acctype:Accounttype.debit
}
 type TransactionType={
    _id:string,
    //title?:string,
    transdate:Date,
    categoryId:string,
    descr:string,
    acctype:AccountType,
    //amount:string,
    amount:string
}
//after aggregate - categories are in output - so title is available
type TransactionsAggregate={
    _id:string,
    transdate:Date,
    categoryId:string,
    descr:string,
    acctype:AccountType,
    title:string,
    amount:decimal,
    month:number,
    day:number,
    year:number
}
type MyCategoriesType={
  mycategoryId:string,
  isChecked:boolean,
  explain:string,
  categorynotes:string,
  planamount:decimal,
}
type SpendingplanType={
  //authorId:'string',
  //_id:string,
  _id:string,
  id?:string,
  planmonthyear:Date,
  mycategories:MyCategoriesType[],
}
interface SpendingplanFormData{
  planmonthyear:Date,
  mycategories:MyCategoriesType[
    {
      mycategoryId:string,
      isChecked:boolean,
      explain:string,
      categorynotes:string,
      planamount:decimal,
    }
  ],
}
type MyCategoriesTypeAll={
  mycategoryId:string,
  isChecked:boolean,
  explain:string,
  categorynotes:string,
  planamount:decimal,
  title:string
}
type SpendingplanTypeAll={
  _id:any,
  id?:string,
  planmonthyear:Date,
  planmonth:number,
  planyear:number,
  mycategories:[MyCategoriesTypeAll],
}
// interface CategoriesType {categories:string[];}
interface SelectedData {
    amount: string,
    transactionuser:string,
    category_id:string,
  }
interface transactionData {
    description: string;
    //amount: string,
    //transactionuser:string,
    //category_id:string,
  }
  enum IncomeType{
    choose="choose",
      wages = "wages",
      freelance = "free-lance",
      tips = "tips",
      interest = "interest",
      childsupport =  "child-support",
      retirementincome ="retirement-income",
      savings ="from-savings",
      businessincome ="business-income",
      otherincome =  "other"
   }
  type PlannedIncomeType = {
    incomeType:IncomeType;
    incomeplandescr:string;
    incomeplanamount:string;
    incdateexpected:Date;
  }
}