import React, { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SketchOutlined,
  UserOutlined,
  AuditOutlined,
  BarsOutlined,
  GlobalOutlined,
  FileProtectOutlined,
  FolderViewOutlined
} from '@ant-design/icons';
import { Avatar, Layout, Menu, Button, theme, Dropdown } from 'antd';
import { useNavigate, Outlet, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import MenuItem from 'antd/es/menu/MenuItem';
import SubMenu from 'antd/es/menu/SubMenu';
const { Header, Sider, Content } = Layout;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation()
  const [list, setlist] = useState([])
  const iconlist = {
    "/home": <SketchOutlined />,
    "/user-manage": <UserOutlined />,
    "/right-manage": <FolderViewOutlined />,
    "/news-manage": <AuditOutlined />,
    "/audit-manage": <FileProtectOutlined />,
    "/publish-manage": <GlobalOutlined />
  }

  const user = JSON.parse(localStorage.getItem('token'))

  const selectitems = [
    {
      key: '1',
      label: (
        <div>{user.role.roleName}</div>
      ),
    },
    {
      key: '2',
      danger: true,
      label: (
        <Link to='/login' onClick={() => {
          localStorage.removeItem("token")
        }}>退出</Link>
      ),
    }
  ];

  // 通过useLocation获取pathname进行处理返回(作为导航栏的高亮选择defaultSelectedKeys的值)
  const SelectedKey = (path) => {
    return path === '/home' ? path : path.substring(('/home').length)
  }

  const OpenKey = (path) => {
    return '/' + path.split('/')[2]
  }

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const checkpagepermisson = (list) => {
    if (user.role.rights.hasOwnProperty("checked")){
      return list.pagepermisson === 1 && user.role.rights.checked.includes(list.key)
    }
    return list.pagepermisson === 1  && user.role.rights.includes(list.key)
  }

  const menulist = (item) => {
    return item.map(list => {
      if (list.children?.length > 0 && checkpagepermisson(list)) {
        return <SubMenu title={list.title} key={list.key} icon={iconlist[list.key]}>{menulist(list.children)}</SubMenu>
      }
      return checkpagepermisson(list) && <MenuItem key={list.key} icon={list.key === "/home" ? iconlist[list.key] : <BarsOutlined />}>{list.title}</MenuItem>
    })
  }

  useEffect(() => {
    axios.get('http://localhost:8000/rights?_embed=children').then(res => {
      setlist(res.data)
    })
  }, [])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div className="demo-logo-vertical" />
          {/* 设置侧边导航栏有自己的滚动条 */}
          {/* <div style={{ flex: 1, overflow: 'auto' }}> */}
          <Menu
            theme="dark"
            mode="inline"
            // defaultOpenKeys与selectedKeys的区别：defaultOpenKeys会将组件变为非受控，而selectedKeys变为受控，所以使用路由重定向时也会高亮显示
            selectedKeys={[SelectedKey(location.pathname)]}
            defaultOpenKeys={[OpenKey(location.pathname)]}
            onSelect={(value) => {
              // 判断路径进行跳转，/home直接跳转
              navigate(value.key === "/home" ? '/home' : `/home${value.key}`)
            }}
          >
            {menulist(list)}
          </Menu>
          {/* </div> */}
        </div>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div style={{ float: 'right', padding: '0 20px' }}>
            <span>欢迎回来，{user.username}</span>
            <Dropdown
              menu={{
                items: selectitems,
              }}
              placement="bottom"
            >
              <Avatar size={42} icon={<UserOutlined />} />
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            maxHeight: '90vh',
            background: colorBgContainer,
            // 添加自定义滚动条样式
            overflow: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: '#888 transparent',
          }}
        >
          {/* 二级路由渲染出口 */}
          <Outlet></Outlet>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Home;


// import React, { useEffect, useState } from 'react';
// import {
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
//   SketchOutlined,
//   UserOutlined,
//   AuditOutlined,
//   BarsOutlined,
//   GlobalOutlined,
//   FileProtectOutlined,
//   FolderViewOutlined
// } from '@ant-design/icons';
// import { Avatar, Layout, Menu, Button, theme, Dropdown } from 'antd';
// import { useNavigate, Outlet, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import MenuItem from 'antd/es/menu/MenuItem';
// import SubMenu from 'antd/es/menu/SubMenu';
// const { Header, Sider, Content } = Layout;

// const selectitems = [
//   {
//     key: '1',
//     label: '超级管理员',
//   },
//   {
//     key: '2',
//     danger: true,
//     label: '退出',
//   }
// ];

