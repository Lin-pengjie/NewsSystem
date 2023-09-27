import { Button, Modal, Switch, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import UserForm from '../../components/user-manage/UserForm'

export default function Limits() {
  const [dataSource, setdataSource] = useState([])
  const [addopen, setaddopen] = useState(false)
  const [UpDataOpen, setUpDataOpen] = useState(false)
  const [regionList, setregionList] = useState([])
  const [roleList, setroleList] = useState([])
  const addRef = useRef(null)
  const UpDataRef = useRef(null)
  const [isUpDisabled, setisUpDisabled] = useState(false)
  const [current, setcurrent] = useState(null)

  const addbutton = () => {
    setaddopen(true)
  }

  useEffect(() => {
    axios.get('http://localhost:8000/users?_expand=role').then(res => {
      setdataSource(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('http://localhost:8000/regions').then(res => {
      setregionList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('http://localhost:8000/roles').then(res => {
      setroleList(res.data)
    })
  }, [])

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => <b>{region === '' ? '全球' : region}</b>,
      filters: [
        ...regionList.map(item => ({
          text:item.title,
          value:item.value
        })),
        {
          text:'全球',
          value:'全球'
        }
      ],
      onFilter: (value, record) => {
        if(value==="全球"){
          return record.region === ''
        }
        return value === record.region
      },
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => { return role?.roleName }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => <Switch checked={roleState} disabled={item.default} onChange={() => islLoggeable(item)} />
    },
    {
      title: '操作',
      render: (item) => <div>
        <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => isEdit(item)} />&emsp;&emsp;
        <Button shape="circle" icon={<DeleteOutlined />} danger disabled={item.default} onClick={() => isDelete(item)} />
      </div>
    },
  ]

  const isEdit = (item) => {
    setUpDataOpen(true)
    setTimeout(() => {
      if(item.roleId === 1){
        setisUpDisabled(true)
      }else{
        setisUpDisabled(false)
      }
      UpDataRef.current.setFieldsValue(item);
      setcurrent(item)
    }, 0);
  }

  const ConfirmButton = () => {
    // console.log(addRef)
    addRef.current.validateFields().then(value => {
      setaddopen(false)
      addRef.current.resetFields()
      axios.post(`http://localhost:8000/users`, {
        ...value,
        "roleState": true,
        "default": false,
      }).then(res => {
        console.log(res)
        setdataSource([...dataSource, {
          ...res.data,
          role: roleList.filter(item => item.id === value.roleId)[0]
        }])
      })
    }).catch(err => {
      console.log(err)
    })
  }

  const islLoggeable = (item) => {
    item.roleState = !item.roleState
    setdataSource([...dataSource])
    axios.patch(`http://localhost:8000/users/${item.id}`, {
      roleState: item.roleState
    })
  }

  const isDelete = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:8000/users/${item.id}`)
  }



  const UpDataConfirm = () => {
    UpDataRef.current.validateFields().then(value => {
        setUpDataOpen(false)
        setdataSource(dataSource.map(item => {
          if (item.id === current.id) {
            return {
              ...item,
              ...value,
              role: roleList.filter(item => item.id === value.roleId)[0]
            }
          }
          return item
        }))
        axios.patch(`http://localhost:8000/users/${current.id}`,value)
      }).catch(error => {
        console.error('表单验证失败：', error);
      })
  };

  return (
    <div>
      <Button type="primary" onClick={addbutton}>
        添加用户
      </Button>
      <Modal title="添加用户" open={addopen} okText='确定' cancelText='取消'
        onCancel={() => {
          setaddopen(false)
          addRef.current.resetFields()
          console.log(addRef)
        }}
        onOk={() => ConfirmButton()}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addRef} />
      </Modal>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={(item) => item.id} />
      <Modal title="更新用户" open={UpDataOpen} okText='确定' cancelText='取消'
        onCancel={() => {
          setUpDataOpen(false)
          // addRef.current.resetFields()
          UpDataRef.current.resetFields()
          setisUpDisabled(!isUpDisabled)
        }}
        onOk={() => UpDataConfirm()}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={UpDataRef} isUpDisabled={isUpDisabled} />
      </Modal>
    </div>
  )
}