import React from "react";import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import {useAuth} from "./context/auth-context";
import {FullPageSpinner} from "./components/lib";

const AuthenticatedApp = React.lazy(() => import(/* webpackPrefetch: true */'./authenticated-app'))
const UnauthenticatedApp = React.lazy(() => import('./unauthenticated-app'))

function App() {
  const {user} = useAuth()
  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  )
}

export default App;
