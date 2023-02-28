import React, { useState, useEffect, useCallback } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import Button from "@mui/material/Button";
import FormHelperText from '@mui/material/FormHelperText';
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { API } from '../config';
import useFetch from '../hooks/use-fetch';
import { useNavigate } from 'react-router-dom';
import Title from './Title';


const MovimientoForm = (props) => {
    const { id } = useParams();
    const user = useAuth();
    // const userData = JSON.parse(user.user);
    const navigate = useNavigate();

     console.log("user", user);

    const { fetchData: fetchMovimiento, error: errorMovimiento, loading: loadingMovimiento } = useFetch();
    const { fetchData: fetchUpdateMovimiento, error: errorUpdateMovimiento, loading: loadingUpdateMovimiento } = useFetch();

    const [movLoading, setMovLoading] = React.useState(false)
    const [clientes, setClientes] = useState([]);
    const [articulos, setArticulos] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = React.useState({ id: "", label: "" });
    const [articuloSeleccionado, setArticuloSeleccionado] = React.useState({ id: "", label: "" });
    const [initialValues, setInitialValues] = React.useState({
        cliente: "",
        articulo: "",
        cantidad: "",
        precio: ""
    });
    // const [editNewValues, setEditNewValues] = React.useState({});
    const [alert, setAlert] = React.useState(false);
    const [alertOptions, setAlertOptions] = React.useState({});
    const [errorCliente, setErrorCliente] = useState(null)
    const [errorArticulo, setErrorArticulo] = useState(null)
    const [modoEditar, setModoEditar] = useState(false)


    const getMovimientoById = useCallback(async () => {
        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        };

        const movimientoData = await fetchMovimiento(`${API}/movimiento/${id}`, reqOptions)

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

        let movDataEditar = {
            cliente: clienteSeleccionado.id,
            articulo: articuloSeleccionado.id,
            cantidad: movimientoData.cantidad,
            precio: +movimientoData.precio,
        }

        // initial values = estructura form (ej. name)
        setInitialValues(movDataEditar);

        // Necesario para el autocomplete 
        setClienteSeleccionado({ id: movimientoData.cliente.id, label: movimientoData.cliente.nombre });
        setArticuloSeleccionado({ id: movimientoData.articulo.id, label: movimientoData.articulo.descripcion });


    }, []);


    const updateMovimiento = async () => {

        let movEditFinal = {
            clienteId: clienteSeleccionado.id,
            articuloId: articuloSeleccionado.id,
            cantidad: formik.values.cantidad,
            precio: +formik.values.precio,
        }

        // console.log('objFinal', objFinal)

        const reqOptions = {
            method: 'PUT',
            body: JSON.stringify(movEditFinal),
            headers: { "Content-Type": "application/json" }
        };

        // console.log("BODY UPDATE => ", JSON.parse(reqOptions.body))

        const updateMovimientoData = await fetchUpdateMovimiento(`${API}/movimiento/${id}`, reqOptions);

        if (updateMovimientoData.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: updateMovimientoData.message })
            return;
        }

        if (errorUpdateMovimiento) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorUpdateMovimiento })
            return;
        }

        setAlert(true);
        setAlertOptions({ tipo: 'success', titulo: 'Éxito', mensaje: 'Movimiento actualizado con éxito!' })
        navigate('/movimientos')

    }


    useEffect(() => {
        if (id) {
            setModoEditar(true);
            getMovimientoById();
        }
    }, [])

    useEffect(() => {
        // console.log('clienteSeleccionado?.id', clienteSeleccionado)
        setErrorCliente("");
    }, [clienteSeleccionado])

    useEffect(() => {
        // console.log('articuloSeleccionado?.id', articuloSeleccionado?.id)
        setErrorArticulo("");
    }, [articuloSeleccionado])

    useEffect(() => {
        let clientesTemp = [];
        props.clientes.map((cliente) => {
            return clientesTemp.push({ id: cliente.id, label: cliente.nombre, })
        })
        setClientes([...clientesTemp])
    }, [props.clientes])

    useEffect(() => {
        const articulosTemp = [];
        props.articulos.map((articulo) => {
            articulosTemp.push({ id: articulo.id, label: articulo.descripcion })
        })
        setArticulos([...articulosTemp])
    }, [props.articulos])


    const formik = useFormik({

        initialValues: initialValues,
        enableReinitialize: true,

        validationSchema: Yup.object({
            precio: Yup.number()
                .required('Campo precio es requerido.'),
            cantidad: Yup.number()
                .required('Campo cantidad es requerido.'),
            // articulo: Yup.string()
            //     .required("El campo articulo es requerido."),

        })
    })

    formik.handleSubmit = (e) => {
        e.preventDefault();

        //! Editar movimiento
        if (modoEditar) {
            updateMovimiento();
        }

        if (!modoEditar && !clienteSeleccionado?.id) {
            setErrorCliente("Seleccione un cliente");
        }

        if (!modoEditar && !articuloSeleccionado?.id) {
            setErrorArticulo("Seleccione un articulo");
        }

        //! Crear movimiento
        if (!modoEditar && clienteSeleccionado?.id && articuloSeleccionado?.id) {
            // console.log('CREA MOVIMIENTO')
            formik.values.cliente = clienteSeleccionado.id
            formik.values.articulo = articuloSeleccionado.id
            let movData = {
                clienteId: formik.values.cliente,
                articuloId: formik.values.articulo,
                cantidad: formik.values.cantidad,
                precio: formik.values.precio,
                // creadoPor: userData ? userData?.userId : '',
                // modificadoPor: userData ? userData?.userId : '',
                creado: new Date(),
                modificado: new Date()
            }

            // console.log("data final para crear =>", movData)

            props.registrarMovimiento(movData)

        }

    }




    return (
        <>
            {
                id ? <Title>Editar movimiento</Title> : <Title>Registrar movimiento</Title>
            }
            <Box
                component="form" onSubmit={formik.handleSubmit}
                sx={{ marginTop: 2 }}
            >

                <FormControl fullWidth sx={{ marginTop: 2 }}>

                    <Autocomplete
                        id="cliente"
                        name="cliente"
                        options={clientes}
                        isOptionEqualToValue={(option, value) => option.label === value.label}
                        onChange={(event, newValue) => {
                            setClienteSeleccionado(newValue)
                        }}
                        value={clienteSeleccionado}
                        sx={{ width: "*" }}
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

                <FormControl fullWidth sx={{ marginTop: 2 }}>
                    <Autocomplete
                        id="articulo"
                        name="articulo"
                        options={articulos}
                        isOptionEqualToValue={(option, value) => option.label === value.label}
                        onChange={(event, newValue) => {
                            setArticuloSeleccionado(newValue)
                        }}
                        value={articuloSeleccionado}
                        sx={{ width: "*" }}
                        renderInput={(params) => <TextField {...params} label="Articulos" />}
                    />
                    {
                        errorArticulo && (
                            <p>{
                                errorArticulo
                            }</p>
                        )
                    }
                </FormControl>

                <FormControl fullWidth sx={{ marginTop: 2 }}>
                    <TextField
                        error={formik.errors.cantidad && true}
                        helperText={formik.errors.cantidad}
                        name="cantidad"
                        id="cantidad"
                        label="Cantidad"
                        type="number"
                        inputProps={{ step: 1 }}
                        value={formik.values.cantidad}
                        onChange={formik.handleChange}
                        required

                    />
                </FormControl>

                <FormControl fullWidth sx={{ marginTop: 2 }}>
                    <TextField
                        error={formik.errors.precio && true}
                        helperText={formik.errors.precio}
                        name="precio"
                        id="precio"
                        label="Precio"
                        type="number"
                        inputProps={{ step: 1, min: 0 }}
                        value={formik.values.precio}
                        onChange={formik.handleChange}
                        required
                    />
                </FormControl>


                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                >
                    <Button
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        type="submit"
                        disabled={movLoading}
                    >
                        Grabar
                    </Button>
                    <Button
                        variant="outlined"
                        component={Link}
                        to="/movimientos"
                        disabled={props.dataSaving}
                    >
                        Volver
                    </Button>
                </Stack>
            </Box>
        </>
    )
}

export default MovimientoForm;