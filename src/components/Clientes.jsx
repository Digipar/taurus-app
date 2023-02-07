import * as React from 'react'
import useFetch from '../hooks/use-fetch';
import Alert from './Alert';
import { API_URL_CLIENTES } from '../config';
import { DataGrid } from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import Title from './Title';
import Grid from '@mui/material/Grid';


const Clientes = () => {

    const columns = [
        { field: 'Id', headerName: 'ID', width: 100 },
        { field: 'Nombre', headerName: 'Nombre', width: 130 },
        { field: 'Tenant', headerName: 'Tenant', width: 130 },
    ];

    const [alert, setAlert] = React.useState(false);
    const [clientes, setClientes] = React.useState([]);
    const [alertOptions, setAlertOptions] = React.useState({});
    const { fetchData: fetchClientes, error: errorClientes, loading: loadingClientes } = useFetch();


    const getClientes = React.useCallback(async () => {
        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        };
        const clienteData = await fetchClientes(`${API_URL_CLIENTES}/clientes`, reqOptions)

        if (clienteData.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: clienteData.message })
        } else if (errorClientes) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorClientes })
        } else {
            console.log('clienteData => ', clienteData);
            setClientes(clienteData)
        }
    }, [errorClientes, fetchClientes]);


    React.useEffect(() => {
        getClientes();
    }, [getClientes])


    return (
        <>
            <Title>Listado de clientes</Title>
            <Card size="small" sx={{ minWidth: 275 }}>
                <CardContent>
                <Grid container justifyContent="flex-end">
                <Button startIcon={<CachedIcon />} variant="text" color='primary' onClick={getClientes} disabled={loadingClientes}>
                    Refrescar
                </Button>
            </Grid>
                    <Alert open={alert} setOpen={setAlert} alertOptions={alertOptions}></Alert>
                    {
                        loadingClientes ? <h4>Cargando...</h4>
                            :
                            <div style={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    getRowId={(cliente) => cliente.Id}
                                    rows={clientes}
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

export default Clientes