import * as React from 'react';
import Tenants from "../components/Tenants"
import { Grid, Paper } from "@mui/material";

const TenantsPage =()=>{
  console.log('aca')

return(
    <Grid item xs={12}>
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <Tenants/>
    </Paper>
  </Grid>
)


};

export default TenantsPage