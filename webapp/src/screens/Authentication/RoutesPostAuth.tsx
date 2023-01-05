import { Routes, Route } from "react-router-dom";

import Home from "components/Home";
import Admin from "components/Admin";
import Grid from "components/Grid";
import Detail from "components/Detail";
import Notes from "components/Notes";

function RoutesPostAuth(): JSX.Element {
  return (
    <>
      <div className="block clear-both" style={{ paddingBottom: "52px" }} />

      <Detail />
      <Notes />

      <Routes>
        <Route path="/browse" element={<Grid />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default RoutesPostAuth;
