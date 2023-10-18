import { Button, Table, notification } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function PublishTable(props) {
    const [draftList, setdraftList] = useState([])
    const incident = ['', '发布', '下线', '移除']
    const {username} = JSON.parse(localStorage.getItem("token"))

    useEffect(() => {
        axios(`/news?author=${username}&publishState=${props.publishState}&_expand=category`).then(res => {
            setdraftList(res.data)
            // console.log(res.data)
        })
    }, [props.publishState, username])

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
            title: '操作',
            render: (item) => <Button
                danger={props.publishState === 2}
                type={props.publishState === 1 ? "primary" : 'default'}
                onClick={() => UpdatapublishState(item, props.publishState)}
            >
                {incident[props.publishState]}
            </Button>
        },
    ]

    const UpdatapublishState = (item, id) => {
        setdraftList(draftList.filter(data => data.id !== item.id))
        switch (id) {
            case 1:
                axios.patch(`/news/${item.id}`, {
                    "publishState": 2,
                    "publishTime": Date.now()
                  }).then(res => {
                    notification.info({
                      message: `通知`,
                      description:
                        `发布成功，您可以到[已发布]中查看您的新闻`,
                      placement: "bottomRight"
                    });
                  })
                  break
            case 2:
                axios.patch(`/news/${item.id}`, {
                    "publishState": 3,
                  }).then(res => {
                    notification.info({
                      message: `通知`,
                      description:
                        `下线成功，您可以到[已下线]中查看您的新闻`,
                      placement: "bottomRight"
                    });
                  })
                  break
            case 3:
                axios.delete(`/news/${item.id}`).then(res => {
                    notification.info({
                      message: `通知`,
                      description:
                        `移除成功`,
                      placement: "bottomRight"
                    });
                  })
                  break
            default:
                console.log('匹配不到publishState')
        }
    }

    return (
        <div>
            <Table dataSource={draftList} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: 5 }} />
        </div>
    )
}
