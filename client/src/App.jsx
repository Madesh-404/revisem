import { useEffect, useState } from "react";
import { checkServerHealth } from "./services/api";

const App = () => {
  const [serverStatus, setServerStatus] = useState("Checking...");

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await checkServerHealth();
        setServerStatus("Connected");
      } catch {
        setServerStatus("Disconnected");
      }
    };

    checkHealth();
  }, []);

  return (
    <div>
      <h1>REVISEM</h1>
      <p>Smart Revision Planner</p>

      <p>Backend: {serverStatus}</p>
    </div>
  );
}

export default App;
