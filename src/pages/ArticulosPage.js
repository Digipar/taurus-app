import * as React from 'react';
import Articulos from "../components/Articulos"
import { Grid, Paper } from "@mui/material";

const ArticulosPage =()=>{

return(
    <Grid item xs={12}>
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <Articulos/>
    </Paper>
  </Grid>
)


};

export default ArticulosPage