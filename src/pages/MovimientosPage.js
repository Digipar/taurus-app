import * as React from 'react';
import Movimientos from "../components/Movimientos"
import { Grid, Paper } from "@mui/material";

const MovimientosPage =()=>{


return(
    <Grid item xs={12}>
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <Movimientos/>
    </Paper>
  </Grid>
)


};

export default MovimientosPage