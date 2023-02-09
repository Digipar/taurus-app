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
import ModeEditIcon from '@mui/icons-material/ModeEdit';

const Movimientos = () => {



    const [alert, setAlert] = React.useState(false);
    const [movimientos, setMovimientos] = React.useState(
        [
            {
                "Id": "001",
                "Creado": "2023-02-01T12:53:28Z",
                "CreadoPor": "Pedro Kaur",
                "Modificado": "2023-02-01T12:53:28Z",
                "ModificadoPor": "Pedro Kaur",
                "Estado": 1,
                "Precio": 800,
                "Cantidad": 2,
                "ArticuloId": "m2o94",
                "ClienteId": 1000
            },
            {
                "Id": "002",
                "Creado": "2023-01-12T12:53:28Z",
                "CreadoPor": "Angelina Alfaro",
                "Modificado": "2023-01-12T12:53:28Z",
                "ModificadoPor": "Angelina Alfaro",
                "Estado": 1,
                "Precio": 900,
                "Cantidad": 2,
                "ArticuloId": "h9kc6",
                "ClienteId": 1001
            },
            {
                "Id": "003",
                "Creado": "2023-01-05T12:53:28Z",
                "CreadoPor": "Pedro Kaur",
                "Modificado": "2023-01-05T12:53:28Z",
                "ModificadoPor": "Pedro Kaur",
                "Estado": 2,
                "Precio": 1200,
                "Cantidad": 1,
                "ArticuloId": "dxhr23",
                "ClienteId": 1002
            },
            {
                "Id": "004",
                "Creado": "2023-02-10T12:53:28Z",
                "CreadoPor": "Mohamed Montenegro",
                "Modificado": "2023-02-10T12:53:28Z",
                "ModificadoPor": "Mohamed Montenegro",
                "Estado": 2,
                "Precio": 1200,
                "Cantidad": 1,
                "ArticuloId": "gft291",
                "ClienteId": 1003
            },
            {
                "Id": "005",
                "Creado": "2023-03-11T12:53:28Z",
                "CreadoPor": "Nestor Jurado",
                "Modificado": "2023-03-11T12:53:28Z",
                "ModificadoPor": "Nestor Jurado",
                "Estado": 2,
                "Precio": 2000,
                "Cantidad": 0,
                "ArticuloId": "krw462",
                "ClienteId": 1004
            }
        ]
    );
    const [alertOptions, setAlertOptions] = React.useState({});
    const { fetchData: fetchMovimientos, error: errorMovimientos, loading: loadingMovimientos } = useFetch();
    const [movimientosFiltrados, setMovimientosFiltrados] = React.useState([]);
    const [movimientoCount, setMovimientoCount] = React.useState(0);
    const [controller, setController] = React.useState({
        page: 0,
        rowsPerPage: 10
    });

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

    const [searchField, setSearchField] = React.useState("");

    const handleChange = e => {

        filtrarMovimientos(e.target.value)
        setSearchField(e.target.value);
    };
    const filtrarMovimientos = (searchField) => {
        const filteredArticulos = movimientos.filter(
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
        // const reqOptions = {
        //     method: 'GET',
        //     headers: { "Content-Type": "application/json" }
        // };
        // const movimientoData = await fetchMovimientos(`${API}/movimientos?page=${controller.page}&size=${controller.rowsPerPage}`, reqOptions)

        setMovimientoCount(movimientos.length)

        // if (movimientoData.error) {
        //     setAlert(true);
        //     setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: movimientoData.message })
        // } 

        // if (errorMovimientos) {
        //     setAlert(true);
        //     setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorMovimientos })
        // }

        setMovimientos(movimientos); // array statico


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

                        <Button startIcon={<CachedIcon />} variant="text" color='primary' onClick={getMovimientos} disabled={loadingMovimientos}>
                            Refrescar
                        </Button>
                    </Grid>
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
                                <TableCell>
                                    Acción
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
                                movimientos.map((movimiento) => (
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
                                        <TableCell>
                                            <Button startIcon={<ModeEditIcon />} 
                                            component={Link}
                                            to={`/movimiento-editar/${movimiento.Id}`}
                                            variant="text" 
                                            color='primary'  
                                            disabled={loadingMovimientos} />
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