import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export const RemoteComponent = (props: any) => {
    const {
        pluginName,
        pluginSrc,
        loadingComponent,
        ...oth
    } = props

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const tag = document.getElementById(pluginName)
        if(tag === null){
            const dom_elm = document.createElement('script')
            dom_elm.id = pluginName
            dom_elm.src = pluginSrc
            dom_elm.onload = () => {
                setLoading(false)
            }
            document.head.appendChild(dom_elm)
        }
    })

    const Component: React.ElementType = window[pluginName] as any

    return <>
        {loading ? (loadingComponent ? loadingComponent : <CircularProgress/>) : (Component ? <Component {...oth}/> : <p>error</p>)}
    </>
}