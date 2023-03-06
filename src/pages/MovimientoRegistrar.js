import React, {useCallback} from 'react';
import { API } from '../config';
import useFetch from '../hooks/use-fetch';
import MovimientoForm from '../components/MovimientoForm';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import { Card, CardContent } from '@mui/material';



const MovimientoRegistrar = () => {
  
    const navigate = useNavigate();
    const { fetchData: fetchClientes, error: errorClientes } = useFetch();
    const { fetchData: fetchArticulos, error: errorArticulos } = useFetch();
    const { fetchData: fetchRegistrarMovimiento, error: errorRegistrarMovimiento } = useFetch();

    const [clientes, setClientes] = React.useState([]);
    const [articulos, setArticulos] = React.useState([]);
    const [alert, setAlert] = React.useState(false);
    const [alertOptions, setAlertOptions] = React.useState({});


    const getArticulos = useCallback (async () => {
        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        };

        const articulosData = await fetchArticulos(`${API}/articulo`, reqOptions)

        // console.log("Articulos =>", articulosData)

        if (articulosData.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: articulosData.message })
            return;
        } 

        if (errorArticulos) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorArticulos })
            return;
        }

        setArticulos(articulosData); 


    }, [errorArticulos, fetchArticulos]);

    const getClientes = useCallback (async () => {

        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        };

        // console.log('GET CLIENTE =>', API + `/cliente`)

        const clientesData = await fetchClientes(`${API}/cliente`, reqOptions)
      
        if (clientesData.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: clientesData.message })
            return;
        }

        if (errorClientes) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorClientes })
            return;
        } 

        setClientes(clientesData)
       
    },[errorClientes, fetchClientes]);

    React.useEffect(() => {
        getArticulos();
        getClientes();

    }, [getArticulos, getClientes])

   

    
    const registrarMovimiento = async (values) => {

        const movimientoDataCreate = {
            ...values,
            estado: 2,
           
        }

        const reqOptions = {
            method: 'POST',
            body: JSON.stringify(movimientoDataCreate),
            headers: { "Content-Type": "application/json" }
        };


        const respMovimiento = await fetchRegistrarMovimiento(`${API}/movimiento`, reqOptions);

        // console.log("[POST] respMovimiento => ", respMovimiento)

        if (respMovimiento.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: respMovimiento.message })
            return;
        }

        if (errorRegistrarMovimiento) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorRegistrarMovimiento })
            return;
        }

        setAlert(true);
        setAlertOptions({ tipo: 'success', titulo: 'Éxito', mensaje: 'Movimiento creado con éxito!' })
        navigate('/movimientos')
        
    }

    return (
        <>
            <Alert open={alert} setOpen={setAlert} alertOptions={alertOptions}></Alert>
            <Card sx={{ minWidth: 300 }}> 
                <CardContent>
                    <MovimientoForm registrarMovimiento={registrarMovimiento} clientes={clientes} articulos={articulos} />
                </CardContent>
            </Card>
        </>

    )
}

export default MovimientoRegistrar