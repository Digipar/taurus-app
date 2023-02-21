import React, { useState, useEffect, useCallback } from 'react'
import { Card, TextField, Stack } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Alert from '../components/Alert';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ReplayIcon from '@mui/icons-material/Replay';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import MenuItem from '@mui/material/MenuItem';
import useFetch from '../hooks/use-fetch';
import { API } from '../config';




const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    // textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const MovimientoFiltro = (props) => {
    // console.log("~ props:", props)

    const [errorCliente, setErrorCliente] = useState(null)
    const [clienteSeleccionado, setClienteSeleccionado] = useState({ id: "", label: "" });
    const [clientes, setClientes] = useState([]);
    const [articulo, setArticulo] = useState('');
    const [estado, setEstado] = useState('');
    const [fechaMov, setFechaMov] = useState('');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [movimientoId, setMovimientoId] = useState('');
    const [articulos, setArticulos] = useState([]);
    const [alert, setAlert] = React.useState(false);
    const [alertOptions, setAlertOptions] = React.useState({});
    const { fetchData: fetchMovimiento, error: errorMovimiento, loading: loadingMovimiento } = useFetch();


    useEffect(() => {
        let clientesTemp = [];
        props.clientes.map((cliente) => {
            return clientesTemp.push({ id: cliente.id, label: cliente.nombre, })
        })
        setClientes([...clientesTemp])
    }, [props.clientes])

    // useEffect(() => {
    //     const articulosTemp = [];
    //     props.articulos.map((articulo) => {
    //         articulosTemp.push({ id: articulo.id, label: articulo.descripcion })
    //     })
    //     setArticulos([...articulosTemp])
    // }, [props.articulos])

    useEffect(() => {
        setErrorCliente("");
        console.log('estado seleccionado => ', estado);
        // console.log('articulo selecionado => ', articulo);
        // console.log('cliente seleccionado => ', clienteSeleccionado);
    }, [clienteSeleccionado, articulo, estado])

    const limpiarFiltro = () => {
        setArticulo('');
        setEstado('');
        setClienteSeleccionado({ id: "", label: "" });
        props.getMovimientos()
    }

    const filtrarMovimientos = async () => {


        let filterData = {}

        if (movimientoId !== '') {
            filterData = {
                ...filterData,
                id: movimientoId
            }
        }

        if (estado !== '') {
            filterData = {
                ...filterData,
                estado: estado === 'Activo' ? 1 : estado === 'Borrador' ? 2 : 0
            }
        }


        // if(clienteSeleccionado && clienteSeleccionado?.id && clienteSeleccionado.id !== null){
        //     filterData = {
        //         ...filterData,
        //         clienteId: clienteSeleccionado.id
        //     }
        // }

        // if(articulo !== ''){
        //     filterData = {
        //        ...filterData,
        //        articuloId: articulo
        //     }
        // }


        //? COMO LLEGA "2023-02-15T20:44:39.000Z"
        if (fechaDesde !== '') {
            console.log('fechaDesde: ', fechaDesde)
        } else {
            console.log('no hay fecha Desde')
        }

        if (fechaHasta !== '') {
            console.log('fechaHasta: ', fechaHasta)
        } else {
            console.log('no hay fecha Hasta')
        }

        const reqOptions = {
            method: 'POST',
            body: JSON.stringify({
                filter: { ...filterData }
            }),
            headers: { "Content-Type": "application/json" }
        };

        console.log('Filtro final => ', JSON.parse(reqOptions.body));

        // const movimientoData = await fetchMovimiento(`${API}/movimiento`, reqOptions)

        // if (movimientoData.error) {
        //     setAlert(true);
        //     setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: movimientoData.message })
        //     return;
        // }

        // if (errorMovimiento) {
        //     setAlert(true);
        //     setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorMovimiento })
        //     return;
        // }


        // props.onFilter(movimientoData)

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
                                <Item>
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
                                </Item>

                                <Item>
                                    <Grid item={true} >
                                        <FormControl fullWidth >
                                            <Autocomplete
                                                id="cliente"
                                                name="cliente"
                                                // filterOptions={(x) => x}
                                                options={clientes}
                                                isOptionEqualToValue={(option, value) => option.label === value.label}
                                                onChange={(event, newValue) => {
                                                    setClienteSeleccionado(newValue)
                                                }}
                                                value={clienteSeleccionado}
                                                sx={{ width: "240px" }}
                                                renderInput={(params) => <TextField {...params} label="Clientes" />}
                                            />
                                            {
                                                errorCliente && (
                                                    <p>{
                                                        errorCliente
                                                    }</p>
                                                )
                                            }
                                        </FormControl>
                                    </Grid>
                                </Item>
                                <Item>
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
                                                sx={{ width: "180px" }}
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
                                </Item>
                                <Item>
                                    <Grid item={true} >
                                        <FormControl fullWidth >
                                            <TextField
                                                name="fechaDesde"
                                                id="fechaDesde"
                                                label="Desde"
                                                type="date"
                                                value={fechaDesde}
                                                required
                                                onChange={(e) => setFechaDesde(e.target.value)}
                                                sx={{ width: "150px" }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Item>
                                <Item>
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
                                                sx={{ width: "150px" }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Item>
                            </Grid>

                            <Stack
                                sx={{ mt: 2 }}
                                direction="row"
                                alignItems="center"
                                spacing={1}
                            >

                                <Button startIcon={<ManageSearchIcon />} variant="text" color='primary' onClick={filtrarMovimientos}>
                                    Buscar
                                </Button>

                                <Button startIcon={<ReplayIcon />} variant="text" color='primary' onClick={limpiarFiltro}>
                                    Limpiar
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