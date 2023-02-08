import * as React from 'react'
import { API_URL_ARTICULOS } from '../config';
import { DataGrid } from '@mui/x-data-grid';
import Alert from './Alert';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import useFetch from '../hooks/use-fetch';
import Title from './Title';
import { Button } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';

const Articulos = () => {

    const columns = [
        { field: 'Id', headerName: 'Código', width: 100 },
        { field: 'Descripcion', headerName: 'Descripción', width: 350 },
        { field: 'DescripcionAdicional', headerName: 'Descripcion Adicional', width: 550 },
    ];

    const [alert, setAlert] = React.useState(false);
    const [articulos, setArticulos] = React.useState([]);
    const [alertOptions, setAlertOptions] = React.useState({});
    const { fetchData: fetchArticulos, error: errorArticulos, loading: loadingArticulos } = useFetch();


    const getArticulos = React.useCallback(async () => {
        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        };
        const articuloData = await fetchArticulos(`${API_URL_ARTICULOS}`, reqOptions)

        if (articuloData.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: articuloData.message })
        } else if (errorArticulos) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorArticulos })
        } else {
            console.log('articuloData => ', articuloData);
            setArticulos(articuloData)
        }
    }, [errorArticulos, fetchArticulos]);


    React.useEffect(() => {
        getArticulos();
    }, [])
    return (
        <>
            <Title>Listado de artículos</Title>



            <Card size="small" sx={{ minWidth: 275 }}>
                <CardContent>

                    <Grid container justifyContent="flex-end">
                        <Button startIcon={<CachedIcon />} variant="text" color='primary' onClick={getArticulos} disabled={loadingArticulos}>
                            Refrescar
                        </Button>
                    </Grid>
                    <Alert open={alert} setOpen={setAlert} alertOptions={alertOptions}></Alert>
                    {
                        loadingArticulos ? <h4>Cargando...</h4>
                            :
                            <div style={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    getRowId={(articulo) => articulo.Id}
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
export default Articulos