import React, { useState, useEffect } from 'react'
import { Card, TextField, Stack } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import InputLabel from '@mui/material/InputLabel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Alert from '../components/Alert';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import useFetch from '../hooks/use-fetch';
import { API } from '../config';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from "react-router-dom";
import CachedIcon from '@mui/icons-material/Cached';



const MovimientoFiltro = (props) => {
    const [estado, setEstado] = useState('');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [movimientoId, setMovimientoId] = useState('');
    const [alert, setAlert] = React.useState(false);
    const [alertOptions, setAlertOptions] = React.useState({});
    // const [loadingMovimientos, setLoadingMovimientos] = React.useState(false)

    //? API
    const { fetchData: fetchMovimiento, error: errorMovimiento } = useFetch();
    const { fetchData: fetchClientes } = useFetch();
    const { fetchData: fetchArticulos } = useFetch();

    //? Autocomplete 
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState("")

    const [openArt, setOpenArt] = useState(false);
    const [optionsArt, setOptionsArt] = useState([]);
    const [articuloSeleccionado, setArticuloSeleccionado] = useState("")

    const loading = open && options.length === 0;
    const loadingArt = openArt && optionsArt.length === 0;

    //? [Autocomplete] Cliente
    useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {

            const reqOptions = {
                method: 'GET',
                headers: { "Content-Type": "application/json" }
            };

            const clientesData = await fetchClientes(`${API}/cliente`, reqOptions)

            if (active) {
                setOptions([...clientesData]);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading, fetchClientes]);

    //? [Autocomplete] Cliente
    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    //? [Autocomplete] Articulo
    useEffect(() => {
        let activeArt = true;

        if (!loadingArt) {
            return undefined;
        }

        (async () => {

            const reqOptions = {
                method: 'GET',
                headers: { "Content-Type": "application/json" }
            };

            const articulosData = await fetchArticulos(`${API}/articulo`, reqOptions)

            if (activeArt) {
                setOptionsArt([...articulosData]);
            }
        })();

        return () => {
            activeArt = false;
        };
    }, [loadingArt, fetchArticulos]);

    //? [Autocomplete] Articulo
    useEffect(() => {
        if (!openArt) {
            setOptionsArt([]);
        }
    }, [openArt]);


    const limpiarFiltro = () => {
        setMovimientoId('')
        setEstado('');
        setFechaDesde('');
        setFechaHasta('');
        props.getMovimientos()
    }

    //! Filtro
    const filtrarMovimientos = async () => {


        let filterData = {}

        if (movimientoId !== '') {
            filterData = {
                ...filterData,
                id: movimientoId
            }
        }

        if (clienteSeleccionado && clienteSeleccionado?.id && clienteSeleccionado.id !== null) {
            filterData = {
                ...filterData,
                clienteId: clienteSeleccionado.id
            }
        }

        if (estado !== '') {
            filterData = {
                ...filterData,
                estado: estado === 'Activo' ? 1 : estado === 'Borrador' ? 2 : 0
            }
        }

        if (articuloSeleccionado && articuloSeleccionado?.id && articuloSeleccionado.id !== null) {
            filterData = {
                ...filterData,
                articuloId: articuloSeleccionado.id
            }
        }

        if (fechaDesde !== '' && fechaHasta !== '') {

            filterData = {
                ...filterData,
                creado: { $between: [fechaDesde, fechaHasta] }
            }
        }

        // if (fechaDesde === '') {
        //     console.log('falta campo fechaDesde: ');
        // }

        // if (fechaHasta === '') {
        //     console.log('falta campo fechaHasta: ');
        // }

        const reqOptions = {
            method: 'POST',
            body: JSON.stringify({
                filter: { ...filterData }
            }),
            headers: { "Content-Type": "application/json" }
        };

        const movimientoData = await fetchMovimiento(`${API}/movimiento`, reqOptions)

        if (movimientoData.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: movimientoData.message })
            return;
        }

        if (errorMovimiento) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorMovimiento })
            return;
        }



        props.onFilter(movimientoData)

    };


    return (
        <>
            <Alert open={alert} setOpen={setAlert} alertOptions={alertOptions}></Alert>
            <Card size="small" sx={{ minWidth: 275, mb: 1 }}>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Button startIcon={<SearchIcon />} variant="text" color='primary'>
                            Filtro de búsqueda
                        </Button>


                    </AccordionSummary>
                    <AccordionDetails>

                        <Box
                            component="form"
                            sx={{ flexGrow: 1 }}
                        >
                            <Grid container spacing={1} sx={{ marginLeft: 1 }}>

                                <Grid item={true} >
                                    <FormControl fullWidth>
                                        <TextField
                                            // error={errors.movimientoId && true}
                                            // helperText={errors.movimientoId}
                                            name="movimientoId"
                                            id="movimientoId"
                                            label="Id"
                                            type="text"
                                            value={movimientoId}
                                            onChange={(e) => { setMovimientoId(e.target.value) }}
                                            sx={{ width: "150px" }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </FormControl>
                                </Grid>



                                <Grid item={true} >
                                    <FormControl fullWidth  >
                                        <Autocomplete
                                            id="asynchronous-demo"
                                            sx={{ width: "450px" }}
                                            open={open}
                                            onOpen={() => {
                                                setOpen(true);
                                            }}
                                            onClose={() => {
                                                setOpen(false);
                                            }}
                                            isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
                                            getOptionLabel={(option) => option.nombre}
                                            options={options}
                                            loading={loading}
                                            // value={clienteSeleccionado}
                                            onChange={(event, newValue) => {
                                                setClienteSeleccionado(newValue)
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Clientes"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <React.Fragment>
                                                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                                {params.InputProps.endAdornment}
                                                            </React.Fragment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>


                                <Grid item={true} >
                                    <FormControl fullWidth  >
                                        <Autocomplete
                                            id="asynchronous-demo2"
                                            sx={{ width: "450px" }}
                                            open={openArt}
                                            onOpen={() => {
                                                setOpenArt(true);
                                            }}
                                            onClose={() => {
                                                setOpenArt(false);
                                            }}
                                            isOptionEqualToValue={(option, value) => option.descripcion === value.descripcion}
                                            getOptionLabel={(option) => option.descripcion}
                                            options={optionsArt}
                                            loading={loadingArt}
                                            // value={articuloSeleccionado}
                                            onChange={(event, newValue) => {
                                                setArticuloSeleccionado(newValue)
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Articulos"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <React.Fragment>
                                                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                                {params.InputProps.endAdornment}
                                                            </React.Fragment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>


                                <Grid item={true} >
                                    <FormControl fullWidth >
                                        <InputLabel id="estado">Estado</InputLabel>
                                        <Select
                                            labelId="estado"
                                            id="estado"
                                            name="estado"
                                            value={estado}
                                            label="Estado "
                                            onChange={(e) => setEstado(e.target.value)}
                                            sx={{ width: "250px" }}
                                        >
                                            {/* {
                                                    props.movimientos.map(item => {
                                                        return (
                                                            <MenuItem key={item.id} value={item.estado}>{item.estadoDescripcion}</MenuItem>
                                                        )
                                                    })
                                                } */}
                                            <MenuItem key={'Borrador'} value={'Borrador'}>Borrador</MenuItem>
                                            <MenuItem key={'Activo'} value={'Activo'}>Activo</MenuItem>
                                            <MenuItem key={'Anulado'} value={'Anulado'}>Anulado</MenuItem>

                                        </Select>
                                        {/* <FormHelperText>{errors.estado}</FormHelperText> */}
                                    </FormControl>
                                </Grid>


                                <Grid item={true} >
                                    <FormControl fullWidth >
                                        <TextField
                                            name="fechaDesde"
                                            id="fechaDesde"
                                            label="Desde"
                                            type="date"
                                            format="dd/mm/yyyy"
                                            value={fechaDesde}
                                            required
                                            onChange={(e) => setFechaDesde(e.target.value)}
                                            sx={{ width: "171px" }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </FormControl>
                                </Grid>


                                <Grid item={true} >
                                    <FormControl fullWidth >
                                        <TextField
                                            name="fechaHasta"
                                            id="fechaHasta"
                                            label="Hasta"
                                            type="date"
                                            value={fechaHasta}
                                            required
                                            onChange={(e) => setFechaHasta(e.target.value)}
                                            sx={{ width: "171px" }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                            </Grid>

                            <Stack
                                sx={{ mt: 2, ml: 2 }}
                                direction="row"
                                alignItems="right"
                                spacing={1}
                            >

                                <Button variant='contained' color='primary' onClick={filtrarMovimientos}>
                                    Buscar
                                </Button>

                                <Button variant='contained' color='primary' onClick={limpiarFiltro}>
                                    Limpiar
                                </Button>
                                <Button sx={{ marginLeft: '74% !important' }} startIcon={<CachedIcon />} variant="text" color='primary' onClick={props.onRefreshMov} disabled={props.loadingMovimientos}>
                                    Refrescar
                                </Button>
                            </Stack>
                    

                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Card>
        </>
    )
}

export default MovimientoFiltro