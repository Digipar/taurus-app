
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useAuth } from "../context/auth-context";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import * as yup from "yup";
import { useFormik } from 'formik';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Alert from '../components/Alert';
import { useState } from "react";
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link
        color="inherit"
        href="https://mui.com/"
      >
        Digipar
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const SignIn = (props) => {

  const { login, loginError, setLoginError, errorMessage } = useAuth();

  const [loadingSignin, setLoadingSignin] = useState(false);

  const validationSchema = yup.object({
    correo: yup
      .string('Enter your email')
      .email('Ingrese un email válido')
      .required('Su email es requerido'),

  });

  const formik = useFormik({
    initialValues: {
      correo: '',
      contrasenha: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      //console.log('values', values)
      //submit(values)
      setLoadingSignin(true)
      await login(values)
      setLoadingSignin(false)

    },
  });

  return (

    <Container
      component="main"
      maxWidth="xs"
    >
      <Alert open={loginError} setOpen={setLoginError} alertOptions={{ tipo: 'error', titulo: 'Error', mensaje: errorMessage }}></Alert>
      <CssBaseline />
      <Card sx={{ minWidth: 375, mt: 15 }}>
        <CardContent>
          <Box
            sx={{
              marginTop: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CardActionArea>
              <CardMedia
                direction="column"
                justify="center"
                component="img"
                sx={{ height: 60, width: 160, ml: 13 }}
                image="./logoDigipar.png"
                alt="Digipar"
              />
            </CardActionArea>
            <Typography
              component="h1"
              variant="h5"
              sx={{ mt: 5 }}
            >
              Ingrese sus credenciales
            </Typography>
            <Box

              component="form"
              onSubmit={formik.handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="correo"
                label="Correo electrónico"
                name="correo"
                autoComplete="email"
                onChange={formik.handleChange}
                error={formik.touched.correo && Boolean(formik.errors.correo)}
                helperText={formik.touched.correo && formik.errors.correo}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="contrasenha"
                label="Contraseña"
                type="password"
                id="contrasenha"
                autoComplete="current-contrasenha"
                onChange={formik.handleChange}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                  />
                }
                label="Recordarme"
              />
              <CardActions>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loadingSignin}
                >
                  Ingresar
                </Button>
              
              </CardActions>
              {loadingSignin &&
                  <Stack alignItems="center" sx={{ fontSize: "15px" }}>
                    <CircularProgress /> Cargando...
                  </Stack>
                }

            </Box>
          </Box>
        </CardContent>
        <Copyright sx={{ mt: 1, mb: 4 }} />
      </Card>

    </Container>

  );
};
export default SignIn;
