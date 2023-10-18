import { Button, Table, notification } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function ReviewNews() {
  const [dataSource, setdataSource] = useState([])
  const user = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    const CHARACTERS = {
      '1': 'SuperAdministrator',
      '2': 'AreaAdministrator',
      '3': 'RegionEditing'
    }
    axios(`/news?auditState=1&_expand=category`).then(res => {
      setdataSource(CHARACTERS[user.roleId] === 'SuperAdministrator' ? res.data : [
        ...res.data.filter(item => item.author === user.username),
        ...res.data.filter(item => item.region === user.region && CHARACTERS[item.roleId] === 'RegionEditing')
      ])
    })
  }, [user.region, user.roleId, user.username])

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
      render: (category) => { return category.title }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="primary" onClick={() => Examine(item, 2, 1)}>通过</Button>
          <Button onClick={() => Examine(item, 3, 0)}>驳回</Button>
        </div>
      }
    },
  ]

  const Examine = (item, auditState, publishState) => {
    console.log(item)
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      auditState,
      publishState
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `您可以到【发布管理/已经发布】中查看您的新闻`,
        placement: "bottomRight"
      });
    })
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: 5 }} />
    </div>
  )
}
