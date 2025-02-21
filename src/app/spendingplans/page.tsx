"use client"
import {useQuery,useMutation,useQueryClient} from "@tanstack/react-query";


// const SpendingPlansRQ = () => {
//   const { data:spendingplans, isLoading } = useQuery<SpendingplanType[]>({
//   queryKey:["spendingplans"], 
//   queryFn: () => fetch('http://localhost:3000/api/spendingplan')
//   .then((res:Response) => res.json())
// });
// if (isLoading) return <div>Loading...</div>
const SpendingPlans = () => {
  // const mutation = useMutation({
  //   mutationFn: (newSpendingPlan:Promise<SpendingplanType>) => {
  //     // return Spendingplan.create("http://api/spendingplan"), newSpendingPlan);
  //   }
  

  return <div>SpendingPlans</div>;
}
export default SpendingPlans