import * as React from 'react'
import { Button } from '@mui/material';
import { API } from '../config';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import useFetch from '../hooks/use-fetch';
import Title from './Title';
import CachedIcon from '@mui/icons-material/Cached';
import { Link } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import {
    Card,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const Movimientos = () => {

    const columns = [
        { field: 'ArticuloId', headerName: 'Articulo', width: 100 },
        { field: 'ClienteId', headerName: 'Cliente', width: 300, align: 'center' },
        { field: 'Cantidad', headerName: 'Cantidad', width: 300 },
        { field: 'Precio', headerName: 'Precio', width: 300, align: 'right' },
    ];

    const [alert, setAlert] = React.useState(false);
    const [movimientosList, setMovimientosList] = React.useState([]);
    const [alertOptions, setAlertOptions] = React.useState({});
    const { fetchData: fetchMovimientos, error: errorMovimientos, loading: loadingMovimientos } = useFetch();
    const [movimientosFiltrados, setMovimientosFiltrados] = React.useState([]);
    const [movimientoCount, setMovimientoCount] = React.useState(0);
    const [controller, setController] = React.useState({
        page: 0,
        rowsPerPage: 10
    });
    const [searchField, setSearchField] = React.useState("");

    const handleChange = e => {

        filtrarMovimientos(e.target.value)
        setSearchField(e.target.value);
    };
    const filtrarMovimientos = (searchField) => {
        const filteredArticulos = movimientosList.filter(
            movimiento => {
                return (
                    movimiento.ArticuloId
                        .toLowerCase()
                        .includes(searchField.toLowerCase()) 
                    // || movimiento.ClienteId
                    //     .toLowerCase()
                    //     .includes(searchField.toLowerCase())
                );
            }
        );
        setMovimientosFiltrados(filteredArticulos)
    }
    const getMovimientos = React.useCallback(async () => {
        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        };
        const movimientoData = await fetchMovimientos(`${API}/movimientos?page=${controller.page}&size=${controller.rowsPerPage}`, reqOptions)

        setMovimientoCount(movimientoData.length)
        setMovimientosList(movimientoData);
        if (movimientoData.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: movimientoData.message })
        } else if (errorMovimientos) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorMovimientos })
        } else {

            setMovimientosList(movimientoData)
        }
    }, [errorMovimientos, fetchMovimientos]);

    const getData = async () => {
        await getMovimientos();

    }

    React.useEffect(() => {
        getData();

    }, [])
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

    const refreshMovimientos = async () => {
        setMovimientosList([]);
        getMovimientos();       
    }

    return (
        <>
            <Title>Listado de movimientos</Title>

            <Card size="small" sx={{ minWidth: 275 }}>
                <CardContent>
                    <Grid container justifyContent="flex-end">
                        <Button startIcon={<AddIcon />} variant="text" color='primary' component={Link} to="/movimiento-registrar" disabled={loadingMovimientos}>
                            Nuevo movimiento
                        </Button>
                       
                        <Button startIcon={<CachedIcon />} variant="text" color='primary' onClick={refreshMovimientos}  disabled={loadingMovimientos}>
                            Refrescar
                        </Button>
                    </Grid>
                    <FormControl sx={{ m: 2, width: '110ch' }}>
                    <InputLabel htmlFor='outlined-adornment-amount'>Filtro de Búsqueda</InputLabel>
                    <OutlinedInput
                        onChange={handleChange}
                        type="search"
                        startAdornment={
                            <InputAdornment position='end'>
                                <SearchIcon />
                            </InputAdornment>
                        }
                        label='Search'
                    />
                </FormControl>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Articulo
                            </TableCell>
                            <TableCell>
                                Cliente
                            </TableCell>
                            <TableCell>
                                Cantidad
                            </TableCell>
                            <TableCell>
                            Precio
                        </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {movimientosFiltrados.length ? (
                            movimientosFiltrados.map((movimiento) => (
                                <TableRow key={movimiento.Id}>
                                    <TableCell>
                                        {movimiento.ArticuloId}
                                    </TableCell>
                                    <TableCell>
                                        {movimiento.ClienteId}
                                    </TableCell>
                                    <TableCell>
                                        {movimiento.Cantidad}
                                    </TableCell>
                                    <TableCell>
                                    {movimiento.Precio}
                                </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            movimientosList.map((movimiento) => (
                                <TableRow key={movimiento.Id}>
                                <TableCell>
                                    {movimiento.ArticuloId}
                                </TableCell>
                                <TableCell>
                                    {movimiento.ClienteId}
                                </TableCell>
                                <TableCell>
                                    {movimiento.Cantidad}
                                </TableCell>
                                <TableCell>
                                {movimiento.Precio}
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
                    count={movimientoCount}
                    rowsPerPage={controller.rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                </CardContent>
            </Card>
        </>
    )
}

export default Movimientos;