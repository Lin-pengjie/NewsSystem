import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import style from '../assets/css/Login.module.scss'
import ParticlesBg from 'particles-bg'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log(values);
        axios.get(`http://localhost:8000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
            console.log(res.data)
            if (res.data.length === 0) {
                message.error("用户名或密码不匹配")
            } else {
                localStorage.setItem('token', JSON.stringify(res.data[0]))
                navigate('/');
            }
        })
    }

    return (
        <div className={style.pages}>
            <div className={style.loginForm}>
                <div className={style.title}>
                    全球新闻发布管理系统
                </div>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                        &emsp;&emsp;
                        <Button type="primary" htmlType="reset" className="login-form-button">
                            重置
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <ParticlesBg type="cobweb" bg={true} />
        </div>
    )
}
