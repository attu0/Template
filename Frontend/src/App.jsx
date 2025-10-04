import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="bg-blue-500 text-black p-4 rounded-lg">
        <h1 className="text-2xl font-bold">Hello World!</h1>
      </div>
    </>
  );
}

export default App;
