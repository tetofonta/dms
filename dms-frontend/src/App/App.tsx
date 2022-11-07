import React from "react";
import { Admin, Resource, ListGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { RemoteComponent } from '../RemoteComponent/RemoteComponent';

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

function App() {
    // return <Admin dataProvider={dataProvider}>
    //     <Resource name="users" list={ListGuesser} />
    // </Admin>;

    return <RemoteComponent pluginName="local_auth" pluginSrc="/plugins/local_auth/js/local_auth.js"/>
}

export default App;
