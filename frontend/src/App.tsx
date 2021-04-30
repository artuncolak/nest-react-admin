import { BrowserRouter as Router, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import authService from "./services/AuthService";
import PrivateRoute from "./PrivateRoute";
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "./context/AuthenticationContext";
import AuthRoute from "./AuthRoute";
import Users from "./pages/Users";

export default function App() {
  const { authenticatedUser, setAuthenticatedUser } = useContext(
    AuthenticationContext
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const authenticate = async () => {
    try {
      const authResponse = await authService.refresh();
      setAuthenticatedUser(authResponse.user);
    } catch (error) {
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    if (!authenticatedUser) {
      authenticate();
    } else {
      setIsLoaded(true);
    }
  }, []);

  return isLoaded ? (
    <Router>
      <Switch>
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute exact path="/users" component={Users} />

        <AuthRoute exact path="/login" component={Login} />
      </Switch>
    </Router>
  ) : null;
}
