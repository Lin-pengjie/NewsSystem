import React, { useEffect, useState } from 'react'
import style from '../../assets/css/Compose.module.scss'
import { Breadcrumb, Button, Form, Input, message, Select, Steps, notification } from 'antd';
import axios from 'axios';
import ComposeEdit from '../../components/Compose-Edit/ComposeEdit'
import { useNavigate } from 'react-router-dom';

// 步骤条内容
const steps = [
  {
    title: '基本信息',
    description: '新闻标题，新闻分类'
  },
  {
    title: '新闻内容',
    description: '新闻主体内容',
  },
  {
    title: '新闻提交',
    description: '保存草稿或提交审核'
  },
]

export default function Compose() {
  const { Option } = Select
  const [current, setCurrent] = useState(0)
  const [categories, setcategories] = useState([])
  const [form] = Form.useForm();
  const [FormData, setFormData] = useState()
  const [Text, setText] = useState()
  const User = JSON.parse(localStorage.getItem('token'))
  const navigate = useNavigate();

  //是否可执行下一步
  const next = () => {
    if (current === 0) {
      form.validateFields().then(values => {
        if (!values.title || !values.categoryId) {
          return
        }
        setCurrent(current + 1)
        setFormData(values)
      }).catch(err => {
        console.log('无效', err)
      })
    } else {
      if (Text === undefined || Text === '<p></p>\n') {
        message.error("新闻内容不能为空")
      } else {
        setCurrent(current + 1)
      }
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  useEffect(() => {
    axios.get('/categories').then(res => {
      setcategories(res.data)
    })
  }, [])

  const handleSave = (auditState) => {
    axios.post(`/news`, {
      ...FormData,
      "content": Text,
      "region": User.region ? User.region : '全球',
      "author": User.username,
      "roleId": User.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      // "publishTime": 0
    }).then(res => {
      navigate(auditState===0?'/home/news-manage/draft':'/home/audit-manage/list')
      notification.info({
        message: `通知`,
        description:
          `您可以在${auditState===0?'草稿箱':'审核列表'}中查看您的新闻`,
        placement:"bottomRight"
    });
    })
  }

  return (
    <>
      <Breadcrumb items={[{ title: '撰写新闻' }]} className={style.title} />
      {/* 步骤条 */}
      <Steps current={current} items={steps} style={{marginTop:'34px'}} />
      {/* 内容区 */}
      <div className={style.content}>
        <div className={current === 0 ? '' : style.isHidden}>
          <Form
            name="basic"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            style={{
              maxWidth: 900,
            }}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                {
                  required: true,
                  message: '请输入新闻标题!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: '请选择新闻类别!',
                },
              ]}
            >
              <Select >
                {
                  categories.map(item => <Option value={item.id} key={item.id} >{item.title}</Option>)
                }
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? '' : style.isHidden}>
          <ComposeEdit getText={value => {
            setText(value)
          }} />
        </div>
      </div>

      {/* 按钮区 */}
      <div className={style.stepsList}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            下一步
          </Button>
        )}
        {current === steps.length - 1 && (
          <>
            <Button
              danger={true}
              onClick={() => handleSave(1)}
              className={style.Spacing}>提交审核</Button>
            <Button onClick={() => handleSave(0)}
            >
              保存草稿箱</Button>
          </>
        )}
        {current > 0 && (
          <Button
            className={style.Spacing}
            onClick={() => prev()}
          >
            上一步
          </Button>
        )}
      </div>
    </>
  )
}