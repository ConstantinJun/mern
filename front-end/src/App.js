import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UsersPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

const App = () => {
  const { login, logout, token, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} exact></Route>
        <Route path="/:userId/places" element={<UserPlaces />}></Route>
        <Route path="/places/new" element={<NewPlace />} exact></Route>
        <Route path="/places/:placeId" element={<UpdatePlace />}></Route>
        <Route path="/auth" element={<Navigate to="/" />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} exact></Route>
        <Route path="/:userId/places" element={<UserPlaces />}></Route>
        <Route path="/auth" element={<Auth />} />
        <Route element={<Navigate to="/auth" />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login,
        logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
