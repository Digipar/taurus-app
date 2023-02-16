import React, { useState, useEffect } from 'react'
import { Card, TextField, Stack } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const MovimientoFiltro = (props) => {

    const [errorCliente, setErrorCliente] = useState(null)
    const [clienteSeleccionado, setClienteSeleccionado] = useState({ id: "", label: "" });
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        let clientesTemp = [];
        props.clientes.map((cliente) => {
            return clientesTemp.push({ id: cliente.id, label: cliente.nombre, })
        })
        setClientes([...clientesTemp])
    }, [props.clientes])


    useEffect(() => {
        setErrorCliente("");
        console.log('clientes', clientes);
    }, [])

    return (
        <>
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
                            <Grid container spacing={1}>
                                <Grid xs={4} sx={{ marginLeft: 1 }}>
                                    <Item>
                                        <FormControl fullWidth>
                                            <Autocomplete
                                                id="cliente"
                                                name="cliente"
                                                options={clientes}
                                                getOptionSelected={(option, value) => option.label === value.label}
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
                                    </Item>
                                </Grid>
                            </Grid>

                            <Stack
                                sx={{ mt: 2 }}
                                direction="row"
                                alignItems="center"
                                spacing={1}
                            >

                                <Button startIcon={<ManageSearchIcon />} variant="text" color='primary'>
                                    Buscar
                                </Button>

                                <Button startIcon={<ReplayIcon />} variant="text" color='primary'>
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