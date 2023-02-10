import *  as React from 'react'
import { API } from '../config';
import { useAuth } from "../context/auth-context";
import CardContent from '@mui/material/CardContent';
import useFetch from '../hooks/use-fetch';
import Title from './Title';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import Box from "@mui/material/Box";
import {
    Card,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination
} from '@mui/material';

const Articulos = () => {
    const [width, setWidth] = React.useState(window.innerWidth)
    const [searchField, setSearchField] = React.useState("");
    const [alert, setAlert] = React.useState(false);
    const [articulosList, setArticulosList] = React.useState([]);
    const [alertOptions, setAlertOptions] = React.useState({});
    const { fetchData: fetchArticulos, error: errorArticulos, loading: loadingArticulos } = useFetch();
    const [articulosFiltradas, setArticulosFiltradas] = React.useState([]);
    const [articuloCount, setArticuloCount] = React.useState(0);
    const [controller, setController] = React.useState({
        page: 0,
        rowsPerPage: 10
    });
    const filtrarArticulos = (searchField) => {
        const filteredArticulos = articulosList.filter(
            articulo => {
                return (
                    articulo.Descripcion
                        .toLowerCase()
                        .includes(searchField.toLowerCase()) ||
                    articulo.Id
                        .toLowerCase()
                        .includes(searchField.toLowerCase())
                );
            }
        );
        setArticulosFiltradas(filteredArticulos)
    }

    const getArticulos = React.useCallback(async () => {
        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        };
        const articuloData = await fetchArticulos(`${API}/articulos?page=${controller.page}&size=${controller.rowsPerPage}`, reqOptions)

        setArticuloCount(articuloData.length)
        setArticulosList(articuloData);
        if (articuloData.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: articuloData.message })
        } else if (errorArticulos) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorArticulos })
        } else {

            setArticulosList(articuloData)
        }
    }, [errorArticulos, fetchArticulos]);

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
    const getData = async () => {
        await getArticulos();

    }
    const refreshArticulos = () => {
        // it re-renders the component
        setArticulosList([]);
        getArticulos();
    }

    const handleChange = e => {

        filtrarArticulos(e.target.value)
        setSearchField(e.target.value);
    };

    React.useEffect(() => {
        getData();

    }, [])
    return (
        <>
            <Title>Listado de artículos</Title>

            <Card size="small" sx={{ minWidth: 275 }}>
                <CardContent>
                    <Box
                        m={1}
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="flex-end"

                    >
                        <Button startIcon={<CachedIcon />} variant="text" color='primary' onClick={refreshArticulos} disabled={loadingArticulos}>
                            Refrescar
                        </Button>
                    </Box>

                    <FormControl sx={{ m: 2, width: '90ch' }} >
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
                                    Codigo
                                </TableCell>
                                <TableCell>
                                    Descripción
                                </TableCell>
                                <TableCell>
                                    Descripción adicional
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {articulosFiltradas.length ? (
                                articulosFiltradas.map((articulo) => (
                                    <TableRow key={articulo.Id}>
                                        <TableCell>
                                            {articulo.Id}
                                        </TableCell>
                                        <TableCell>
                                            {articulo.Descripcion}
                                        </TableCell>
                                        <TableCell>
                                            {articulo.DescripcionAdicional}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                articulosList.map((articulo) => (
                                    <TableRow key={articulo.Id}>
                                        <TableCell>
                                            {articulo.Id}
                                        </TableCell>
                                        <TableCell>
                                            {articulo.Descripcion}
                                        </TableCell>
                                        <TableCell>
                                            {articulo.DescripcionAdicional}
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
export default Articulos