import React from "react"
import Typography from "@mui/material/Typography"
import { useLogin } from 'react-admin';

const LocalAuthPage = (props: any) => {
    const login = useLogin()

    return <Typography variant={"h1"}>Test auth</Typography>
}

export default LocalAuthPage;