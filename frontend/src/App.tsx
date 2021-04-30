import { BrowserRouter as Router, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import authService from "./services/AuthService";
import PrivateRoute from "./PrivateRoute";
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "./context/AuthenticationContext";
import AuthRoute from "./AuthRoute";
import Users from "./pages/Users";
import Courses from "./pages/Courses";
import Contents from "./pages/Contents";

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
        <PrivateRoute exact path="/" component={Home} />

        {authenticatedUser && authenticatedUser.role === "admin" ? (
          <PrivateRoute exact path="/users" component={Users} />
        ) : null}

        <PrivateRoute exact path="/courses" component={Courses} />
        <PrivateRoute exact path="/courses/:id" component={Contents} />

        <AuthRoute exact path="/login" component={Login} />
      </Switch>
    </Router>
  ) : null;
}
