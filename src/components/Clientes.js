import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';
import { API } from '../config';
import useFetch from '../hooks/use-fetch';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Lottie from 'react-lottie-player';
import lottieJson from '../img/lottie.json';
import Stack from '@mui/material/Stack';
import Alert from '../components/Alert';
import CircularProgress from '@mui/material/CircularProgress';


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {

    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const encabezadoClientes = [
    {
        id: 'id',
        numeric: false,
        disablePadding: true,
        label: 'ID',
    },
    {
        id: 'nombre',
        numeric: false,
        disablePadding: false,
        label: 'Nombre',
    },
    {
        id: 'tenantId',
        numeric: false,
        disablePadding: false,
        label: 'Tenant',
    },


];

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell >

                </TableCell>
                {encabezadoClientes.map((encabezado) => (
                    <TableCell
                        key={encabezado.id}
                        align={encabezado.numeric ? 'right' : 'left'}
                        padding={encabezado.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === encabezado.id ? order : false}
                    >
                        <TableSortLabel
                            sx={{ fontWeight: 'bold' }}
                            active={orderBy === encabezado.id}
                            direction={orderBy === encabezado.id ? order : 'asc'}
                            onClick={createSortHandler(encabezado.id)}
                        >
                            {encabezado.label}
                            {orderBy === encabezado.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                Listado de Clientes
            </Typography>

        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [clientesList, setClientesList] = React.useState([]);
    const [clientesCount, setClientesCount] = React.useState([]);
    const [clientesTotal, setClientesTotal] = React.useState([]);
    const [alertOptions, setAlertOptions] = React.useState({});
    const [alert, setAlert] = React.useState(false);
    const [mostrarPaginacion, setMostrarPaginacion] = React.useState(true);
    const [searchField, setSearchField] = React.useState("");
    const { fetchData: fetchClientes, error: errorClientes} = useFetch();
    const [clienteListlength, setClienteListLength] = React.useState(false);
    const [loadingClientes, setLoadingClientes] = React.useState(false);
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const filtrarClientes = (searchField) => {
        const clientesList = clientesTotal.filter(
            cliente => {
                return (
                    cliente.nombre
                        .toLowerCase()
                        .match(searchField.toLowerCase())
                );
            }
        );
        if (clientesList.length) {
            setTimeout(function () {
                setClientesList(clientesList)
                setMostrarPaginacion(false)
            }, 4000);
        } else {
            setTimeout(function () {
                setClientesList(clientesList)
                setClienteListLength(0)          
                setLoadingClientes(false)
                setMostrarPaginacion(false)
            }, 4000);
        }
    }

    const handleChange = e => {
        filtrarClientes(e.target.value)
        setSearchField(e.target.value);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = clientesList.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = async (event, newPage) => {
        setLoadingClientes(true)
        await getClientes(newPage, rowsPerPage)
        setLoadingClientes(false)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        let rowsPerPageNew = event.target.value
        setRowsPerPage(event.target.value)
        getClientes(0, rowsPerPageNew)
    };

    const getClientesCount = useCallback(async () => {

        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" },
        };

        const clienteCount = await fetchClientes(`${API}/cliente-count`, reqOptions)


        if (clienteCount.error) {
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: clienteCount.message })
        } else if (errorClientes) {
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorClientes })
        } else {

            setClientesCount(clienteCount)
        }
    }, [errorClientes, fetchClientes]);
    const getClientesTotal = useCallback(async () => {

        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" },
        };

        const clienteTotal = await fetchClientes(`${API}/cliente`, reqOptions)

        // console.log("clienteTotal:", clienteTotal)

        if (clienteTotal.error) {
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: clienteTotal.message })
        } else if (errorClientes) {
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorClientes })
        } else {
            //console.log('clienteTotal => ', clienteTotal);
            clienteTotal.map(element => {
                if (element.estado !== 1) {
                    if (element.estado === 2) {
                        element.estado = 'Borrador'
                    } else {
                        element.estado = 'Anulado'
                    }
                }
                return element

            });
            setClientesTotal(clienteTotal)
        }
    }, [errorClientes, fetchClientes]);

    const getClientes = useCallback(async (newPage, rowsPerPageNew) => {
        setLoadingClientes(true)
        let bodyAEnviar = {
            pageNumber: !newPage ? 1 : newPage,
            pageCount: rowsPerPageNew === undefined ? 10 : rowsPerPageNew
        }

        const reqOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyAEnviar),
        };

        const clienteData = await fetchClientes(`${API}/cliente`, reqOptions)

        if (clienteData.error) {

            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: clienteData.message })
        } else if (errorClientes) {

            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorClientes })
        } else {
            if (clienteData.length > 0) {

                clienteData.map(element => {
                    if (element.estado !== 1) {
                        if (element.estado === 2) {
                            element.estado = 'Borrador'
                        } else {
                            element.estado = 'Anulado'
                        }
                    }
                    return element
    
                });
                setClientesList(clienteData)
                setLoadingClientes(false)
            }

        }
    }, [errorClientes, fetchClientes]);


    const isSelected = (nombre) => selected.indexOf(nombre) !== -1;

    const refreshClientes = async () => {
    
        setClienteListLength(false)
        setSearchField("")
        await getClientes();
        setMostrarPaginacion(true)
    }
    const limpiarClientes = () => {

        setClienteListLength(false)
        setSearchField("")
        getClientes();
        setMostrarPaginacion(true)

    }
    React.useEffect(() => {
        getClientes();
        getClientesCount();
        getClientesTotal()
    }, [getClientes,getClientesCount,getClientesTotal])

    return (
        <>
        <Alert open={alert} setOpen={setAlert} alertOptions={alertOptions}></Alert>
        <Typography variant="h6" gutterBottom sx={{ ml: 15, mt: 3, mr: 3, mb: 2 }} color='primary'>
            Clientes
        </Typography>
            <Card size="small" sx={{ minWidth: 275, mb: 1 }}>
                <CardContent>
                    <Grid container direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}>



                    </Grid>
                    <Box m={1}
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                        display="flex">

                        <FormControl sx={{ ml: 2, mt: 3, width: '95ch' }} onClick={limpiarClientes}>
                            <InputLabel htmlFor='outlined-adornment-amount'>Filtro de Búsqueda</InputLabel>
                            <OutlinedInput
                                onChange={handleChange}
                                type="search"
                                noValidate
                                value={searchField}
                                sx={{ mt: 2 }}
                                startAdornment={<InputAdornment position='end'  >
                                    <SearchIcon />
                                </InputAdornment>}
                                label='Search' />
                        </FormControl>
                        <Button startIcon={<CachedIcon />} sx={{ mt: 3, mr: 3 }} variant="text" color='primary' onClick={refreshClientes} disabled={loadingClientes}>
                            Refrescar
                        </Button>
                    </Box>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
               
                    {
                        loadingClientes === true ?
                            <Stack alignItems="center" sx={{ marginTop: "25px" }}>
                                <CircularProgress /> Cargando...
                            </Stack>
                            :
                            <TableContainer>
                            <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={'medium'}
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={clientesList.length} />
                            <TableBody>
                                {stableSort(clientesList, getComparator(order, orderBy))

                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleClick(event, row.nombre)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                            >
                                                <TableCell>
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                >
                                                    {row.id}
                                                </TableCell>
                                                <TableCell align="left">{row.nombre} {row.estado !== 1 ? ((<Chip label={row.estado === 'Borrador' ? 'Borrador' : row.estado === 'Anulado' ? 'Anulado' : ''} color={row.estado === 'Borrador' ? "warning" : "error"} variant="outlined" />)) : ''}</TableCell>
                                                <TableCell align="left">{row.tenant.nombre}</TableCell>
                                            </TableRow>
                                        );
                                    })}

                            </TableBody>
                        </Table>
                            
                            </TableContainer>
                         
                    }
                    {
                        clienteListlength === 0 && loadingClientes === false ?
                            <Stack alignItems="center">
                                <Lottie
                                    loop
                                    animationData={lottieJson}
                                    play
                                    style={{ width: 250, height: 250, flex: 1 }} />
                                <h4>Cliente no encontrado</h4>
                            </Stack>
                            : ''
                    }
                    {mostrarPaginacion ? <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={clientesCount.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage} /> : ''}
                </CardContent>
            </Card></>
    );
}