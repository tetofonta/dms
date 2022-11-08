import React from "react";
import { Admin, Resource, ListGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import authProvider from '../Auth/authProvider';
import LoginPage from '../Auth/LoginPage';


const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

function App() {
    return <Admin
            loginPage={LoginPage}
            dataProvider={dataProvider}
            authProvider={authProvider}
            requireAuth>
                <Resource name="users" list={ListGuesser} />
    </Admin>;
}

export default App;
