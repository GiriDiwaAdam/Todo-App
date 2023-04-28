import React from 'react';
import { Route } from 'react-router';
import  Dashboard  from './pages/Dashboard';
import TodoDetail from './pages/TodoDetail';

function Routes(){
    return (
        <Routes>
            <Route path="/detail/:todoId" component={TodoDetail} />
            <Route path="/" component={Dashboard} />
        </Routes>
    )
}

export default Routes