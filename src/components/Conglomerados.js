import * as React from 'react'
import useFetch from '../hooks/use-fetch';
import { API } from '../config';
import CardContent from '@mui/material/CardContent';
import { Button } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import Title from './Title';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import {
    Card,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Badge from '@mui/material/Badge';

const Conglomerados = () => {

    const [searchField, setSearchField] = React.useState("");
    const [alert, setAlert] = React.useState(false);
    const [conglomeradosList, setConglomeradosList] = React.useState([]);
    const [alertOptions, setAlertOptions] = React.useState({});
    const { fetchData: fetchConglomerados, error: errorConglomerados, loading: loadingConglomerados } = useFetch();
    const [conglomeradosFiltrados, setConglomeradosFiltrados] = React.useState([]);
    const [conglomeradoCount, setConglomeradoCount] = React.useState(0);
    const [controller, setController] = React.useState({
        page: 0,
        rowsPerPage: 10
    });
    const handleChange = e => {

        filtrarConglomerados(e.target.value)
        setSearchField(e.target.value);
    };
    const filtrarConglomerados = (searchField) => {
        const filteredConglomerados = conglomeradosList.filter(
            conglomerado => {
                return (
                    conglomerado.Nombre
                        .toLowerCase()
                        .includes(searchField.toLowerCase())

                );
            }
        );
        setConglomeradosFiltrados(filteredConglomerados)
    }

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
            setConglomeradosList(conglomeradoData)
        }
    }, [errorConglomerados, fetchConglomerados]);
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
    const refreshConglomerados = () => {
        setConglomeradosList([]);
        getConglomerados();
    }

    React.useEffect(() => {
        getConglomerados();
    }, [])


    return (
        <>
            <Title>Listado de conglomerados</Title>
            <Card size="small" sx={{ minWidth: 275 }}>
                <CardContent>
                    <Grid container justifyContent="flex-end">
                        <Button startIcon={<CachedIcon />} variant="text" color='primary' onClick={refreshConglomerados} disabled={loadingConglomerados}>
                            Refrescar
                        </Button>

                        <FormControl sx={{ m: 2, width: '1080px' }}>
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
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Nombre
                                </TableCell>
                                <TableCell>
                                    Estado
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {conglomeradosFiltrados.length ? (
                                conglomeradosFiltrados.map((conglomerado) => (
                                    <TableRow key={conglomerado.Id}>
                                        <TableCell>
                                            {conglomerado.Nombre}
                                        </TableCell>
                                        <TableCell>
                                            {conglomerado.Estado == 1 ? (<Badge badgeContent='Activo' color="success">
                                            </Badge>) : <Badge badgeContent='Borrador' color="warning">
                                            </Badge>}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                conglomeradosList.map((conglomerado) => (
                                    <TableRow key={conglomerado.Id}>
                                        <TableCell>
                                            {conglomerado.Nombre}
                                        </TableCell>
                                        <TableCell>
                                            {conglomerado.Estado == 1 ? (<Badge badgeContent='Activo' color="success">
                                            </Badge>) : <Badge badgeContent='Borrador' color="warning">

                                            </Badge>}

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
                        count={conglomeradoCount}
                        rowsPerPage={controller.rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </CardContent>
            </Card>
        </>


    )
}

export default Conglomerados;