import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const Dashboard = () => {
    return (
        <Grid container spacing={3} >
                {/* Chart */}
                <Grid item xs={10} md={8} lg={9} >
                   
                  <img
                  sx={{ width: 500, height: 450 }}
                  src={`bienvenido.png`}
                  srcSet={`bienvenido.png`}
                  alt='Digipar'
                  loading="lazy"
                />
                </Grid>       
              </Grid>
    )
}

export default Dashboard;