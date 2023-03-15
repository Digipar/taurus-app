import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Clientes from './components/Clientes';
import GeneralLayout from './layouts/GeneralLayout';
import Articulos from './components/Articulos';
import Tenants from './components/Tenants';
import Movimientos from './components/Movimientos';
import MovimientoRegistrar from './pages/MovimientoRegistrar';

const AuthenticatedApp = () => {
  // const {user, logout} = useAuth();
  return (
    <Routes>
      <Route exact path="/" element={<Navigate to="/movimientos" />} />
      <Route exact path="/signin" element={<Navigate to="/movimientos" />} />
      <Route exact path="/signup" element={<Navigate to="/movimientos" />} />
      <Route exact path="/movimientos" element={
        <GeneralLayout>
          <Movimientos />
        </GeneralLayout>
      }
        handle={{
          crumb: () => 'Escritorio'
        }}
      />
      <Route exact path="/articulos" element={
        <GeneralLayout>
          <Articulos />
        </GeneralLayout>}
        handle={{
          crumb: () => 'Artículos'
        }} />
      <Route exact path="/clientes" element={
        <GeneralLayout>
          <Clientes />
        </GeneralLayout>
      }
        handle={{
          crumb: () => 'Clientes'
        }}
      />
    
      <Route exact path="/movimiento-registrar" element={
        <GeneralLayout>
          <MovimientoRegistrar />
        </GeneralLayout>
      }
        handle={{
          crumb: () => 'Registrar nuevo movimiento'
        }}
      />
      <Route exact path="/movimiento-editar/:id" element={
        <GeneralLayout>
          <MovimientoRegistrar />
        </GeneralLayout>
      }
        handle={{
          crumb: () => 'Editar movimiento'
        }}
      />
      <Route exact path="/tenant" element={
        <GeneralLayout>
          <Tenants/>
        </GeneralLayout>
      }
        handle={{
          crumb: () => 'Tenants'
        }}
      />
      <Route path="*" element={<h1>Not found</h1>}/>
    </Routes>
  )
}

export default AuthenticatedApp;