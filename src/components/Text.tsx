

export const Text = () => {
   type Num = number
   function hi(a: Num, b: Num): number {
      return a + b
   }
   return (
      <div>
         you can use typescript
         <div>{hi(5, 5)}</div>
      </div>
   )
}

export default Text