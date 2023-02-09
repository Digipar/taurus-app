import * as React from 'react'
import { Button } from '@mui/material';
import { API } from '../config';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import Alert from './Alert';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import useFetch from '../hooks/use-fetch';
import Title from './Title';
import CachedIcon from '@mui/icons-material/Cached';
import { Link } from "react-router-dom";



const Movimientos = () => {

    const columns = [
        { field: 'ArticuloId', headerName: 'Articulo', width: 100 },
        { field: 'ClienteId', headerName: 'Cliente', width: 300, align: 'center' },
        { field: 'Cantidad', headerName: 'Cantidad', width: 300 },
        { field: 'Precio', headerName: 'Precio', width: 300, align: 'right' },
    ];

    const [alert, setAlert] = React.useState(false);
    const [movimientos, setMovimientos] = React.useState(
        [
            {
                "Id" : "001",
                "Creado" : "2023-02-01T12:53:28Z",
                "CreadoPor" : "Pedro Kaur",
                "Modificado" : "2023-02-01T12:53:28Z",
                "ModificadoPor": "Pedro Kaur",
                "Estado" : 1,
                "Precio" : 800,
                "Cantidad": 2,
                "ArticuloId" : "m2o94",
                "ClienteId" : 1000    },
            {
                "Id" : "002",
                "Creado" : "2023-01-12T12:53:28Z",
                "CreadoPor" : "Angelina Alfaro",
                "Modificado" : "2023-01-12T12:53:28Z",
                "ModificadoPor": "Angelina Alfaro",
                "Estado" : 1,
                "Precio" : 900,
                "Cantidad": 2,
                "ArticuloId" : "h9kc6",
                "ClienteId" : 1001    },
            {
                "Id" : "003",
                "Creado" : "2023-01-05T12:53:28Z",
                "CreadoPor" : "Pedro Kaur",
                "Modificado" : "2023-01-05T12:53:28Z",
                "ModificadoPor": "Pedro Kaur",
                "Estado" : 2,
                "Precio" : 1200,
                "Cantidad": 1,
                "ArticuloId" : "dxhr23",
                "ClienteId" : 1002    },
            {
                "Id" : "004",
                "Creado" : "2023-02-10T12:53:28Z",
                "CreadoPor" : "Mohamed Montenegro",
                "Modificado" : "2023-02-10T12:53:28Z",
                "ModificadoPor": "Mohamed Montenegro",
                "Estado" : 2,
                "Precio" : 1200,
                "Cantidad": 1,
                "ArticuloId" : "gft291",
                "ClienteId" : 1003    },
            {
                "Id" : "005",
                "Creado" : "2023-03-11T12:53:28Z",
                "CreadoPor" : "Nestor Jurado",
                "Modificado" : "2023-03-11T12:53:28Z",
                "ModificadoPor": "Nestor Jurado",
                "Estado" : 2,
                "Precio" : 2000,
                "Cantidad": 0,
                "ArticuloId" : "krw462",
                "ClienteId" : 1004    }
        ]
    );
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
        } 
        
        if (errorMovimientos) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorMovimientos })
        }
            setMovimientos(movimientoData)
        
    }, [errorMovimientos, fetchMovimientos]);


    React.useEffect(() => {
        //getMovimientos();
    }, []) 

    return (
        <>
            <Title>Listado de movimientos</Title>

            <Card size="small" sx={{ minWidth: 275 }}>

                <CardContent>
                    <Grid container justifyContent="flex-end">
                        <Button startIcon={<AddIcon />} variant="text" color='primary' component={Link} to="/movimiento-registrar" disabled={loadingMovimientos}>
                            Nuevo movimiento
                        </Button>
                       
                        <Button startIcon={<CachedIcon />} variant="text" color='primary' onClick={getMovimientos}  disabled={loadingMovimientos}>
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

export default Movimientos;