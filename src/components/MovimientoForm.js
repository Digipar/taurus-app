import React from 'react'
import * as yup from "yup";
import Box from "@mui/material/Box";
import { useFormik } from 'formik';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from "@mui/material/Button";
import FormHelperText from '@mui/material/FormHelperText';
import { Link } from "react-router-dom";

const MovimientoForm = (props) => {

    const schema = yup.object({
        ClienteId: yup.string().required("El campo Cliente es requerido."),
        ArticuloId: yup.string().required("El campo Articulo es requerido."),
        Precio: yup.number().positive("El campo Precio no puede ser negativo.").required("El campo Precio es requerido."),
        Cantidad: yup.number().required("El campo Cantidad es requerido.")
    });

    const handleSubmitSolicitud = async (values) => {
        await props.registrarMovimiento(values)
        resetForm({
             ClienteId: "",
             ArticuloId: "",
             Precio: "",
             Cantidad: "",
        });
     }

    const {
        values,
        handleSubmit,
        handleChange,
        setFieldError,
        errors,
        resetForm
    } = useFormik({
        initialValues: {
            SolicitudTipo: "",
            PermisoTipo: "",
            ClienteId: "",
            PermisoAclaracion: "",
            FechaDesde: "",
            CantidadDias: ""
        },
        validateOnChange: false,
        valdiateOnBlur: false,
        validationSchema: schema,
        onSubmit(values) {
            handleSubmitSolicitud(values)
        }
    });

    const handleChangeWrapper = (e) => {
        setFieldError(e.target.name, undefined)
        handleChange(e);
    }

    return (
        <>
            <Box
                component="form"
                sx={{ marginTop: 2 }}
            ></Box>
        
            <FormControl fullWidth error={(errors.ClienteId) ? true : false} sx={{ marginTop: 2 }}>
                    <InputLabel id="cliente-label">Cliente *</InputLabel>
                    <Select
                        labelId="cliente-label"
                        id="ClienteId"
                        name="ClienteId"
                        value={values?.ClienteId}
                        label="Cliente *"
                        onChange={handleChangeWrapper}

                    >
                        {
                            props.clientes.map(item => {
                                return (
                                    <MenuItem key={item.Id} value={item.Id}>{item.Nombre}</MenuItem>
                                )
                            })
                        }
                    </Select>
                    <FormHelperText>{errors.ClienteId}</FormHelperText>
                </FormControl>

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={() => handleSubmit(values)}
                    disabled={props.dataSaving}
                >
                    Grabar
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
                    component={Link}
                    to="/movimientos"
                    disabled={props.dataSaving}
                >
                    Volver
                </Button>
        </>
    )
}

export default MovimientoForm;