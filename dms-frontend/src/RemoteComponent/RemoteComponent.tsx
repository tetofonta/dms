import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const loadAsset = (name: string, path: string) => {
    const id = path.replace(/\//g, "_").replace(/\./g, "+")
    if(path.endsWith(".js")){
        return new Promise<boolean>(resolve => {
            const tag = document.getElementById(id)
            if(tag === null){
                const dom_elm = document.createElement('script')
                dom_elm.id = id
                dom_elm.src = `/plugins/${path}`
                dom_elm.onload = () => {
                    resolve(true)
                }
                document.head.appendChild(dom_elm)
            } else {
                // @ts-ignore
                resolve(false)
            }
        })
    }
}

export const loadComponent = async (name: string, entrypoints: string[]) => {
    return await Promise.all(entrypoints.map(e => loadAsset(name, e)))
}

export const RemoteComponent = (props: any) => {
    const {
        plugin,
        loadingComponent,
        ...oth
    } = props

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadComponent(plugin.name, plugin.entrypoints).then((r) => {
            if(r.every(e => !!e))
                setLoading(false)
        })
    })

    const Component: React.ElementType = window[plugin.name] as any
    console.log(Component)

    return <>
        {loading ? (loadingComponent ? loadingComponent : <CircularProgress/>) : (Component ? <Component {...oth}/> : <p>error</p>)}
    </>
}