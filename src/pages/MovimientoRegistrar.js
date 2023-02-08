import React, { useCallback } from 'react';
import { API } from '../config';
import useFetch from '../hooks/use-fetch';
import MovimientoForm from '../components/MovimientoForm';
import { useAuth } from "../context/auth-context";
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import { Card, CardContent } from '@mui/material';



const MovimientoRegistrar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { fetchData: fetchClientes, error: errorClientes, loading: loadingClientes } = useFetch();
    const { fetchData: fetchRegistrarMovimiento, error: errorRegistrarMovimiento, loading: loadingMovimiento } = useFetch()
    const [clientes, setClientes] = React.useState([]);
    const [alert, setAlert] = React.useState(false);
    const [alertOptions, setAlertOptions] = React.useState({});


    // const getClientes = useCallback (async () => {

    //     const reqOptions = {
    //         method: 'GET',
    //         headers: { "Content-Type": "application/json" }
    //     };
    //     const respCliente = await fetchClientes(`${API}/clientes`, reqOptions)

    //     if (respCliente.error) {
    //         setAlert(true);
    //         setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: respCliente.message })
    //         return;
    //     }

    //     if (errorClientes) {
    //         setAlert(true);
    //         setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorClientes })
    //         return;
    //     } 

    //     console.log('respCliente => ', respCliente);
    //     setClientes(respCliente)
       
    // },[errorClientes, fetchClientes]);

    
    const registrarMovimiento = async (values) => {

        const movimientoDataCreate = {
            ...values,
            Estado: 2,
            CreadoPor: user.userId,
            Creado: new Date(),
            Modificado: new Date(),
            ModificadoPor: user.userId
        }

        console.log('movimientoDataCreate', movimientoDataCreate)

        const reqOptions = {
            method: 'POST',
            body: JSON.stringify(movimientoDataCreate),
            headers: { "Content-Type": "application/json" }
        };
        const respMovimiento = await fetchRegistrarMovimiento(`${API}/movimiento`, reqOptions);

        console.log('respMovimiento => ', respMovimiento);

        if (respMovimiento.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: respMovimiento.message })
        } else if (errorRegistrarMovimiento) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorRegistrarMovimiento })
        } else {
            setAlert(true);
            setAlertOptions({ tipo: 'success', titulo: 'Éxito', mensaje: 'Movimiento creado con éxito!' })
            navigate('/movimientos')
        }
    }

    
    React.useEffect(() => {
        console.log('Mov')
        const getClientes = async() => {
            const reqOptions = {
                method: 'GET',
                headers: { "Content-Type": "application/json" }
            };
            const respCliente = await fetchClientes(`${API}/clientes`, reqOptions)
    
            if (respCliente.error) {
                setAlert(true);
                setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: respCliente.message })
                return;
            }
    
            if (errorClientes) {
                setAlert(true);
                setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorClientes })
                return;
            } 
    
            console.log('respCliente => ', respCliente);
            // setClientes(respCliente)
        }
        getClientes();
    }, [])

    return (
        <>
            <Alert open={alert} setOpen={setAlert} alertOptions={alertOptions}></Alert>

            <Card sx={{ minWidth: 300 }}>
                <CardContent>
                    <MovimientoForm registrarMovimiento={registrarMovimiento} clientes={clientes} dataSaving={loadingMovimiento} />
                </CardContent>
            </Card>
        </>

    )
}

export default MovimientoRegistrar