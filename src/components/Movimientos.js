import * as React from 'react'
import { API } from '../config';
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

    const columns = [
        { field: 'ArticuloId', headerName: 'Articulo', width: 100 },
        { field: 'ClienteId', headerName: 'Cliente', width: 300 ,align: 'center'},
        { field: 'Cantidad', headerName: 'Cantidad', width: 300 },
        { field: 'Precio', headerName: 'Precio', width: 300, align: 'right' },
    ];

    const [alert, setAlert] = React.useState(false);
    const [movimientos, setArticulos] = React.useState([]);
    const [alertOptions, setAlertOptions] = React.useState({});
    const { fetchData: fetchMovimientos, error: errorMovimientos, loading: loadingMovimientos } = useFetch();


    const getMovimientos = React.useCallback(async () => {
        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        };
        
        const movimientoData = await fetchMovimientos(`${API}/movimientos`, reqOptions)
        if (movimientoData.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: movimientoData.message })
        } else if (errorMovimientos) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorMovimientos })
        } else {
            setArticulos(movimientoData)
        }
    }, [errorMovimientos, fetchMovimientos]);


    React.useEffect(() => {
        getMovimientos();
    }, [])
    return (
        <>
            <Title>Listado de movimientos</Title>
            <Card size="small" sx={{ minWidth: 275 }}>
                <CardContent>
                    <Grid container justifyContent="flex-end">
                        <Button startIcon={<CachedIcon />} variant="text" color='primary' onClick={getMovimientos} disabled={loadingMovimientos}>
                            Refrescar
                        </Button>
                    </Grid>
                    <Alert open={alert} setOpen={setAlert} alertOptions={alertOptions}></Alert>
                    {
                        loadingMovimientos ? <h4>Cargando...</h4>
                            :
                            <div style={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    getRowId={(movimiento) => movimiento.Id}
                                    rows={movimientos}
                                    columns={columns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                />
                            </div>
                    }
                </CardContent>
            </Card>
        </>
    )
}
export default Movimientos