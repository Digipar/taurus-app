import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const Dashboard = () => {
    return (
        <Grid container spacing={3} >
                {/* Chart */}
                <Grid item xs={12} md={8} lg={9} >
                  <Paper  
                    sx={{
                      
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: 240,
                    }}
                    
                  >
                  </Paper>
                </Grid>
         
       
              </Grid>
    )
}

export default Dashboard;