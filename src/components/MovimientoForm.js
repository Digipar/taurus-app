import React, { useState, useEffect, useCallback } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Alert from '../components/Alert';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Button from "@mui/material/Button";
import FormHelperText from '@mui/material/FormHelperText';
import { Link, useParams } from "react-router-dom";
import { API } from '../config';
import useFetch from '../hooks/use-fetch';
import { useNavigate } from 'react-router-dom';
import Title from './Title';


const MovimientoForm = (props) => {
    const { id } = useParams();
    // const user = useAuth();
    const navigate = useNavigate();

    //  console.log("enc user", user);

    const [alert, setAlert] = React.useState(false);
    const [alertOptions, setAlertOptions] = React.useState({});

    const { fetchData: fetchMovimiento, error: errorMovimiento, loading: loadingMovimiento } = useFetch();
    const { fetchData: fetchUpdateMovimiento, error: errorUpdateMovimiento } = useFetch();

    const [initialValues, setInitialValues] = React.useState({
        cliente: "",
        articulo: "",
        cantidad: "",
        precio: ""
    });

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
            cliente: movimientoData.cliente.id,
            articulo: movimientoData.articulo.id,
            cantidad: movimientoData.cantidad,
            precio: +movimientoData.precio,
        }

        setInitialValues(movDataEditar);

    }, [errorMovimiento, fetchMovimiento, id]);


    const updateMovimiento = async () => {

        let movEditFinal = {
            clienteId: formik.values.cliente,
            articuloId: formik.values.articulo,
            cantidad: formik.values.cantidad,
            precio: +formik.values.precio,
        }

        const reqOptions = {
            method: 'PUT',
            body: JSON.stringify(movEditFinal),
            headers: { "Content-Type": "application/json" }
        };

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
    }, [getMovimientoById, id])


    const formik = useFormik({

        initialValues: initialValues,
        enableReinitialize: true,

        validationSchema: Yup.object({
            precio: Yup.number()
                .required('Campo precio es requerido.'),
            cantidad: Yup.number()
                .required('Campo cantidad es requerido.'),
            cliente: Yup.string()
                .required("El campo cliente es requerido."),
            articulo: Yup.string()
                .required("El campo articulo es requerido.")

        })
    })

    formik.handleSubmit = (e) => {
        e.preventDefault();

        //! Editar movimiento
        if (modoEditar) {
            updateMovimiento();
        }


        //! Crear movimiento
        if (!modoEditar) {

            let movData = {
                clienteId: formik.values.cliente,
                articuloId: formik.values.articulo,
                cantidad: formik.values.cantidad,
                precio: formik.values.precio,
                // creadoPor: user ? user?.userId : '',
                // modificadoPor: user ? user?.userId : '',
                creado: new Date(),
                modificado: new Date()
            }

            // console.log("data final para crear =>", movData)

            props.registrarMovimiento(movData)

        }

    }




    return (
        <React.Fragment>

            <Alert open={alert} setOpen={setAlert} alertOptions={alertOptions}></Alert>

            {
                id ? <Title>Editar movimiento</Title> : <Title>Registrar movimiento</Title>
            }


            <Box
                component="form" onSubmit={formik.handleSubmit}
                sx={{ marginTop: 2 }}
            >

                <FormControl fullWidth error={formik.errors.cliente && true} sx={{ marginTop: 2 }}>
                    <InputLabel id="cliente-sl">Clientes *</InputLabel>
                    <Select
                        labelId="cliente-sl"
                        id="cliente"
                        name="cliente"
                        value={formik.values.cliente}
                        label="Clientes *"
                        onChange={formik.handleChange}
                    >
                        {
                            props.clientes.map(item => {
                                return (
                                    <MenuItem key={item.id} value={item.id}>{item.nombre}</MenuItem>
                                )
                            })
                        }

                    </Select>
                    <FormHelperText>{formik.errors.cliente}</FormHelperText>
                </FormControl>

                <FormControl fullWidth error={formik.errors.articulo && true} sx={{ marginTop: 2 }}>
                    <InputLabel id="articulo-sl">Articulos *</InputLabel>
                    <Select
                        labelId="articulo-sl"
                        id="articulo"
                        name="articulo"
                        value={formik.values.articulo}
                        label="Articulos *"
                        onChange={formik.handleChange}
                    >
                        {
                            props.articulos.map(item => {
                                return (
                                    <MenuItem key={item.id} value={item.id}>{item.descripcion}</MenuItem>
                                )
                            })
                        }

                    </Select>
                    <FormHelperText>{formik.errors.articulo}</FormHelperText>
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
                        disabled={loadingMovimiento}
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
        </React.Fragment>
    )
}

export default MovimientoForm;