// function getItem(label, key, pagepermisson, grade, children, icon) {
//   return {
//     key,
//     icon,
//     children,
//     label,
//     pagepermisson,
//     grade
//   }
// }

// const Home = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation()
//   const [list, setlist] = useState([])
//   const iconlist = {
//     "/home": <SketchOutlined />,
//     "/user-manage": <UserOutlined />,
//     "/right-manage": <FolderViewOutlined />,
//     "/news-manage": <AuditOutlined />,
//     "/audit-manage": <FileProtectOutlined />,
//     "/publish-manage": <GlobalOutlined />
//   }
//   const items = []

//   list.forEach(item => {
//     const { title, key, pagepermisson, grade, children } = item;
//     const convertedItem = getItem(title, key, pagepermisson, grade, children.map(child => {
//       const { title, key, grade } = child;
//       return getItem(title, key, '', grade, [], '');
//     }), '');
//     items.push(convertedItem);
//   });

//   console.log(items, 'xxx');
//   console.log(list)

//   // 通过useLocation获取pathname进行处理返回(作为导航栏的高亮选择defaultSelectedKeys的值)
//   const SelectedKey = (path) => {
//     return path === '/home' ? path : path.substring(('/home').length)
//   }

//   const OpenKey = (path) => {
//     return '/' + path.split('/')[2]
//   }

//   const {
//     token: { colorBgContainer },
//   } = theme.useToken();

//   // const checkpagepermisson = (list) => {
//   //   return list.pagepermisson === 1
//   // }

//   // const menulist = (item) => {
//   //   return item.map(list => {
//   //     if (list.children?.length > 0 && checkpagepermisson(list)) {
//   //       return <SubMenu title={list.title} key={list.key} icon={iconlist[list.key]}>{menulist(list.children)}</SubMenu>
//   //     }
//   //     return checkpagepermisson(list) && <MenuItem key={list.key} icon={list.key === "/home" ? iconlist[list.key] : <BarsOutlined />}>{list.title}</MenuItem>
//   //   })
//   // }

//   useEffect(() => {
//     axios.get('http://localhost:8000/rights?_embed=children').then(res => {
//       setlist(res.data)
//     })
//   }, [])

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       <Sider trigger={null} collapsible collapsed={collapsed}>
//         <div style={{ display: 'flex', height: '100%' }}>
//           <div className="demo-logo-vertical" />
//           <div style={{ flex: 1, overflow: 'auto' }}>
//             <Menu
//               theme="dark"
//               mode="inline"
//               // defaultOpenKeys与selectedKeys的区别：defaultOpenKeys会将组件变为非受控，而selectedKeys变为受控，所以使用路由重定向时也会高亮显示
//               selectedKeys={[SelectedKey(location.pathname)]}
//               defaultOpenKeys={[OpenKey(location.pathname)]}
//               items={items}
//               onSelect={(value) => {
//                 // 判断路径进行跳转，/home直接跳转
//                 navigate(value.key === "/home" ? '/home' : `/home${value.key}`)
//               }}
//             >
//               {/* {menulist(list)} */}
//             </Menu>

//             {/* <Menu>
//               {items.map(item => (
//                 <SubMenu key={item.key} title={item.label}>
//                   {item.children && item.children.length > 0 ? (
//                     item.children.map(child => (
//                       <Menu.Item key={child.key}>{child.label}</Menu.Item>
//                     ))
//                   ) : (
//                     null
//                   )}
//                 </SubMenu>
//               ))}
//             </Menu> */}
//           </div>
//         </div>
//       </Sider>
//       <Layout>
//         <Header
//           style={{
//             padding: 0,
//             background: colorBgContainer,
//           }}
//         >
//           <Button
//             type="text"
//             icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//             onClick={() => setCollapsed(!collapsed)}
//             style={{
//               fontSize: '16px',
//               width: 64,
//               height: 64,
//             }}
//           />
//           <label>林</label>
//           <div style={{ float: 'right', padding: '0 20px' }}>
//             <span>xxxx</span>
//             <Dropdown
//               menu={{
//                 items: selectitems,
//               }}
//               placement="bottom"
//             >
//               <Avatar size={42} icon={<UserOutlined />} />
//             </Dropdown>
//           </div>
//         </Header>
//         <Content
//           style={{
//             margin: '24px 16px',
//             padding: 24,
//             minHeight: 280,
//             background: colorBgContainer,
//           }}
//         >
//           {/* 二级路由渲染出口 */}
//           <Outlet></Outlet>
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };
// export default Home;