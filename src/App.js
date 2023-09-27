import React from 'react'
import { ConfigProvider } from 'antd';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './views/Home'
import Login from './views/Login'
import NotFind from './views/NotFind'
import Register from './views/Register'
import Main from './views/subs/Main'
import User from './views/subs/User'
import Role from './views/subs/Role'
import Limits from './views/subs/Limits'
import Compose from './views/subs/Compose'
import Drafts from './views/subs/Drafts'
import NewsClassification from './views/subs/NewsClassification'
import ReviewNews from './views/subs/ReviewNews'
import AuditList from './views/subs/AuditList'
import ToReleased from './views/subs/ToReleased'
import HaveReleased from './views/subs/HaveReleased'


export default function App() {

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
          <Route path='/' element={<Navigate to='/home'></Navigate>}></Route>
          <Route path='*' element={<Navigate to='/404'></Navigate>}></Route>
          <Route path='/home' element={<Home></Home>}>
            <Route index element={<Main></Main>}></Route>
            {/* 用户列表 */}
            <Route path='user-manage/list' element={<User></User>}></Route>
            {/* 角色列表 */}
            <Route path='right-manage/role/list' element={<Role></Role>}></Route>
            {/* 权限列表 */}
            <Route path='right-manage/right/list' element={<Limits></Limits>}></Route>
            {/* 撰写新闻 */}
            <Route path='news-manage/add' element={<Compose></Compose>}></Route>
            {/* 草稿箱 */}
            <Route path='news-manage/draft' element={<Drafts></Drafts>}></Route>
            {/* 新闻分类 */}
            <Route path='news-manage/category' element={<NewsClassification></NewsClassification>}></Route>
            {/* 审核新闻 */}
            <Route path='audit-manage/audit' element={<ReviewNews></ReviewNews>}></Route>
            {/* 审核列表 */}
            <Route path='audit-manage/list' element={<AuditList></AuditList>}></Route>
            {/* 待发布 */}
            <Route path='publish-manage/unpublished' element={<ToReleased></ToReleased>}></Route>
            {/* 已发布 */}
            <Route path='publish-manage/published' element={<HaveReleased></HaveReleased>}></Route>
          </Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/404' element={<NotFind></NotFind>}></Route>
          <Route path='/register' element={<Register></Register>}></Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}
