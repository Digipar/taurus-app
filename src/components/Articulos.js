import *  as React from 'react'
import { API } from '../config';
import { useAuth } from "../context/auth-context";
import CardContent from '@mui/material/CardContent';
import useFetch from '../hooks/use-fetch';
import Title from './Title';
import {  Card,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination} from '@mui/material';

const Articulos = () => {
    const { user } = useAuth();
    console.log('user', user)

    const columns = [
        { field: 'Id', headerName: 'Código', width: 130 },
        { field: 'Descripcion', headerName: 'Descripción', width: 350 },
        { field: 'DescripcionAdicional', headerName: 'Descripcion Adicional', width: 550 },
    ];

    const [alert, setAlert] = React.useState(false);
    const [articulosList, setArticulosList] = React.useState([]);
    const [alertOptions, setAlertOptions] = React.useState({});
    const { fetchData: fetchArticulos, error: errorArticulos, loading: loadingArticulos } = useFetch();

    const [articuloCount, setArticuloCount] = React.useState(0);
    const [controller, setController] = React.useState({
        page: 0,
        rowsPerPage: 10
    });


    const getArticulos = React.useCallback(async () => {
        const reqOptions = {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        };
        const articuloData = await fetchArticulos(`${API}/articulos`, reqOptions)
        console.log('articuloData', articuloData)
        setArticuloCount(articuloData.length)
        setArticulosList(articuloData);
        if (articuloData.error) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: articuloData.message })
        } else if (errorArticulos) {
            setAlert(true);
            setAlertOptions({ tipo: 'error', titulo: 'Error', mensaje: errorArticulos })
        } else {

            setArticulosList(articuloData)
        }
    }, [errorArticulos, fetchArticulos]);

    const handlePageChange = (event, newPage) => {
        setController({
            ...controller,
            page: newPage
        });
    };
    const handleChangeRowsPerPage = (event) => {
        console.log('aca')
        setController({
            ...controller,
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0
        });
    };

    React.useEffect(() => {
        getArticulos();
    }, [])
    return (
        <>
            <Title>Listado de artículos</Title>



            <Card size="small" sx={{ minWidth: 275 }}>
                <CardContent>
                <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Codigo
                    </TableCell>
                    <TableCell>
                      Descripción
                    </TableCell>
                    <TableCell>
                    Descripción adicional
                  </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {articulosList.map((articulo) => (
                    <TableRow key={articulo.Id}>
                    <TableCell>
                    {articulo.Id}
                  </TableCell>
                      <TableCell>
                        {articulo.Descripcion}
                      </TableCell>
                      <TableCell>
                        {articulo.DescripcionAdicional}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                onPageChange={handlePageChange}
                page={controller.page}
                count={articuloCount}
                rowsPerPage={controller.rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
                </CardContent>
            </Card>
        </>

    )
}
export default Articulos