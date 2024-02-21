import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "components/Navbar";
import Setup from "screens/Setup";
import GoogleAuth from "screens/Authentication/GoogleAuth";
import InitAuthentication from "components/Auth/InitAuthentication";
import InitGlobalSettings from "components/Settings/InitGlobalSettings";
import RoutesPostAuth from "screens/Authentication/RoutesPostAuth";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <InitAuthentication />
      <InitGlobalSettings />
      <Navbar />

      <Routes>
        <Route path="/setup" element={<Setup />} />
        <Route path="/auth" element={<GoogleAuth />} />
        <Route path="*" element={<RoutesPostAuth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
