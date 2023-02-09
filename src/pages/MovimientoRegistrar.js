import React, {useCallback} from 'react';
import { API } from '../config';
import useFetch from '../hooks/use-fetch';
import MovimientoForm from '../components/MovimientoForm';
import { useAuth } from "../context/auth-context";
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import { Card, CardContent } from '@mui/material';
import Title from '../components/Title';



const MovimientoRegistrar = () => {
    const { user } = useAuth();
    // const navigate = useNavigate();
    // const { fetchData: fetchClientes, error: errorClientes, loading: loadingClientes } = useFetch();
    // const { fetchData: fetchRegistrarMovimiento, error: errorRegistrarMovimiento, loading: loadingMovimiento } = useFetch()
    const [clientes, setClientes] = React.useState(
        [
            {
                "Id": 1000,
                "Nombre": "Jose Penayo",
                "Creado": "2023-01-09T12:53:28Z",
                "CreadoPor" : "Jose Penayo",
                "Modificado": "2023-02-01T12:53:28Z",
                "ModificadoPor": "Jose Penayo",
                "Tenant" : "grupopettengill",
                "Estado" : 1    },
            {
                "Id": 1001,
                "Nombre": "Juan Acevedo",
                "Creado": "2023-01-12T12:53:28Z",
                "CreadoPor" : "Juan Acevedo",
                "Modificado": "2023-02-01T12:53:28Z",
                "ModificadoPor": "Juan Acevedo",
                "Tenant" : "lascaparaguay",
                "Estado" : 1    },
            {
                "Id": 1002,
                "Nombre": "Pamela Villanueva",
                "Creado": "2023-02-05T12:53:28Z",
                "CreadoPor" : "Pamela Villanueva",
                "Modificado": "2023-02-01T12:53:28Z",
                "ModificadoPor": "Pamela Villanueva",
                "Tenant" : "digiparparaguay",
                "Estado" : 2    },
            {
                "Id": 1003,
                "Nombre": "Nicole Hermida",
                "Creado": "2023-02-10T12:53:28Z",
                "CreadoPor" : "Nicole Hermida",
                "Modificado": "2023-02-01T12:53:28Z",
                "ModificadoPor": "Nicole Hermida",
                "Tenant" : "glymaxparaguay",
                "Estado" : 2    },
            {
                "Id": 1004,
                "Nombre": "Vanessa Blasco",
                "Creado": "2023-02-05T12:53:28Z",
                "CreadoPor" : "Vanessa Blasco",
                "Modificado": "2023-02-01T12:53:28Z",
                "ModificadoPor": "Vanessa Blasco",
                "Tenant" : "glymaxparaguay",
                "Estado" : 0    },
            {
                "Id": 1005,
                "Nombre": "Abraham Batista",
                "Creado": "2023-02-11T12:53:28Z",
                "CreadoPor" : "Abraham Batista",
                "Modificado": "2023-02-01T12:53:28Z",
                "ModificadoPor": "Abraham Batista",
                "Tenant" : "digiparparaguay",
                "Estado" : 0    }
        ]
    );
    const [articulos, setArticulos] = React.useState(
        [
            {
               "Id": "m2o94",
               "Descripcion" : "Articulo 1",
               "DescripcionAdicional" : "Enenatis a condimentum vitae sapien pellentesque",
               "Creado" : "2023-01-20T12:53:28Z",
               "CreadoPor" : "Axel Araujo",
               "Modificado" : "2023-01-20T12:53:28Z",
               "ModificadoPor" : "Axel Araujo",
               "SKUProveedor": "BSOD23",
               "Estado" : 1    },
           {
               "Id": "h9kc6",
               "Descripcion" : "Articulo 2",
               "DescripcionAdicional" : "Amet aliquam id diam maecenas ultricies mi eget mauris pharetra",
               "Creado" : "2023-01-04T12:53:28Z",
               "CreadoPor" : "Max Alegre",
               "Modificado" : "2023-01-04T12:55:28Z",
               "ModificadoPor" : "Max Alegre",
               "SKUProveedor": "JFK4501",
               "Estado" : 2    },
           {
               "Id": "dxhr23",
               "Descripcion" : "Articulo 3",
               "DescripcionAdicional" : "Adipiscing diam donec adipiscing tristique risus nec",
               "Creado" : "2023-02-01T12:40:28Z",
               "CreadoPor" : "Simon Villegas",
               "Modificado" : "2023-02-01T12:53:28Z",
               "ModificadoPor" : "Simon Villegas",
               "SKUProveedor": "MFJBAO9",
               "Estado" : 2    }, 
           {
               "Id": "gft291",
               "Descripcion" : "Articulo 4",
               "DescripcionAdicional" : "Ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue eget",
               "Creado" : "2023-02-10T12:53:28Z",
               "CreadoPor" : "Aya Abad",
               "Modificado" : "2023-02-05T12:53:28Z",
               "ModificadoPor" : "Aya Abad",
               "SKUProveedor": "FGF4531",
               "Estado" : 1    }, 
           {
               "Id": "fted2c",
               "Descripcion" : "Articulo 5",
               "DescripcionAdicional" : "Eu consequat ac felis donec et",
               "Creado" : "2023-02-14T12:53:28Z",
               "CreadoPor" : "Jose Angel Cueva",
               "Modificado" : "2023-02-05T12:53:28Z",
               "ModificadoPor" : "Jose Angel Cueva",
               "SKUProveedor": "FD2GDE",
               "Estado" : 0    }, 
           {
               "Id": "dfv2ls",
               "Descripcion" : "Articulo 6",
               "DescripcionAdicional" : "Eu consequat ac felis donec et",
               "Creado" : "2023-02-11T12:53:28Z",
               "CreadoPor" : "David Montilla",
               "Modificado" : "2023-02-05T12:53:28Z",
               "ModificadoPor" : "David Montilla",
               "SKUProveedor": "FDGGA2",
               "Estado" : 1    },  
           {
               "Id": "bdxd21",
               "Descripcion" : "Articulo 7",
               "DescripcionAdicional" : "Eu consequat ac felis donec et",
               "Creado" : "2023-02-10T12:53:28Z",
               "CreadoPor" : "Marcos Villarreal",
               "Modificado" : "2023-02-05T12:53:28Z",
               "ModificadoPor" : "Marcos Villarreal",
               "SKUProveedor": "SGHYRL",
               "Estado" : 1    },
           {
               "Id": "dfvn43",
               "Descripcion" : "Articulo 8",
               "DescripcionAdicional" : "Eu consequat ac felis donec et",
               "Creado" : "2023-02-11T12:53:28Z",
               "CreadoPor" : "Mateo Villalba",
               "Modificado" : "2023-02-05T12:53:28Z",
               "ModificadoPor" : "Mateo Villalba",
               "SKUProveedor": "FBNNCF",
               "Estado" : 1    }, 
           {
               "Id": "vfsdth",
               "Descripcion" : "Articulo 9",
               "DescripcionAdicional" : "Eu consequat ac felis donec et",
               "Creado" : "2023-02-11T12:53:28Z",
               "CreadoPor" : "Amina Atienza",
               "Modificado" : "2023-02-05T12:53:28Z",
               "ModificadoPor" : "Amina Atienza",
               "SKUProveedor": "DFSU388",
               "Estado" : 2    },  
           {
               "Id": "skthgn",
               "Descripcion" : "Articulo 10",
               "DescripcionAdicional" : "Eu consequat ac felis donec et",
               "Creado" : "2023-02-11T12:53:28Z",
               "CreadoPor" : "Gabriel Moliner",
               "Modificado" : "2023-02-05T12:53:28Z",
               "ModificadoPor" : "Gabriel Moliner",
               "SKUProveedor": "HKJHJD",
               "Estado" : 2    },
           {
               "Id": "jnfkhs",
               "Descripcion" : "Articulo 11",
               "DescripcionAdicional" : "Eu consequat ac felis donec et",
               "Creado" : "2023-02-11T12:53:28Z",
               "CreadoPor" : "Leyre Ortiz",
               "Modificado" : "2023-02-05T12:53:28Z",
               "ModificadoPor" : "Leyre Ortiz",
               "SKUProveedor": "SDSEWT",
               "Estado" : 0    },
           {
               "Id": "gttudb",
               "Descripcion" : "Articulo 12",
               "DescripcionAdicional" : "Eu consequat ac felis donec et",
               "Creado" : "2023-02-11T12:53:28Z",
               "CreadoPor" : "Lorena Díez",
               "Modificado" : "2023-02-05T12:53:28Z",
               "ModificadoPor" : "Lorena Díez",
               "SKUProveedor": "CXCVSS",
               "Estado" : 1    }
       ]
    );
    const [alert, setAlert] = React.useState(false);
    const [alertOptions, setAlertOptions] = React.useState({});


    // const getClientes = useCallback (async () => {

    //     const reqOptions = {
    //         method: 'GET',
    //         headers: { "Content-Type": "application/json" }
    //     };
    //     const respCliente = await fetchClientes(`${API}/clientes`, reqOptions)

    //     if (respCliente.error) {
    //         setAlert(true);
    //         setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: respCliente.message })
    //         return;
    //     }

    //     if (errorClientes) {
    //         setAlert(true);
    //         setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorClientes })
    //         return;
    //     } 

    //     console.log('respCliente => ', respCliente);
    //     setClientes(respCliente)
       
    // },[errorClientes, fetchClientes]);

    
    const registrarMovimiento = async (values) => {

        const movimientoDataCreate = {
            ...values,
            Estado: 2,
            CreadoPor: user ? user.userId : '',
            Creado: new Date(),
            Modificado: new Date(),
            ModificadoPor: user ? user.userId : ''
        }

        console.log('Movimiento Data Create =>', movimientoDataCreate)

        // const reqOptions = {
        //     method: 'POST',
        //     body: JSON.stringify(movimientoDataCreate),
        //     headers: { "Content-Type": "application/json" }
        // };
        // const respMovimiento = await fetchRegistrarMovimiento(`${API}/movimiento`, reqOptions);

        // console.log('respMovimiento => ', respMovimiento);

        // if (respMovimiento.error) {
        //     setAlert(true);
        //     setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: respMovimiento.message })
        //     return;
        // }

        // if (errorRegistrarMovimiento) {
        //     setAlert(true);
        //     setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorRegistrarMovimiento })
        //     return;
        // }

        // setAlert(true);
        // setAlertOptions({ tipo: 'success', titulo: 'Éxito', mensaje: 'Movimiento creado con éxito!' })
        // navigate('/movimientos')
        
    }

    
    React.useEffect(() => {
        // getClientes();
    }, [])

    return (
        <>
            <Alert open={alert} setOpen={setAlert} alertOptions={alertOptions}></Alert>
            <Title>Registrar nuevo movimiento</Title>
            <Card sx={{ minWidth: 300 }}>
                <CardContent>
                    <MovimientoForm registrarMovimiento={registrarMovimiento} clientes={clientes} articulos={articulos} />
                </CardContent>
            </Card>
        </>

    )
}

export default MovimientoRegistrar