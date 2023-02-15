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

const encabezadoArticulos = [
    {
        id: 'id',
        numeric: false,
        disablePadding: true,
        label: 'Id',
    },
    {
        id: 'descripcion',
        numeric: false,
        disablePadding: false,
        label: 'Descripción',
    },
    {
        id: 'descripcionAdicional',
        numeric: false,
        disablePadding: false,
        label: 'Descripción Adicional',
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
                {encabezadoArticulos.map((encabezado) => (
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
                Listado de Articulos
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
    const [articulosList, setArticulosList] = React.useState([]);
    const [articulosCount, setArticulosCount] = React.useState([]);
    const [articulosTotal, setArticulosTotal] = React.useState([]);
    const [alertOptions, setAlertOptions] = React.useState({});  
    const [mostrarPaginacion, setMostrarPaginacion] = React.useState(true);
    const [searchField, setSearchField] = React.useState("");
    const [alert, setAlert] = React.useState(false);
    const { fetchData: fetchArticulos, error: errorArticulos, loading: loadingArticulos } = useFetch();
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const filtrarArticulos = (searchField) => {
        const articulosList = articulosTotal.filter(
            articulo => {
                return (
                    articulo.descripcion
                        .toLowerCase()
                        .includes(searchField.toLowerCase())

                );
            }
        );
        if (articulosList.length) {
            setTimeout(function () {
                setArticulosList(articulosList)
                setMostrarPaginacion(false)
            }, 3000);
        }
    }


    const handleChange = e => {

        filtrarArticulos(e.target.value)
        setSearchField(e.target.value);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = articulosList.map((n) => n.id);
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

        getArticulos(newPage,rowsPerPage)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        let rowsPerPageNew = event.target.value
        setRowsPerPage(event.target.value)
        getArticulos(0, rowsPerPageNew)
    };

    const getArticulosCount = React.useCallback(async () => {

        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" },
        };

        const articuloCount = await fetchArticulos(`${API}/articulo-count`, reqOptions)


        if (articuloCount.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: articuloCount.message })
        } else if (errorArticulos) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorArticulos })
        } else {

            setArticulosCount(articuloCount)
        }
    }, [errorArticulos, fetchArticulos]);
    const getArticulosTotal = React.useCallback(async () => {

        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" },
        };

        const articuloTotal = await fetchArticulos(`${API}/articulo`, reqOptions)


        if (articuloTotal.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: articuloTotal.message })
        } else if (errorArticulos) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorArticulos })
        } else {
            //console.log('articuloTotal => ', articuloTotal);
            articuloTotal.map(element => {
                if(element.estado !=1){
                    if (element.estado ==2){
                        element.estado ='Borrador'
                    }else{
                        element.estado='Anulado'
                    }
                }          
                
            });
            setArticulosTotal(articuloTotal)
        }
    }, [errorArticulos, fetchArticulos]);

    const getArticulos = React.useCallback(async (newPage, rowsPerPageNew) => {

        let bodyAEnviar = {
            pageNumber: !newPage ? 0 : newPage,
            pageCount: !rowsPerPageNew ? 10 : rowsPerPageNew
        }

        const reqOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyAEnviar),
        };

        const articuloData = await fetchArticulos(`${API}/articulo`, reqOptions)

        console.log("Articulo => ", articuloData);
        
        if (articuloData.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: articuloData.message })
        } else if (errorArticulos) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorArticulos })
        } else {

              articuloData.map(element => {
                if(element.estado !=1){
                    if (element.estado ==2){
                        element.estado ='Borrador'
                    }else{
                        element.estado='Anulado'
                    }
                }          
                
            });

            setArticulosList(articuloData)
        }
    }, [errorArticulos, fetchArticulos]);


    const isSelected = (descripcion) => selected.indexOf(descripcion) !== -1;

    const refreshArticulos = () => {
        setSearchField("")
        setArticulosList([]);
        getArticulos();
        setMostrarPaginacion(true)
    }
    const limpiarArticulos=()=>{
        setSearchField("")
        getArticulos();
        setMostrarPaginacion(true)
    }


    React.useEffect(() => {
        getArticulos();
        getArticulosCount();
        getArticulosTotal()
    }, [])

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 5 }}>
                <Grid container justifyContent="flex-end">
                    <Button startIcon={<CachedIcon />} sx={{ mt: 3, mr: 3 }} variant="text" color='primary' onClick={refreshArticulos} disabled={loadingArticulos}>
                        Refrescar
                    </Button>
                </Grid>
                <FormControl sx={{ ml: 3, width: '110ch' }}>
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
                <Grid container justifyContent="flex-end">
                    <Button sx={{ mt: 2, mr: 3 }} variant="contained" color='primary' onClick={limpiarArticulos} disabled={loadingArticulos}>
                        Limpiar
                    </Button>
                </Grid>
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
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
                            rowCount={articulosList.length}
                        />
                        <TableBody>
                            {stableSort(articulosList, getComparator(order, orderBy))

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
                                            <TableCell align="left">{row.descripcion} {row.estado!=1?((<Chip label={row.estado=='Borrador'?'Borrador':row.estado=='Anulado'?'Anulado':''} color={row.estado=='Borrador'?"warning":"error"} variant="outlined"/>)):''}</TableCell>
                                            <TableCell align="left">{row.descripcionAdicional}</TableCell>                                         
                                        </TableRow>
                                    );
                                })}

                        </TableBody>

                    </Table>
                </TableContainer>
                {mostrarPaginacion ? <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={articulosCount.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                /> : ''}
            </Paper>
        </Box>
    );
}