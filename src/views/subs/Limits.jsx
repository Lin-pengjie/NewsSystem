import { Button, Modal, Popover, Switch, Table, Tag } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

export default function Limits() {
  const [dataSource, setdataSource] = useState([])
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [Item, setItem] = useState()

  const showModal = (item) => {
    setOpen(true);
    // console.log(item);
    setItem(item);
  };
  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
      // 在这里可以使用传递进来的 item 参数进行删除功能
      delLimits(Item)
    }, 200);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  //删除按钮确认点击事件
  const delLimits = (obj) => {
    if (obj.grade === 1) {
      setdataSource(dataSource.filter(data => data.id !== obj.id))
      axios.delete(`http://localhost:8000/rights/${obj.id}`)
    }
    else {
      const targetItem = dataSource.find(item => item.id === obj.rightId);
      const filteredChildren = targetItem.children.filter(child => child.id !== obj.id);
      targetItem.children = filteredChildren;
      // console.log(targetItem)
      // console.log(dataSource)
      setdataSource([...dataSource])
      axios.delete(`http://localhost:8000/children/${obj.id}`)
    }
  }
  //编辑按钮开关事件
  const isSwitch = (obj) => {
    console.log(obj)
    obj.pagepermisson = obj.pagepermisson === 1 ? '' : 1
    setdataSource([...dataSource])
    if (obj.grade === 1) {
      axios.patch(`http://localhost:8000/rights/${obj.id}`, { pagepermisson: obj.pagepermisson })
    }
    else {
      axios.patch(`http://localhost:8000/children/${obj.id}`, { pagepermisson: obj.pagepermisson })
    }
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      render: (id) => <b>{id}</b>
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (location) => <Tag color="green">{location}</Tag>
    },
    {
      title: '操作',
      render: (item) => <div>
        <Popover content={<div style={{ textAlign: 'center' }}>
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            defaultChecked
            onChange={() => isSwitch(item)}
            checked={item.pagepermisson === 1 ? true : false} />
        </div>} title="页面配置" trigger='click' >
          <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={!item.pagepermisson} onClick={() => {}}/>
        </Popover>&emsp;&emsp;
        <Modal
          title="确定删除该权限"
          okText='确定'
          cancelText='取消'
          open={open}
          onOk={handleOk}
          //动画
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          maskStyle={{ backgroundColor: 'rgba(20, 20, 20, 0.1)' }}
        ></Modal>
        <Button shape="circle" icon={<DeleteOutlined />} danger onClick={() => showModal(item)} />
      </div>
    },
  ];

  useEffect(() => {
    axios.get('http://localhost:8000/rights?_embed=children').then(res => {
      const list = res.data
      list.forEach(element => {
        if (element.children.length === 0) {
          element.children = ''
        }
      });
      setdataSource(list)
    })
  }, [])
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  )
}