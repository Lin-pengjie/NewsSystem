import { Button, Modal, Table, Tree } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons'

export default function Role() {
  const [dataSource, setdataSource] = useState([])
  const [limits, setlimits] = useState([])
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [Item, setItem] = useState()
  const [rights, setrights] = useState([])
  const [rightsId, setrightsId] = useState()

  //操作删除按钮事件
  const showModal = (item) => {
    setOpen(true);
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
    setdataSource(dataSource.filter(data => data.id !== obj.id))
    axios.delete(`/roles/${obj.id}`)
  }


  //操作编辑按钮事件
  const edit = (item) => {
    setIsModalOpen(true);
    setrights(item.rights)
    setrightsId(item.id)
  };
  const Sure = () => {
    setIsModalOpen(false);
  };
  const Cancel = () => {
    setIsModalOpen(false);
  };
  const oncheck = (checkedKeys) => {
    setrights(checkedKeys)
    console.log(checkedKeys.checked)
    console.log(rightsId)
    setdataSource(dataSource.map(item => {
      if(item.id === rightsId){
        return{
          ...item,
          rights:checkedKeys
        }
      }
      return item
    }))
    axios.patch(`/roles/${rightsId}`,{rights:checkedKeys})
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <b>{id}</b>
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => <div>
        <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => edit(item)} />
        &emsp;&emsp;
        <Button shape="circle" danger={true} icon={<DeleteOutlined />} onClick={() => showModal(item)} />
      </div>
    },
  ]

  useEffect(() => {
    axios.get('/roles').then(res => {
      setdataSource(res.data)
    })
    axios.get('/rights?_embed=children').then(res => {
      setlimits(res.data)
    })
  }, [])
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: 5 }} />
      {/* 删除Modal */}
      <Modal
        title="确定删除该角色"
        okText='确定'
        cancelText='取消'
        open={open}
        onOk={handleOk}
        //动画
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      ></Modal>

      {/* 编辑Modal */}
      <Modal title="Basic Modal" open={isModalOpen} onOk={Sure} onCancel={Cancel}>
        <Tree
          checkable
          checkedKeys={rights}
          treeData={limits}
          checkStrictly={true}
          onCheck={oncheck}
        />
      </Modal>
    </div>
  )
}
