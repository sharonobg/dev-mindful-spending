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
   title?:string
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

interface CategoriesType {categories:string[];}
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
      otherincome =  "other"
   }
  type PlannedIncomeType = {
    incomeType:IncomeType;
    incomeplandescr:string;
    incomeplanamount:string;
    incdateexpected:Date;
  }
}