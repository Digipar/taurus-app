import * as React from 'react'
import useFetch from '../hooks/use-fetch';
import Alert from './Alert';
import { API } from '../config';
import CardContent from '@mui/material/CardContent';
import { Button } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import Title from './Title';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';
import {
    Card,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination
} from '@mui/material';

const Clientes = () => {

    const columns = [
        { field: 'Id', headerName: 'ID', width: 150 },
        { field: 'Nombre', headerName: 'Nombre', width: 250 },
        { field: 'Tenant', headerName: 'Tenant', width: 200 },
    ];
    const [searchField, setSearchField] = React.useState("");
    const [alert, setAlert] = React.useState(false);
    const [clientesList, setClientesList] = React.useState([]);
    const [alertOptions, setAlertOptions] = React.useState({});
    const { fetchData: fetchClientes, error: errorClientes, loading: loadingClientes } = useFetch();
    const [clientesFiltradas, setClientesFiltradas] = React.useState([]);
    const [articuloCount, setArticuloCount] = React.useState(0);
    const [controller, setController] = React.useState({
        page: 0,
        rowsPerPage: 10
    });
    const getClientes = React.useCallback(async () => {
        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        };
        const clienteData = await fetchClientes(`${API}/clientes?page=${controller.page}&size=${controller.rowsPerPage}`, reqOptions)

        if (clienteData.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: clienteData.message })
        } else if (errorClientes) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorClientes })
        } else {
            // console.log('clienteData => ', clienteData);
            setClientesList(clienteData)
        }
    }, [errorClientes, fetchClientes]);

    // const refreshClientes = async () => {

    //     console.log('clientesFiltradas', clientesFiltradas)
    //     const reqOptions = {
    //         method: 'GET',
    //         headers: { "Content-Type": "application/json" }
    //     };
    //     const clienteData = await fetchClientes(`${API}/clientes`, reqOptions)

    //     console.log(' clienteData',  clienteData)

    //     if (clienteData.error) {
    //         setAlert(true);
    //         setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: clienteData.message })
    //     }

    //     if (errorClientes) {
    //         setAlert(true);
    //         setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorClientes })
    //     }

    //     setClientesList(clienteData)
    // }
    const refreshClientes = () => {
        // it re-renders the component
        setClientesList([]);
        getClientes();
    }

    const filtrarClientes = (searchField) => {
        const filteredClientes = clientesList.filter(
            cliente => {
                return (
                    cliente.Nombre
                        .toLowerCase()
                        .includes(searchField.toLowerCase()) ||
                    cliente.Tenant
                        .toLowerCase()
                        .includes(searchField.toLowerCase())
                );
            }
        );
        setClientesFiltradas(filteredClientes)
    }

    const handleChange = e => {

        filtrarClientes(e.target.value)
        setSearchField(e.target.value);
    };
    const handlePageChange = (event, newPage) => {
        setController({
            ...controller,
            page: newPage
        });
    };
    const handleChangeRowsPerPage = (event) => {
        console.log('event', event)

        setController({
            ...controller,
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0
        });
    };

    React.useEffect(() => {
        getClientes();
    }, [])



    return (
        <>
            <Title>Listado de clientes</Title>
            <Card size="small" sx={{ minWidth: 275 }}>
                <CardContent>
                    <Grid container justifyContent="flex-end">
                        <Button startIcon={<CachedIcon />} variant="text" color='primary' onClick={refreshClientes} disabled={loadingClientes}>
                            Refrescar
                        </Button>

                        <FormControl sx={{ m: 2, width: '110ch' }}>
                            <InputLabel htmlFor='outlined-adornment-amount'>Filtro de Búsqueda</InputLabel>
                            <OutlinedInput
                                onChange={handleChange}
                                type="search"
                                noValidate
                                sx={{ mt: 1 }}
                                startAdornment={
                                    <InputAdornment position='end'>
                                        <SearchIcon />
                                    </InputAdornment>
                                }
                                label='Search'
                            />
                        </FormControl>
                    </Grid>
                    <Alert open={alert} setOpen={setAlert} alertOptions={alertOptions}></Alert>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Código
                                </TableCell>
                                <TableCell>
                                    Nombre
                                </TableCell>
                                <TableCell>
                                    Tenant
                                </TableCell>
                                <TableCell>
                                    Estado
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clientesFiltradas.length ? (
                                clientesFiltradas.map((cliente) => (
                                    <TableRow key={cliente.Id}>
                                        <TableCell>
                                            {cliente.Id}
                                        </TableCell>
                                        <TableCell>
                                            {cliente.Nombre}
                                        </TableCell>
                                        <TableCell>
                                            {cliente.Tenant}
                                        </TableCell>
                                     
                                    </TableRow>
                                ))
                            ) : (
                                clientesList.map((cliente) => (
                                    <TableRow key={cliente.Id}>
                                        <TableCell>
                                            {cliente.Id}
                                        </TableCell>
                                        <TableCell>
                                            {cliente.Nombre}
                                        </TableCell>
                                        <TableCell>
                                            {cliente.Tenant}
                                        </TableCell>
                                        <TableCell>
                                            {cliente.Estado?(cliente.Estado === 1 ? (<Badge badgeContent='Activo' color="success"></Badge>)
                                                : cliente.Estado === 2 ? (<Badge badgeContent='Borrador' color="warning"></Badge>)
                                                    : cliente.Estado === 0 ?<Badge badgeContent='Anulado' color="danger"></Badge>:''):'Anulado'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )
                            }

                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        onPageChange={handlePageChange}
                        page={controller.page}
                        count={articuloCount}
                        rowsPerPage={controller.rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />

                </CardContent>
            </Card>
        </>
    )
}

export default Clientes