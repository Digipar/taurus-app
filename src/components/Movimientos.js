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
    console.log('llega aca')

    const columns = [
        { field: 'Id', headerName: 'Código', width: 100 },
        { field: 'Descripcion', headerName: 'Descripción', width: 350 },
        { field: 'DescripcionAdicional', headerName: 'Descripcion Adicional', width: 550 },
    ];

    const [alert, setAlert] = React.useState(false);
    const [articulos, setArticulos] = React.useState([]);
    const [alertOptions, setAlertOptions] = React.useState({});
    const { fetchData: fetchMovimientos, error: errorMovimientos, loading: loadingMovimientos } = useFetch();


    const getMovimientos = React.useCallback(async () => {
        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        };
        const movimientoData = await fetchMovimientos(`${API}/movimientos`, reqOptions)
        console.log('movimientoData', movimientoData)

        if (movimientoData.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: movimientoData.message })
        } else if (errorMovimientos) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorMovimientos })
        } else {
            console.log('movimientoData => ', movimientoData);
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
                                    rows={articulos}
                                    columns={columns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    checkboxSelection
                                />
                            </div>


                    }
                </CardContent>
            </Card>
        </>

    )
}
export default Movimientos