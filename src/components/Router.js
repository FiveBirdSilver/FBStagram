import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Profile from '../routes/Profile'
import Navigation from '../components/Navigation';

function AppRouter({ propsLog, UserObj }) {

    return (
        <Router>
            {propsLog && <Navigation UserObj={UserObj}/>}
            {/* 로그인이 되어 있다면 Navigation의 루트가 보임 */}
            <Routes>
                {propsLog
                    ? (
                        <>
                            <Route exact path={"/Home"} element={<Home UserObj={UserObj} />}></Route>
                            <Route exact path={"/"} element={<Profile UserObj={UserObj} />}></Route>
                        </>
                    )
                    :
                    <>
                        <Route exact path={"/"} element={<Auth />}></Route>
                    </>
                }
            </Routes>
        </Router>
    )
}

export default AppRouter;