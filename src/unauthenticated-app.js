import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';

const UnauthenticatedApp = () => {
    return (
      <Routes>
      <Route exact path="/" element={<Navigate to="/signin" />} />

      <Route path="/signin" exact element={<SignIn />} />

      <Route path="*" element={<Navigate to="/signin" />} />
      
    </Routes>
    )
}

export default UnauthenticatedApp;