
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
import Stack from '@mui/material/Stack';
import Lottie from 'react-lottie-player'
import lottieJson from '../img/lottie.json'
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

const encabezadoTenants = [
    {
        id: 'id',
        numeric: false,
        disablePadding: true,
        label: 'Id',
    },
    {
        id: 'nombre',
        numeric: false,
        disablePadding: false,
        label: 'Nombre',
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
                {encabezadoTenants.map((encabezado) => (
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
    const [tenantsList, setTenantsList] = React.useState([]);
    const [tenantsCount, setTenantsCount] = React.useState([]);
    const [tenantsTotal, setTenantsTotal] = React.useState([]);
    const [mostrarPaginacion, setMostrarPaginacion] = React.useState(true);
    const [searchField, setSearchField] = React.useState("");
    const [alert, setAlert] = React.useState(false);
    const [alertOptions, setAlertOptions] = React.useState({});
    const { fetchData: fetchTenants, error: errorTenants } = useFetch();
    const [tenantListlength, setTenantListLength] = React.useState(false);
    const [loadingTenants, setLoadingTenants] = React.useState(false);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const filtrarTenants = (searchField) => {
        const tenantsList = tenantsTotal.filter(
            tenant => {
                return (
                    tenant.nombre
                        .toLowerCase()
                        .match(searchField.toLowerCase())
                );
            }
        );
       
        if (tenantsList.length) {
            setTimeout(function () {
                setTenantsList(tenantsList)
                setMostrarPaginacion(false)
            }, 4000);
        } else {
            console.log('aca')
            setTimeout(function () {
                setTenantsList(tenantsList)
                setTenantListLength(0)
                setLoadingTenants(false)
                setMostrarPaginacion(false)
            }, 4000);
        }
    }
    const refreshTenants = async () => {
        setTenantListLength(false)
        setSearchField("")
        setTenantsList([]);
        await getTenants();
        setMostrarPaginacion(true)
    }

    const handleChange = e => {
        filtrarTenants(e.target.value)
        setSearchField(e.target.value);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = tenantsList.map((n) => n.id);
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
        setLoadingTenants(true)
        await getTenants(newPage, rowsPerPage)
        setPage(newPage);
        setLoadingTenants(false)
    };

    const handleChangeRowsPerPage = (event) => {
        let rowsPerPageNew = event.target.value
        setRowsPerPage(event.target.value)
        getTenants(0, rowsPerPageNew)
    };

    const getTenantsCount = useCallback(async () => {

        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" },
        };

        const tenantCount = await fetchTenants(`${API}/tenant-count`, reqOptions)
        if (tenantCount.error) {
            // eslint-disable-line
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: tenantCount.message })
        } else if (errorTenants) {
            // eslint-disable-line
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorTenants })
        } else {
            setTenantsCount(tenantCount)
        }
    }, [errorTenants, fetchTenants]);

    const getTenantsTotal = useCallback(async () => {

        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" },
        };

        const tenantsTotal = await fetchTenants(`${API}/tenant`, reqOptions)
        if (tenantsTotal.error) {

            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: tenantsTotal.message })
        } else if (errorTenants) {

            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorTenants })
        } else {

            tenantsTotal.map(element => {
                if (element.estado !== 1) {
                    if (element.estado === 2) {
                        element.estado = 'Borrador'
                    } else {
                        element.estado = 'Anulado'
                    }
                }
                return element

            });
            setTenantsTotal(tenantsTotal)
        }
    }, [errorTenants, fetchTenants]);

    const getTenants = useCallback(async (newPage, rowsPerPageNew) => {
        setLoadingTenants(true)
        let bodyAEnviar = {
            pageNumber: !newPage ? 1 : newPage,
            pageCount: !rowsPerPageNew ? 10 : rowsPerPageNew
        }

        const reqOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyAEnviar),
        };

        const tenantData = await fetchTenants(`${API}/tenant`, reqOptions)

        if (tenantData.error) {
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: tenantData.message })

        } else if (errorTenants) {
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorTenants })
        } else {
            if (tenantData.length > 0) {
                tenantData.map(element => {
                    if (element.estado !== 1) {
                        if (element.estado === 2) {
                            element.estado = 'Borrador'
                        } else {
                            element.estado = 'Anulado'
                        }
                    }
                    return element
                });

                setTenantsList(tenantData)
                setLoadingTenants(false)
            }

        }
    }, [errorTenants, fetchTenants]);




    const isSelected = (descripcion) => selected.indexOf(descripcion) !== -1;

    const limpiarTenants = () => {
        setTenantListLength(false)
        setSearchField("")
        setTenantsList([]);
        getTenants();
        setMostrarPaginacion(true)
    }


    React.useEffect(() => {
        getTenants();
        getTenantsCount();
        getTenantsTotal()
    }, [getTenants, getTenantsCount, getTenantsTotal])

    return (

        <>
            <Alert open={alert} setOpen={setAlert} alertOptions={alertOptions}></Alert>
            <Typography variant="h6" gutterBottom sx={{ ml: 15, mt: 3, mr: 3, mb: 2 }} color='primary'>
                Tenants
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

                        <FormControl sx={{ ml: 2, mt: 3, width: '110ch' }} onClick={limpiarTenants}>
                            <InputLabel htmlFor='outlined-adornment-amount'>Filtro de Búsqueda</InputLabel>
                            <OutlinedInput
                                onChange={handleChange}
                                type="search"
                                noValidate
                                value={searchField}
                                sx={{ mt: 2 }}
                                startAdornment={<InputAdornment position='end'>
                                    <SearchIcon />
                                </InputAdornment>}
                                label='Search' />
                        </FormControl>
                        <Button startIcon={<CachedIcon />} sx={{ mt: 3, mr: 3 }} variant="text" color='primary' onClick={refreshTenants} disabled={loadingTenants}>
                            Refrescar
                        </Button>
                    </Box>
                </CardContent>
            </Card>
            <Card>
                <CardContent>

                    {
                        loadingTenants === true ?
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
                                    rowCount={tenantsList.length} />

                                <TableBody>
                                    {stableSort(tenantsList, getComparator(order, orderBy))

                                        .map((row, index) => {
                                            const isItemSelected = isSelected(row.id);
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    onClick={(event) => handleClick(event, row.descripcion)}
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

                                                </TableRow>
                                            );
                                        })}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                    {
                        tenantListlength === 0 && loadingTenants === false ?
                            <Stack alignItems="center">
                                <Lottie
                                    loop
                                    animationData={lottieJson}
                                    play
                                    style={{ width: 250, height: 250, flex: 1 }} />
                                <h4>Tenant no encontrado</h4>
                            </Stack>
                            : ''                            
                    }

                    {mostrarPaginacion ? <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={tenantsCount.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage} /> : ''}
                </CardContent>
            </Card></>
    );
}