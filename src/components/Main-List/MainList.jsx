import { List } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function MainList(props) {
    const [data, setdata] = useState([])

    useEffect(() => {
        axios(`http://localhost:8000/news?publishState=2&_expand=category&_sort=${props.data}&_order=desc&_limit=6`).then(res => {
            console.log(res.data)
            setdata(res.data)
        })
    },[props.data])

  return (
    <div>
      <List
              size="small"
              bordered={false}
              dataSource={data}
              renderItem={(item) => <List.Item><Link to={`/home/news-manage/preview/${item.id}`}>{item.title}</Link></List.Item>}
            />
    </div>
  )
}
