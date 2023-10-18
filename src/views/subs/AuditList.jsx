import { Button, Table, Tag, notification } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const auditList = ["未审核", '审核中', '已通过', '未通过']
const color = ['red', 'orange', 'green', 'magenta']

export default function AuditList() {
  const User = JSON.parse(localStorage.getItem('token'))
  const [draftList, setdraftList] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    axios(`/news?author=${User.username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      setdraftList(res.data)
    })
  }, [User.username])

  const columns = [
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
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => { return category?.title }
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => <Tag color={color[auditState]}>{auditList[auditState]}</Tag>
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {
            item.auditState === 1 && <Button danger onClick={() => {
              setdraftList(draftList.filter(data => data.id !== item.id))
              axios.patch(`/news/${item.id}`, {
                auditState: 0
              }).then(res => {
                notification.info({
                  message: `通知`,
                  description:
                    `您可以到草稿箱中查看您的新闻`,
                  placement: "bottomRight"
                });

              })
            }} >撤销</Button>
          }
          {
            item.auditState === 2 && <Button onClick={() => {
              axios.patch(`/news/${item.id}`, {
                "publishState": 2,
                "publishTime": Date.now()
              }).then(res => {
                navigate('/home/publish-manage/published')

                notification.info({
                  message: `通知`,
                  description:
                    `您可以到【发布管理/已经发布】中查看您的新闻`,
                  placement: "bottomRight"
                });
              })
            }}>发布</Button>
          }
          {
            item.auditState === 3 && <Button type="primary" onClick={() => {
              navigate(`/home/news-manage/update/${item.id}`)
            }}>更新</Button>
          }
        </div>
      }
    },
  ]

  return (
    <div>
      <Table dataSource={draftList} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: 5 }} />
    </div>
  )
}
