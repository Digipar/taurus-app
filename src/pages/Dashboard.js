import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import image from "../img/bienvenido.png"; 

const Dashboard = () => {
  return (

    // <background
    //   sx={{ width: 500, height: 450 }}
    //   src={`bienvenido.png`}
    //   srcSet={`bienvenido.png`}
    //   alt='Digipar'
    //   loading="lazy"
    // />
    <div style={{ backgroundImage:`url(${image})`,backgroundRepeat:"no-repeat",backgroundSize:"contain",  height:1000,width:1000 }}>

  </div>
  )
}

export default Dashboard;