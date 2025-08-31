import React  from "react";

import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import Project from "./Project";
import AddProblem from "./AddProblem";
import ViewProblem from "./ViewProblem";
class AllRoutes extends React.Component {
  render() {
    return (
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Project />} />
            <Route path="/addproblem" element={<AddProblem />} />
            <Route path="/viewproblem" element={<ViewProblem />} />
          </Routes>
        </div>
    );
  }
}

export default AllRoutes;
