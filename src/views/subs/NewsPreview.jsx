import React, { useEffect, useState } from 'react';
import { Descriptions, Button, Tag } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom'
import axios from 'axios';
import moment from 'moment/moment';
import { useNavigate } from 'react-router-dom'

const auditList = ["未审核", '审核中', '已通过', '未通过']
const publishList = ["未发布", '待发布', '已上线', '已下线']
const color = ['red', 'orange', 'green', 'magenta']

export default function NewsPreview(props) {
  const params = useParams()
  const [News, setNews] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
      setNews(res.data)
      // console.log(res.data);
    })
  }, [params.id])

  const items = [
    {
      label: '新闻类型',
      children: News.category?.title,
    },
    {
      label: '创建者',
      children: News.author,
    },
    {
      label: '创建时间',
      children: moment(News.createTime).format('YYY/MM/DD HH:mm:ss'),
    },
    {
      label: '发布时间',
      children: News.publishTime ? moment(News.publishTime).format('YYY/MM/DD HH:mm:ss') : '-',
    },
    {
      label: '区域',
      children: News.region,
    },
    {
      label: '审核状态',
      children: <Tag color={color[News.auditState]}>{auditList[News.auditState]}</Tag>,
    },
    {
      label: '发布状态',
      children: <Tag color={color[News.publishState]}>{publishList[News.publishState]}</Tag>,
    },
    {
      label: '访问数量',
      children: News.view,
    },
    {
      label: '点赞数量',
      children: News.star,
    },
    {
      label: '评论数量',
      children: 0,
    }
  ]

  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <Button icon={<LeftOutlined />} style={{ border: 'none' }} onClick={() => {
          navigate(-1)
        }}></Button>
        &emsp;
        <label style={{ fontSize: '20px', fontWeight: '500px' }}>{News.title}</label>
      </div>
      <Descriptions layout="vertical" items={items} style={{marginLeft:'40px'}}/>
      <div dangerouslySetInnerHTML={{
        __html: News.content
      }} style={{
        margin: "24px 40px",
        border: "1px solid #d9d9d9"
      }}>
      </div>
    </>
  )
}