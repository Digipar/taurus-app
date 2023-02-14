import React, { useState, useEffect } from 'react'
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

const MovimientoForm = (props) => {
    const { idParam } = useParams();
    const { user } = useAuth();
   
    console.log('user =>', user);
    console.log('idParam', idParam);

    const [movLoading, setMovLoading] = React.useState(false)
    const [clientes, setClientes] = useState([]);
    const [articulos, setArticulos] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = React.useState("")
    const [alert, setAlert] = React.useState(false);
    const [errorCliente, setErrorCliente] = useState(null)



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

    // useEffect(() => {
    //     const movimientoCapturado = movimientosPrueba.find(movimiento => {
    //         return movimiento.Id === id;
    //     })
    //     console.log("movimientoCapturado", movimientoCapturado)
    // }, [])

    const formik = useFormik({
        initialValues: {
            cliente: '',
            articulo: '',
            cantidad: '',
            precio: ''
        },
       
        validationSchema: Yup.object({
            precio: Yup.number()
                .required('Campo precio es requerido.'),
            cantidad: Yup.number()
                .required('Campo cantidad es requerido.'),
            Articulos: Yup.string()
                .required("El campo articulo es requerido."),
                
        })
    })

    formik.handleSubmit = (e) => {
        e.preventDefault();
        // console.log('Valor del Autocomplete:', clienteSeleccionado)
        if(clienteSeleccionado !== "") {
            formik.values.cliente = clienteSeleccionado
            console.log("datos finales =>", formik.values)
            let movData = {
                clienteId: formik.values.cliente,
                articuloId: formik.values.articulo,
                cantidad: formik.values.cantidad,
                precio: formik.values.precio,
                creadoPor: user ? user.userId : '',
                modificadoPor: user ? user.userId : '',
                creado: new Date(),
                modificado: new Date()
            }

            console.log("movData", movData)

           // props.registrarMovimiento(movData)

        } else {
            setErrorCliente("Seleccione un cliente")
        }
    }


    return (
        <>
            <Box
                component="form" onSubmit={formik.handleSubmit}
                sx={{ marginTop: 2 }}
            >

                <FormControl fullWidth sx={{ marginTop: 2 }}>

                    <Autocomplete
                        id="cliente"
                        name="cliente"
                        disablePortal
                        onInputChange={(e, newValue) => {setClienteSeleccionado(newValue)}}
                        inputValue={clienteSeleccionado.label}
                        onChange={(e, newValue) => {
                            console.log(newValue)
                            if(newValue){
                                setErrorCliente("")
                                setClienteSeleccionado(newValue.id)
                            } else {
                                setClienteSeleccionado("")
                            }
                        }}
                        forcePopupIcon={true}
                        options={clientes}
                        freeSolo={true}
                        value={clienteSeleccionado.id}
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

                <FormControl fullWidth error={(formik.errors.articulo) ? true : false} sx={{ marginTop: 2 }}>
                    <InputLabel id="articulo">Articulos *</InputLabel>
                    <Select
                        labelId="articulo"
                        id="articulo"
                        name="articulo"
                        label="Articulos"
                        value={formik.values.articulo}
                        onChange={formik.handleChange}
                        required
                    >
                        {

                            articulos.map(item => {
                                return (
                                    <MenuItem key={item.id} value={item.id}>{item.label}</MenuItem>
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