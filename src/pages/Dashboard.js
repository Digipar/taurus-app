import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const Dashboard = () => {
    return (
        <Grid container spacing={3} >
                {/* Chart */}
                <Grid item xs={12} md={8} lg={9} >
                  <Paper  
                    sx={{
                      
                      p: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      height: 600,
                    }}
                    
                  >
                 
                  <img
                  sx={{ width: 400, height: 20 }}
                  src={`bienvenido.png`}
                  srcSet={`bienvenido.png`}
                  alt='Digipar'
                  loading="lazy"
                />
                  </Paper>
                </Grid>       
              </Grid>
    )
}

export default Dashboard;