import { Button, Modal, Table, notification } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { DeleteOutlined, UnorderedListOutlined, UploadOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom';

export default function Drafts() {
  const [draftList, setdraftList] = useState([])
  const [DeleteOpen, setDeleteOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false);
  const User = JSON.parse(localStorage.getItem('token'))
  const [Item, setItem] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`/news?author=${User.username}&auditState=0&_expand=category`).then(res => {
      setdraftList(res.data)
    })
  }, [User.username])

  //操作删除按钮事件
  const DeleteDraft = (item) => {
    setDeleteOpen(true)
    setItem(item)
  };
  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setDeleteOpen(false);
      setConfirmLoading(false)
      setdraftList(draftList.filter(data => data.id !== Item.id))
      axios.delete(`/news/${Item.id}`)
    }, 200);
  };
  const handleCancel = () => {
    setDeleteOpen(false)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <b>{id}</b>
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => <Link to={`/home/news-manage/preview/${item.id}`}>{title}</Link>
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (category) => { return category ? category.title : null }
    },
    {
      title: '操作',
      render: (item) => <div>
        <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => navigate(`/home/news-manage/update/${item.id}`)} />
        &emsp;&emsp;
        <Button shape="circle" danger={true} icon={<DeleteOutlined />} onClick={() => DeleteDraft(item)} />
        &emsp;&emsp;
        <Button shape="circle" danger={true} icon={<UploadOutlined />} onClick={() => handleSave(item.id)}/>
      </div>
    },
  ]

  const handleSave = (id) => {
    axios.patch(`/news/${id}`,{
      auditState:1
    }).then(res => {
      navigate('/home/audit-manage/list')
      notification.info({
        message: `通知`,
        description:
          `您可以在'审核列表'中查看您的新闻`,
        placement:"bottomRight"
    });
    })
  }

  return (
    <div>
      <Table dataSource={draftList} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: 5 }} />

      {/* 删除Modal */}
      <Modal
        title="确定删除该草稿"
        okText='确定'
        cancelText='取消'
        open={DeleteOpen}
        onOk={handleOk}
        //动画
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      ></Modal>
    </div>
  )
}
