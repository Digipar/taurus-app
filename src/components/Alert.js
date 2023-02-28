import * as React from 'react';
import {Stack} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AlertComponent(props) {


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        props.setOpen(false);
    };

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar open={props.open} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={props.alertOptions.tipo} sx={{ width: '100%' }}>
                    <AlertTitle>{props.alertOptions.titulo}</AlertTitle>
                    {props.alertOptions.mensaje}
                </Alert>
            </Snackbar>
        </Stack>
    );
}