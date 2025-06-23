"use client"
import React,{useState,useMemo,useReducer} from 'react';
const reducer = (state:any, action:any) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};
const Myfunction = () => {
// export function Myfunction(props:any) {
  const initialState = { count: 0 };
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className='App'>
      State: {state.count}
      <div>

        <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment</button>
        <button onClick={() => dispatch({ type: 'DECREMENT' })}>Decrement</button>
        <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      </div>
    </div>
  );
}
export default Myfunction

// const Check = () => {
//     const [state, setState] = useState<number>(0);
//     const [theme, setTheme] = useState<boolean>(true);

//     const slowFunction = (num:number

//     ) => {
//         for (var i = 0; i < 1000000000; i++) { }
//         return num * 2;
//     };

//     // const doubleState = slowFunction(state);
//  const doubleState = useMemo(() => {
//         return slowFunction(state);
//     }, [state]);

//     return (
//         <div className="simple-div">
//             <center>
//                 <div>
//                     <input onChange={(e) =>
//                         setState(parseInt(e.target.value))} />
//                 </div>
//                 <div style={{
//                     backgroundColor: theme ? "yellow" : "white"
//                 }}>
//                     <b>Value with memoizing: {doubleState}</b>
//                 </div>
//                 <button onClick={() =>
//                     setTheme((prev) => !prev)}>
//                     Change Theme
//                 </button>
//             </center>
//         </div>
//     );
// };

// export default Check