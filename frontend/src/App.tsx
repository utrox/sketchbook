import { Route, Routes } from "react-router-dom";

import { Feed } from "./features/Feed/Feed.tsx";
import { Login } from "./features/authentication/Login.tsx";
import { Register } from "./features/authentication/Register.tsx";

function App() {
  return (
    <div id="notebook-paper">
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<h1>Logout</h1>} />
        <Route path="/profile/:username" element={<h1>Userprofile</h1>} />
        <Route path="*" element={<h1>404 does not exist</h1>} />
      </Routes>
    </div>
  );
}

export default App;
