import React, { useEffect, useState } from 'react'
import { ConfigProvider } from 'antd';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './views/Home'
import Login from './views/Login'
import NotFind from './views/NotFind'
import Tourist from './views/Tourist'
import Main from './views/subs/Main'
import User from './views/subs/User'
import Role from './views/subs/Role'
import Limits from './views/subs/Limits'
import Compose from './views/subs/Compose'
import NewsUpdate from './views/subs/NewsUpdate'
import NewsPreview from './views/subs/NewsPreview'
import Drafts from './views/subs/Drafts'
import NewsClassification from './views/subs/NewsClassification'
import ReviewNews from './views/subs/ReviewNews'
import AuditList from './views/subs/AuditList'
import ToReleased from './views/subs/ToReleased'
import HaveReleased from './views/subs/HaveReleased'
import MouseParticles from 'react-mouse-particles'
import BeOffline from './views/subs/BeOffline'
import VisitorPreview from './views/VisitorPreview'
import axios from 'axios';

const LocalRouterMap = {
  "/home": <Main />,
  "/user-manage/list": <User />,
  "/right-manage/role/list": <Role />,
  "/right-manage/right/list": <Limits />,
  "/news-manage/add": <Compose />,
  "/news-manage/update/:id": <NewsUpdate />,
  "/news-manage/preview/:id": <NewsPreview />,
  "/news-manage/draft": <Drafts />,
  "/news-manage/category": <NewsClassification />,
  "/audit-manage/audit": <ReviewNews />,
  "/audit-manage/list": <AuditList />,
  "/publish-manage/unpublished": <ToReleased />,
  "/publish-manage/published": <HaveReleased />,
  "/publish-manage/sunset": <BeOffline />
}


export default function App() {
  const [BackRouteList, setBackRouteList] = useState([])
  const user = JSON.parse(localStorage.getItem("token"))

  useEffect(() => {
    Promise.all([
      axios.get('/rights'),
      axios.get('/children')
    ]).then(res => {
      setBackRouteList([...res[0].data, ...res[1].data])
    })
  }, [])

  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
  }

  const checkUserPermission = (item) => {
    return user.role.rights.includes(item.key)
    // return user.roleId !== 3 ? user.role.rights.checked.includes(item.key) : user.role.rights.includes(item.key)
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: '#722ed1',
          borderRadius: 2,

          // 派生变量，影响范围小
          colorBgContainer: '#ffffff',
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/home/home'></Navigate>}></Route>
          <Route path='/home' element={<Navigate to='/home/home'></Navigate>}></Route>
          <Route path='/home' element={<Home></Home>}>
            {
              BackRouteList.map(item => {
                if (checkRoute(item) && checkUserPermission(item)) {
                  return <Route path={item.key.substring(1)} element={LocalRouterMap[item.key]} key={item.key}></Route>
                }
                return null
              })
            }
            {
              BackRouteList > 0 && <Route path='*' element={<NotFind></NotFind>}></Route>
            }
          </Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/tourist' element={<Tourist></Tourist>}></Route>
          <Route path='/detail/:id' element={<VisitorPreview></VisitorPreview>}></Route>
        </Routes>
      </BrowserRouter>
      <MouseParticles g={1} color="random" cull="col,image-wrapper" />
    </ConfigProvider>
  )
}