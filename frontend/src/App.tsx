import { Route, Routes } from "react-router-dom";

import { Feed } from "./features/Feed/Feed.tsx";
import { Login } from "./features/authentication/Login.tsx";
import { Register } from "./features/authentication/Register.tsx";
import { PrivateRoute } from "./components/PrivateRoute.tsx";
import Userprofile from "./features/Userprofile/Userprofile.tsx";

function App() {
  return (
    <div id="notebook-paper">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes protected with authentication */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Feed />} />
          <Route path="/profile/:username" element={<Userprofile />} />
          <Route path="*" element={<h1>404 does not exist</h1>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
