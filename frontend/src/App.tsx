import { BrowserRouter as Router, Switch } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import authService from "./services/AuthService";
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "./context/AuthenticationContext";
import Users from "./pages/Users";
import Courses from "./pages/Courses";
import Contents from "./pages/Contents";
import { AuthRoute, PrivateRoute } from "./Route";

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
