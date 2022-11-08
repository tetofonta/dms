import * as React from 'react';

import Container from "@mui/material/Container"
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ErrorIcon from '@mui/icons-material/Error'
import WarningIcon from '@mui/icons-material/Warning'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import { useEffect, useState } from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';

import "./auth.sass"
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { RemoteComponent } from '../RemoteComponent/RemoteComponent';

const LoginPage = ({ theme }: any) => {

  const [plugins, setPlugins] = useState([] as any[])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [component, setComponent] = useState(null as any)

  useEffect(() => {
    if(!loading) return;
    fetch("/api/plugins/auth")
      .then(res => {
        if(res.status !== 200) throw Error("Cannot load plugins from family auth")
        return res
      })
      .then(res => res.json())
      .then(data => {
        setPlugins(data)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  })

  return <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        className="loginbox"
      >
          <Box className="loginlist">
            <Card variant="outlined">
              <CardContent>
                { !!component && <RemoteComponent plugin={component}/>}
                { !component && <>
                  <Typography variant={"h5"}>Select a login method</Typography>
                  <List>

                    {loading ?
                      <ListItem disablePadding>
                        <CircularProgress/>
                      </ListItem>
                      :
                      (
                        error ?
                          <ListItem disablePadding>
                            <ListItemIcon>
                              <ErrorIcon/>
                            </ListItemIcon>
                            <ListItemText primary={error} />
                          </ListItem>
                          :
                          (
                            plugins.length === 0 ?
                              <ListItem disablePadding>
                                <ListItemIcon>
                                  <WarningIcon/>
                                </ListItemIcon>
                                <ListItemText primary="No plugins or family auth" />
                              </ListItem>
                              :
                              plugins.map(plugin => {
                                return <ListItem key={plugin.name} disablePadding>
                                  <ListItemButton onClick={() => setComponent(plugin)}>
                                    <ListItemText primary={plugin.name} />
                                  </ListItemButton>
                                </ListItem>
                              })
                          )
                      )
                    }
                  </List>
                </>}
              </CardContent>
              {!!component && <CardActions>
                <Button size={"small"} onClick={() => setComponent(null)}>Back</Button>
              </CardActions>}
            </Card>
          </Box>
      </Grid>
    </>
};

export default LoginPage;