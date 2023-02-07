import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import GeneralLayout from './layouts/GeneralLayout';
import Dashboard from './pages/Dashboard';
import Articulos from './components/Articulos';

const AuthenticatedApp = () => {
    // const {user, logout} = useAuth();
    return (
        <Routes>
          <Route exact path="/" element={<Navigate to="/dashboard" />} />
          <Route exact path="/signin" element={<Navigate to="/dashboard" />} />
          <Route exact path="/signup" element={<Navigate to="/dashboard" />} />
          <Route exact path="/dashboard" element={
              <GeneralLayout>
                <Dashboard/>
              </GeneralLayout>
            } 
            handle= {{
              crumb: () => 'Escritorio'
            }}
          />
          <Route exact path="/articulos" element={<Navigate to="/articulos" />} />
       

          <Route path="*" element={<h1>Not found</h1>} />
        </Routes>
    )
}

export default AuthenticatedApp;