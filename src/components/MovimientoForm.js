import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik';
// import * as yup from "yup";
// import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import Button from "@mui/material/Button";
// import FormHelperText from '@mui/material/FormHelperText';
import { Link, useParams } from "react-router-dom";



const MovimientoForm = (props) => {

    const [clientes, setClientes] = useState([]);
    const [clienteSelecionado, setClienteSeleccionado] = useState("");
    const [articulos, setArticulos] = useState([]);
    const [articuloSeleccionado, setArticuloSeleccionado] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [precio, setPrecio] = useState("");

    // const { idParam } = useParams();
    // console.log("params movimientoId => ", idParam)


    useEffect(() => {
        let clientesTemp = [];
        props.clientes.map((cliente) => {
            clientesTemp.push({ id: cliente.Id, label: cliente.Nombre, })
        })
        setClientes([...clientesTemp])

    }, [props.clientes])

    useEffect(() => {
        const articulosTemp = [];
        props.articulos.map((articulo) => {
            articulosTemp.push({ id: articulo.Id, label: articulo.Descripcion })
        })
        setArticulos([...articulosTemp])
    }, [props.articulos])

    //! Editar (prueba)
    // useEffect(() => {
    //     const movimientoCapturado = movimientosPrueba.find(movimiento => {
    //         return movimiento.Id === id;
    //     })
    //     console.log("movimientoCapturado", movimientoCapturado)
    // }, [])


   

    const enviar = () => {

        const movDataCreate = {
            clienteId: clienteSelecionado.id,
            articuloId: articuloSeleccionado,
            cantidad: +cantidad,
            precio: +precio
        }

        // props.registrarMovimiento(movDataCreate)
    }

    return (
        <>



            <FormControl fullWidth sx={{ marginTop: 2 }}>

                <Autocomplete
                    id="clienteId"
                    name="clienteId"
                    disablePortal
                    onInputChange={(e, newValue) => { setClienteSeleccionado(newValue) }}
                    onChange={(event, newValue) => {
                        console.log(newValue)
                        setClienteSeleccionado(newValue)
                    }}
                    forcePopupIcon={true}
                    options={clientes}
                    value={clienteSelecionado}
                    sx={{ width: "*" }}
                    renderInput={(params) => <TextField {...params} label="Clientes" />}
                />

            </FormControl>

            <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel id="articulo">Articulos *</InputLabel>
                <Select
                    labelId="articulo"
                    id="articuloId"
                    name="articuloId"
                    label="Articulos *"
                    onChange={(event) => {
                        setArticuloSeleccionado(event.target.value)
                    }}
                    value={articuloSeleccionado}
                >
                    {
                        articulos.map(item => {
                            return (
                                <MenuItem key={item.id} value={item.id}>{item.label}</MenuItem>
                            )
                        })
                    }

                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ marginTop: 2 }}>
                <TextField
                    name="cantidad"
                    id="cantidad"
                    label="Cantidad"
                    type="number"
                    inputProps={{ step: 1 }}
                    value={cantidad}
                    onChange={(e) => { setCantidad(e.target.value) }}
                    required

                />
            </FormControl>

            <FormControl fullWidth sx={{ marginTop: 2 }}>
                <TextField
                    name="precio"
                    id="precio"
                    label="Precio"
                    type="number"
                    inputProps={{ step: 1, min: 0 }}
                    value={precio}
                    onChange={(e) => { setPrecio(e.target.value) }}
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
                    // onClick={() => handleSubmit()}
                    onClick={() => enviar()}
                    disabled={props.dataSaving}
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

        </>
    )
}

export default MovimientoForm;