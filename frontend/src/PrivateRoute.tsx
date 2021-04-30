import { Redirect, Route } from "react-router";
import { useContext } from "react";
import { AuthenticationContext } from "./context/AuthenticationContext";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { authenticatedUser } = useContext(AuthenticationContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        return authenticatedUser ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
}
