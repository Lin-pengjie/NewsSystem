import React, { useEffect, useState } from 'react'
import style from '../../assets/css/Compose.module.scss'
import { Button, Form, Input, message, Select, Steps, notification } from 'antd';
import axios from 'axios';
import ComposeEdit from '../../components/Compose-Edit/ComposeEdit'
import { useNavigate, useParams } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';

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

export default function NewsUpdata() {
  const { Option } = Select
  const [current, setCurrent] = useState(0)
  const [categories, setcategories] = useState([])
  const [form] = Form.useForm();
  const [FormData, setFormData] = useState()
  const [Text, setText] = useState()
  //useParams()来获取URL中的参数
  const navigate = useNavigate();
  const params = useParams()

  useEffect(() => {
    axios.get('/categories').then(res => {
      setcategories(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get(`http://localhost:8000/news/${params.id}?_expand=category&_expand=role`).then(res => {
      console.log(res.data)
      form.setFieldsValue({
        title:res.data.title,
        categoryId:res.data.category.id
      })
      setText(res.data.content)
    })
  },[params.id, form])

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

  const handleSave = (auditState) => {
    axios.patch(`/news/${params.id}`, {
      ...FormData,
      "content": Text,
      "auditState": auditState,
    }).then(res => {
      navigate(auditState === 0 ? '/home/news-manage/draft' : '/home/audit-manage/list')
      notification.info({
        message: `通知`,
        description:
          `您可以在${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
        placement: "bottomRight"
      });
    })
  }

  return (
    <>
      <div>
        <Button icon={<LeftOutlined />} style={{ border: 'none' }} onClick={() => {
          navigate(-1)
        }}></Button>
        &emsp;
        <label className={style.title}>更新新闻</label>
      </div>
      {/* 步骤条 */}
      <Steps current={current} items={steps} style={{ marginTop: '34px' }} />
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
          }} content={Text}/>
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