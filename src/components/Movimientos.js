import { useCallback, useState, useEffect } from 'react'
import { Button } from '@mui/material';
import { API } from '../config';
import { alpha } from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import useFetch from '../hooks/use-fetch';
import Title from './Title';
import { Link } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import { visuallyHidden } from '@mui/utils';
import {
    Stack,
    Box,
    Card,
    Table,
    TableContainer,
    TableHead, TableBody,
    TableRow, TableCell,
    TableSortLabel,
    TablePagination
} from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import MovimientoFiltro from './MovimientoFiltro';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Lottie from 'react-lottie-player'
import lottieJson from '../img/lottie.json'
// import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import moment from 'moment';



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


const encabezadoMovimientos = [
    {
        id: 'id',
        numeric: false,
        disablePadding: true,
        label: 'ID',
    },
    {
        id: 'articuloId',
        numeric: false,
        disablePadding: false,
        label: 'Articulo',
    },
    {
        id: 'clienteId',
        numeric: false,
        disablePadding: false,
        label: 'Cliente',
    },
    {
        id: 'cantidad',
        numeric: false,
        disablePadding: false,
        label: 'Cantidad',
    },
    {
        id: 'precio',
        numeric: false,
        disablePadding: false,
        label: 'Precio',
    },
    {
        id: 'fecha',
        numeric: false,
        disablePadding: false,
        label: 'Fecha',
    },
    {
        id: 'accion',
        numeric: false,
        disablePadding: false,
        label: 'Acción',
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
                {encabezadoMovimientos.map((encabezado) => (
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


const Movimientos = () => {

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [movimientos, setMovimientos] = useState([]);
    const [movimientosCount, setMovimientosCount] = useState([]);
    const [mostrarPaginacion, setMostrarPaginacion] = useState(true);
    const [loadingMovimientos, setLoadingMovimientos] = useState(false);

    const { fetchData: fetchMovimientos } = useFetch();


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = movimientos.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        // console.log("id:", id)
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
        setLoadingMovimientos(true)
        // console.log("newPage", newPage)
        // console.log("rowsPerPage", rowsPerPage)
        await getMovimientos(newPage, rowsPerPage)
        setLoadingMovimientos(false)

        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        let rowsPerPageNew = event.target.value
        // console.log("rowsPerPageNew =>", rowsPerPageNew)
        setRowsPerPage(event.target.value)
        getMovimientos(0, rowsPerPageNew)
    };

    const getMovimientosCount = useCallback(async () => {

        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" },
        };

        const movimientosCount = await fetchMovimientos(`${API}/movimiento-count`, reqOptions)


        setMovimientosCount(movimientosCount)

    }, [fetchMovimientos]);



    const getMovimientos = useCallback(async (newPage, rowsPerPageNew) => {
        setLoadingMovimientos(true)
        // console.log("MOVIMIENTO GET newPage", newPage)
        // console.log("MOVIMIENTO GET rowsPerPageNew", rowsPerPageNew)

        let bodyPaginacion = {
            pageNumber: !newPage ? 1 : newPage,
            pageCount: rowsPerPageNew === undefined ? 10 : rowsPerPageNew
        }

        // console.log("bodyPaginacion", bodyPaginacion)

        const reqOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyPaginacion),
        };

        const movimientoData = await fetchMovimientos(`${API}/movimiento`, reqOptions)

        if (movimientoData.length > 0) {
            setLoadingMovimientos(false)
        }
        // console.log("movimientoData =>", movimientoData)
        setMovimientos(movimientoData);


    }, [fetchMovimientos]);



    const isSelected = (descripcion) => selected.indexOf(descripcion) !== -1;

    //? Filtro
    const getDataFilter = (dataFiltrada) => {
        setMovimientos(dataFiltrada)
    }

    const resfreshMovimientos = async () => {
        setMovimientos([]);
        await getMovimientos();
        setMostrarPaginacion(true)
    }

    useEffect(() => {
        getMovimientos();
        getMovimientosCount();
    }, [getMovimientos, getMovimientosCount])

    return (
        <>

            <Title>Movimientos
                <Button sx={{ marginLeft: '74% !important' }} color='primary' variant='contained' component={Link} to="/movimiento-registrar" disabled={loadingMovimientos}>
                    Nuevo movimiento
                </Button>
            </Title>

            <MovimientoFiltro getMovimientos={getMovimientos} onFilter={getDataFilter} onRefreshMov={resfreshMovimientos} />

            <Card size="small" sx={{ minWidth: 275 }}>
                <CardContent>

                    {/* <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}
                    >


                        <Button sx={{ marginLeft: '940px !important', marginBottom: '12px' }} startIcon={<CachedIcon />} variant="contained" color='primary' onClick={resfreshMovimientos} >
                            Refrescar
                        </Button>
                    </Stack> */}
                    <Divider />

                    {
                        loadingMovimientos === true ?
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
                                        rowCount={movimientos.length} />
                                    <TableBody>
                                        {stableSort(movimientos, getComparator(order, orderBy))

                                            .map((row, index) => {
                                                const isItemSelected = isSelected(row.id);
                                                const labelId = `enhanced-table-checkbox-${index}`;

                                                return (
                                                    <TableRow
                                                        hover
                                                        onClick={(event) => handleClick(event, row.articulo.descripcion)}
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
                                                        <TableCell align="left">{row.articulo.descripcion} </TableCell>
                                                        <TableCell align="left">{row.cliente.nombre}</TableCell>
                                                        <TableCell align="left">{row.cantidad}</TableCell>
                                                        <TableCell align="left">{row.precio}</TableCell>
                                                        <TableCell align="left">{moment(row.creado).format('DD/MM/YYYY')}</TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Editar">
                                                                <Button startIcon={<ModeEditIcon />}
                                                                    component={Link}
                                                                    to={`/movimiento-editar/${row.id}`}
                                                                    variant="text"
                                                                    color='primary'
                                                                // disabled={loadingMovimientos} 

                                                                />
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}

                                    </TableBody>

                                </Table>
                            </TableContainer>
                    }
                    {
                        movimientos.length === 0 && loadingMovimientos === false ?
                            <Stack alignItems="center">
                                <Lottie
                                    loop
                                    animationData={lottieJson}
                                    play
                                    style={{ width: 250, height: 250, flex: 1 }} />
                                <h4>Movimiento no encontrado</h4>
                            </Stack>
                            : ''
                    }

                    {mostrarPaginacion ?
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50]}
                            component="div"
                            count={movimientosCount.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        : ''}
                </CardContent>
            </Card>
        </>
    )
}

export default Movimientos;