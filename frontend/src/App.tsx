import { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";

import { AuthenticationContext } from "./context/AuthenticationContext";
import Contents from "./pages/Contents";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Users from "./pages/Users";
import { AuthRoute, PrivateRoute } from "./Route";
import authService from "./services/AuthService";

export default function App() {
  const { authenticatedUser, setAuthenticatedUser } = useContext(
    AuthenticationContext
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const authenticate = async () => {
    if (!authenticatedUser) {
      try {
        const authResponse = await authService.refresh();
        setAuthenticatedUser(authResponse.user);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoaded(true);
      }
    } else {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  return isLoaded ? (
    <Router>
      <Switch>
        <PrivateRoute exact path="/" component={Dashboard} />
        <PrivateRoute exact path="/users" component={Users} roles={["admin"]} />
        <PrivateRoute exact path="/courses" component={Courses} />
        <PrivateRoute exact path="/courses/:id" component={Contents} />

        <AuthRoute exact path="/login" component={Login} />
      </Switch>
    </Router>
  ) : null;
}
