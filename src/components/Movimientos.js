import * as React from 'react'
import { API_URL_MOVIMIENTOS } from '../config';
import { DataGrid } from '@mui/x-data-grid';
import Alert from './Alert';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import useFetch from '../hooks/use-fetch';
import Title from './Title';
import { Button } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';

const Movimientos = () => {
    console.log('llega aca')

    // const columns = [
    //     { field: 'Cliente', headerName: 'Cliente', width: 100 },
    //     { field: 'Articulo', headerName: 'Articulo', width: 350 },
    //     { field: 'Precio', headerName: 'Precio', width: 550 },
    //     { field: 'Estado', headerName: 'Estado', width: 550 },
    // ];

    // const [alert, setAlert] = React.useState(false);
    // const [movimientos, setMovimientos] = React.useState([]);
    // const [alertOptions, setAlertOptions] = React.useState({});
    // const { fetchData: fetchMovimientos, error: errorMovimientos, loading: loadingMovimientos } = useFetch();


    // const getMovimientos = React.useCallback(async () => {
    //     const reqOptions = {
    //         method: 'GET',
    //         headers: { "Content-Type": "application/json" }
    //     };
    //     const movimientoData = await fetchMovimientos(`${API_URL_MOVIMIENTOS}`, reqOptions)

    //     console.log('movimientoData', movimientoData)
    //     if (movimientoData.error) {
    //         setAlert(true);
    //         setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: movimientoData.message })
    //     } else if (errorMovimientos) {
    //         setAlert(true);
    //         setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorMovimientos })
    //     } else {
    //         console.log('movimientoData => ', movimientoData);
    //         setMovimientos(movimientoData)
    //     }
    // }, [errorMovimientos, fetchMovimientos]);


    // React.useEffect(() => {
    //     getMovimientos();
    // }, [getMovimientos])
    return (
        <>
            <Title>Listado de Movimientos</Title>

        </>

    )
}
export default Movimientos