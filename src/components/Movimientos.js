import { useCallback, useState, useEffect } from 'react'
import { Button } from '@mui/material';
import { API } from '../config';
import AddIcon from '@mui/icons-material/Add';
import CardContent from '@mui/material/CardContent';
import useFetch from '../hooks/use-fetch';
import Title from './Title';
import CachedIcon from '@mui/icons-material/Cached';
import { Link } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
// import SearchIcon from '@mui/icons-material/Search';
import {
    Stack,
    Box,
    Card,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';

import ModeEditIcon from '@mui/icons-material/ModeEdit';
import MovimientoFiltro from './MovimientoFiltro';

const Movimientos = () => {

    const [alert, setAlert] = useState(false);
    const [movimientos, setMovimientos] = useState([])
    const [clientes, setClientes] = useState([])
    const [articulos, setArticulos] = useState([])
    const [alertOptions, setAlertOptions] = useState({});
    const { fetchData: fetchMovimientos, error: errorMovimientos, loading: loadingMovimientos } = useFetch();
    const { fetchData: fetchClientes, error: errorClientes } = useFetch();
    const { fetchData: fetchArticulos, error: errorArticulos } = useFetch();


    const getMovimientos = useCallback(async () => {
        console.log('1 - getMovimientos');
        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        };
        const movimientoData = await fetchMovimientos(`${API}/movimiento`, reqOptions)
        console.log("movimientos => , ", movimientoData)

        if (movimientoData.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: movimientoData.message })
            return;
        }

        if (errorMovimientos) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorMovimientos })
            return;
        }

        setMovimientos(movimientoData);


    }, [errorMovimientos, fetchMovimientos]);

    const getClientes = useCallback(async () => {
        console.log('2 - getClientes');
        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        };

        const clientesData = await fetchClientes(`${API}/cliente`, reqOptions)

        if (clientesData.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: clientesData.message })
            return;
        }

        if (errorClientes) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorClientes })
            return;
        }

        setClientes(clientesData)

    }, [errorClientes, fetchClientes]);

    const getArticulos = useCallback(async () => {
        console.log('3 - getArticulos');
        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        };

        const articulosData = await fetchArticulos(`${API}/articulo`, reqOptions)

        if (articulosData.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: articulosData.message })
        }

        if (errorArticulos) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorArticulos })
        }

        setArticulos(articulosData);


    }, [errorArticulos, fetchArticulos]);

  


    // const getData = async () => {
    //     console.log('[- GET DATA -]')
    //     await getMovimientos();
    //     await getClientes();
    //     await getArticulos();
    //     // funcion filtrar
    // }

    useEffect(() => {
        getMovimientos();
        getClientes();
        getArticulos();
    }, [])

    return (
        <>
            <Title>Listado de movimientos</Title>

            <MovimientoFiltro clientes={clientes} articulos={articulos} />

            <Card size="small" sx={{ minWidth: 275 }}>
                <CardContent>

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}
                    >

                        <Button startIcon={<AddIcon />} variant="text" color='primary' component={Link} to="/movimiento-registrar" disabled={loadingMovimientos}>
                            Nuevo movimiento
                        </Button>

                        <Button startIcon={<CachedIcon />} variant="text" color='primary' onClick={getMovimientos} disabled={loadingMovimientos}>
                            Refrescar
                        </Button>
                    </Stack>
                    <Divider />


                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="flex-end"
                    >
                    </Box>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Id
                                </TableCell>
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
                            {
                                movimientos.map((movimiento) => (
                                    <TableRow key={movimiento.id}>
                                        <TableCell>
                                            {movimiento.id}
                                        </TableCell>
                                        <TableCell>
                                            {movimiento.articulo.descripcion}
                                        </TableCell>
                                        <TableCell>
                                            {movimiento.cliente.nombre}
                                        </TableCell>
                                        <TableCell>
                                            {movimiento.cantidad}
                                        </TableCell>
                                        <TableCell>
                                            {movimiento.precio}
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Editar">
                                                <Button startIcon={<ModeEditIcon />}
                                                    component={Link}
                                                    to={`/movimiento-editar/${movimiento.id}`}
                                                    variant="text"
                                                    color='primary'
                                                    disabled={loadingMovimientos} />
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }

                        </TableBody>
                    </Table>

                </CardContent>
            </Card>
        </>
    )
}

export default Movimientos;