import { Redirect, Route } from "react-router";
import { useContext, useEffect } from "react";
import { AuthenticationContext } from "./context/AuthenticationContext";

export default function AuthRoute({ component: Component, ...rest }) {
  const { authenticatedUser } = useContext(AuthenticationContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        return authenticatedUser ? (
          <Redirect to="/" />
        ) : (
          <Component {...props} />
        );
      }}
    />
  );
}
