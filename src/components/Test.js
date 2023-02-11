import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SignupForm = () => {
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
        validationSchema: Yup.object({
            firstName: Yup.string()
                .max(15, 'Must be 15 characters or less')
                .required('Required'),
            lastName: Yup.string()
                .max(20, 'Must be 20 characters or less')
                .required('Required'),
            email: Yup.string().email('Invalid email address').
            required('Required'),
            tipo: Yup.string()
            .required('Required'),
        }),
        onSubmit: values => {
            console.log('final values =>', values)
            alert(JSON.stringify(values, null, 2));
        },
    });
    return (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="firstName">First Name</label>
            <input
                id="firstName"
                name="firstName"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
            /><br />
            {formik.touched.firstName && formik.errors.firstName ? (
                <div>{formik.errors.firstName}</div>
            ) : null}

            <label htmlFor="lastName">Last Name</label>
            <input
                id="lastName"
                name="lastName"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
            /><br />

            {formik.touched.lastName && formik.errors.lastName ? (
                <div>{formik.errors.lastName}</div>
            ) : null}

            <label htmlFor="email">Email Address</label>
            <input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
            /><br />

            <label htmlFor="tipo">Tipo </label>{}
            <select 
                id="tipo"
                name="tipo"
                label="tipo *"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.tipo}
               
            >
                <option default-value='nada'></option>
                <option value='pizza'>Pizza</option>
                <option value='hamburguesa'>Hamburguesa</option>
            </select>

            {formik.touched.tipo && formik.errors.tipo ? (
                <div>{formik.errors.tipo}</div>
            ) : null}
            <br/>
            <button type="submit">Submit</button>
        </form>
    );
};
export default SignupForm;