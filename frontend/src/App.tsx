import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import authService from "./services/AuthService";
import PrivateRoute from "./PrivateRoute";
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "./context/AuthenticationContext";
import AuthRoute from "./AuthRoute";

export default function App() {
  const { authenticatedUser, setAuthenticatedUser } = useContext(
    AuthenticationContext
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const authResponse = await authService.refresh();
        setAuthenticatedUser(authResponse.user);
      } catch (error) {
      } finally {
        setIsLoaded(true);
      }
    };
    if (!authenticatedUser) {
      authenticate();
    } else {
      setIsLoaded(true);
    }
    console.log(authenticatedUser);
  }, [authenticatedUser]);

  return isLoaded ? (
    <Router>
      <Switch>
        <PrivateRoute exact path="/" component={Home} />
        <AuthRoute exact path="/login" component={Login} />
      </Switch>
    </Router>
  ) : null;
}
