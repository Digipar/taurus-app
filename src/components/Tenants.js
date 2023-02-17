import * as React from 'react';
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
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
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
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

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
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
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
                Listado de Tenants
            </Typography>

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Lista Filtrada">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
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
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [tenantsList, setTenantsList] = React.useState([]);
    const [tenantsCount, setTenantsCount] = React.useState([]);
    const [tenantsTotal, setTenantsTotal] = React.useState([]);
    const [alertOptions, setAlertOptions] = React.useState({});
    const [isShown, setIsShown] = React.useState(false);
    const [mostrarPaginacion, setMostrarPaginacion] = React.useState(true);
    const [searchField, setSearchField] = React.useState("");
    const [alert, setAlert] = React.useState(false);
    const { fetchData: fetchTenants, error: errorTenants, loading: loadingTenants } = useFetch();
    const [tenantListlength, setTenantListLength] = React.useState(false);

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
                        .includes(searchField.toLowerCase())
                );
            }
        );
        //console.log('tenantsList', tenantsList)
        if (tenantsList.length) {
            setTimeout(function () {
                setTenantsList(tenantsList)
                setMostrarPaginacion(false)
            }, 3000);
        }else {
            setTimeout(function () {
                setTenantListLength(true)
            }, 2000);
        }
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

    const handleChangePage = (event, newPage) => {

        getTenants(newPage,rowsPerPage)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        let rowsPerPageNew = event.target.value
        setRowsPerPage(event.target.value)
        getTenants(0, rowsPerPageNew)
    };

    const getTenantsCount = React.useCallback(async () => {

        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" },
        };

        const tenantCount = await fetchTenants(`${API}/tenant-count`, reqOptions)
        if (tenantCount.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: tenantCount.message })
        } else if (errorTenants) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorTenants })
        } else {
            setTenantsCount(tenantCount)
        }
    }, [errorTenants, fetchTenants]);

    const getTenantsTotal = React.useCallback(async () => {

        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" },
        };

        const tenantsTotal = await fetchTenants(`${API}/tenant`, reqOptions)
        if (tenantsTotal.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: tenantsTotal.message })
        } else if (errorTenants) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorTenants })
        } else {
         
            tenantsTotal.map(element => {
                if(element.estado !=1){
                    if (element.estado == 2){
                        element.estado ='Borrador'
                    }else{
                        element.estado='Anulado'
                    }
                }          
                
            });
            setTenantsTotal(tenantsTotal)
        }
    }, [errorTenants, fetchTenants]);

    const getTenants = React.useCallback(async (newPage, rowsPerPageNew) => {

        let bodyAEnviar = {
            pageNumber: !newPage ? 0 : newPage,
            pageCount: !rowsPerPageNew ? 10 : rowsPerPageNew
        }

        const reqOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyAEnviar),
        };

        const tenantData = await fetchTenants(`${API}/tenant`, reqOptions)

        if (tenantData.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: tenantData.message })
        } else if (errorTenants) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorTenants })
        } else {
            tenantData.map(element => {
                if(element.estado !=1){
                    if (element.estado == 2){
                        element.estado ='Borrador'
                    }else{
                        element.estado='Anulado'
                    }
                }          
                
            });

            setTenantsList(tenantData)
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
    }, [])

    return (
        <Card size="small" sx={{ minWidth: 275 }}>
        <CardContent>
            <Grid container justifyContent="flex-end">
                <Button startIcon={<CachedIcon />} sx={{ mt: 3, mr: 3 }} variant="text" color='primary' onClick={limpiarTenants} disabled={loadingTenants}>
                    Refrescar
                </Button>
            </Grid>
            <Box m={1}
                display="flex"
                justifyContent="flex-end"
                alignItems="flex-end">

                <FormControl sx={{ m: 2, width: '110ch' }}>
                    <InputLabel htmlFor='outlined-adornment-amount'>Filtro de Búsqueda</InputLabel>
                    <OutlinedInput
                        onChange={handleChange}
                        type="search"
                        noValidate
                        value={searchField}
                        sx={{ mt: 1 }}
                        startAdornment={
                            <InputAdornment position='end'>
                                <SearchIcon />
                            </InputAdornment>
                        }
                        label='Search'
                    />
                </FormControl>
            </Box>
                <Grid container justifyContent="flex-end">
                    <Button sx={{ mt: 2, mr: 3 }} variant="contained" color='primary' onClick={limpiarTenants} disabled={loadingTenants}>
                        Limpiar
                    </Button>
                </Grid>
                <EnhancedTableToolbar numSelected={selected.length} />
                {!tenantListlength ?<TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={tenantsList.length}
                        />
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
                                            <TableCell align="left">{row.nombre} {row.estado!=1?((<Chip label={row.estado=='Borrador'?'Borrador':row.estado=='Anulado'?'Anulado':''} color={row.estado=='Borrador'?"warning":"error"} variant="outlined"/>)):''}</TableCell>
                                        
                                        </TableRow>
                                    );
                                })}

                        </TableBody>

                    </Table>
                </TableContainer>: <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert variant="outlined" severity="warning">
                    Cliente no encontrado
                </Alert>

            </Stack>}
                {mostrarPaginacion ? <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={tenantsCount.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                /> : ''}
                </CardContent>
                </Card>
    );
}