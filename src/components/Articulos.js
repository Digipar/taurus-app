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
    const [filterDescripcion, setFilterDescripcion] = React.useState('Todos');

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
        console.log('Descripcion', searchField)
        const filteredArticulos = articulosList.filter(
            articulo => {
                return (
                    articulo.Descripcion
                        .toLowerCase()
                        .includes(searchField.toLowerCase())||
                    articulo.Id
                        .toLowerCase()
                        .includes(searchField.toLowerCase())
                );
            }
        );
        console.log('filteredArticulos', filteredArticulos)
        setArticulosFiltradas(filteredArticulos)
    }

    const getArticulos = React.useCallback(async () => {
        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        };
        const articuloData = await fetchArticulos(`${API}/articulos`, reqOptions)
        console.log('articuloData', articuloData)
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
        console.log('aca')
        setController({
            ...controller,
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0
        });
    };
    const getData = async () => {
        await getArticulos();

    }

    const handleChange = e => {
        console.log('e.target.value', e.target.value)
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
                    <FormControl sx={{ m: 2, width: '110ch' }}>
                        <InputLabel htmlFor='outlined-adornment-amount'>Filtro de Búsqueda</InputLabel>
                        <OutlinedInput
                           // id='outlined-adornment-amount'
                            onChange={handleChange}
                            type="search"
                            //value={props.value}
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