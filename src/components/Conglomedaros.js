import * as React from 'react'
import useFetch from '../hooks/use-fetch';
import Alert from './Alert';
import { API } from '../config';
import { DataGrid } from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import Title from './Title';
import Grid from '@mui/material/Grid';


const Conglomerados = () => {

    const columns = [
        { field: 'Id', headerName: 'Código', width: 150 },
        { field: 'Nombre', headerName: 'Nombre', width: 250 },
        { field: 'CreadoPor', headerName: 'Creado Por', width: 150 },
    ];

    const [alert, setAlert] = React.useState(false);
    const [conglomerados, setConglomerados] = React.useState([]);
    const [alertOptions, setAlertOptions] = React.useState({});
    const { fetchData: fetchConglomerados, error: errorConglomerados, loading: loadingConglomerados } = useFetch();


    const getConglomerados = React.useCallback(async () => {
        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        };
        const conglomeradoData = await fetchConglomerados(`${API}/conglomerados`, reqOptions)

        if (conglomeradoData.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: conglomeradoData.message })
        } else if (errorConglomerados) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorConglomerados })
        } else {
            // console.log('conglomeradoData => ', conglomeradoData);
            setConglomerados(conglomeradoData)
        }
    }, [errorConglomerados, fetchConglomerados]);


    React.useEffect(() => {
        getConglomerados();
    }, [])


    return (
        <>
            <Title>Listado de conglomerados</Title>
            <Card size="small" sx={{ minWidth: 275 }}>
                <CardContent>
                <Grid container justifyContent="flex-end">
                <Button startIcon={<CachedIcon />} variant="text" color='primary' onClick={getConglomerados} disabled={loadingConglomerados}>
                    Refrescar
                </Button>
            </Grid>
                    <Alert open={alert} setOpen={setAlert} alertOptions={alertOptions}></Alert>
                    {
                        loadingConglomerados ? <h4>Cargando...</h4>
                            :
                            <div style={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    getRowId={(conglomerado) => conglomerado.Id}
                                    rows={conglomerados}
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

export default Conglomerados;