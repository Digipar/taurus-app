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

const Movimientos = () => {

    const [alert, setAlert] = React.useState(false);
    const [movimientos, setMovimientos] = React.useState([])
    const [alertOptions, setAlertOptions] = React.useState({});
    const { fetchData: fetchMovimientos, error: errorMovimientos, loading: loadingMovimientos } = useFetch();
    

    const [searchField, setSearchField] = React.useState("");


    const getMovimientos = React.useCallback(async () => {
        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        };
        const movimientoData = await fetchMovimientos(`${API}/movimiento`, reqOptions)
        console.log("movimientos => , ", movimientoData)

        if (movimientoData.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: movimientoData.message })
        } 

        if (errorMovimientos) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorMovimientos })
        }

        setMovimientos(movimientoData); 


    }, [errorMovimientos, fetchMovimientos]);


    React.useEffect(() => {
        getMovimientos();
    }, [])

    return (
        <>
            <Title>Listado de movimientos</Title>

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
                                    Código
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
                                            {movimiento.articuloId}
                                        </TableCell>
                                        <TableCell>
                                            {movimiento.clienteId}
                                        </TableCell>
                                        <TableCell>
                                            {movimiento.cantidad}
                                        </TableCell>
                                        <TableCell>
                                            {movimiento.precio}
                                        </TableCell>
                                        <TableCell>
                                            <Button startIcon={<ModeEditIcon />} 
                                            component={Link}
                                            to={`/movimiento-editar/${movimiento.id}`}
                                            variant="text" 
                                            color='primary'  
                                            disabled={loadingMovimientos} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            }

                        </TableBody>
                    </Table>
                    {/* <TablePagination
                        component="div"
                        onPageChange={handlePageChange}
                        page={controller.page}
                        count={movimientoCount}
                        rowsPerPage={controller.rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    /> */}
                </CardContent>
            </Card>
        </>
    )
}

export default Movimientos;