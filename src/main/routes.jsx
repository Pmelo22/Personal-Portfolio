import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { routes as defaultRoutes } from '../default';
import { routes } from '../app/exports';
import EditUser from '../default/account/UserIndex' 

const AppRoutes = [...routes, ...defaultRoutes];

const Routes = () => (
    <div className='content-wrapper'>
        <Switch>
            {AppRoutes.map(route => (
                <Route 
                    key={route.path} 
                    exact={route.exact || false} 
                    path={route.path} 
                    component={route.component} 
                />
            ))}
            {AppRoutes.map(route => (
                route.isCrud !== false ? (
                    <Route 
                        key={`${route.path}-crud`} 
                        exact={route.exact || false} 
                        path={`${route.path}/:id`} 
                        component={route.component} 
                    />
                ) : null
            ))}
            <Route exact path="/edit-user" component={EditUser} />
            <Redirect to='/' />
        </Switch>
    </div>
);

export default Routes;
