import { Outlet } from "react-router-dom";
import Navbar from "@components/layout/Navbar.tsx";
import Alert from "@components/ui/Alert.tsx";
import { useAlertContext } from "@providers/AlertProvider.tsx";

function App() {
  const { alertRef } = useAlertContext();

  return (
    <div className="App w-screen h-screen overflow-hidden bg-slate-900 flex items-center justify-center text-white pl-[60px]">
      <Navbar />
      <Outlet />
      <Alert ref={alertRef} />
    </div>
  );
}

export default App;
