import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Text from "./Text";

export const App = () => {
   const [count, setCount] = useState(0)
   return (
      <div>
         <Text />
         <div className="react">hi im react</div>
         <div style={{ fontSize: '40px', color: 'red' }} className="count">{count}</div>
         <button style={{ backgroundColor: 'red', color: 'white', padding: '10px', fontSize: '40px' }} onClick={() => { setCount(count + 1) }}>+1</button>
         <img style={{ color: 'red' }} src="img/Vectorcontact__1.png" alt="" />
         <img src="img/arrow.svg" alt="" />
         <img style={{ width: '200px', height: '200px' }} src="img/cover.jpg" alt="" />
      </div>
   )
}

export default App