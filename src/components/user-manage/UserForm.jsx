import { Form, Input, Select } from 'antd'
import React, { forwardRef, useEffect, useState } from 'react'

const UserForm = forwardRef((props, ref) => {
    const { Option } = Select
    const [isDisabled, setisDisabled] = useState(false)
    const user = JSON.parse(localStorage.getItem('token'))

    const CHARACTERS = {
        '1': 'SuperAdministrator',
        '2': 'AreaAdministrator',
        '3': 'RegionEditing'
    }

    const checkRegionDisable = (item) => {
        if (props.isUpData) {
            if (CHARACTERS[user.roleId] === 'SuperAdministrator') {
                return false
            } else {
                return true
            }
        } else {
            if (CHARACTERS[user.roleId] === 'SuperAdministrator') {
                return false
            } else {
                return item.value !== user.region
            }
        }
    }

    const checkRoleDisable = (item) => {
        if (props.isUpData) {
            if (CHARACTERS[user.roleId] === 'SuperAdministrator') {
                return false
            } else {
                return true
            }
        } else {
            if (CHARACTERS[user.roleId] === 'SuperAdministrator') {
                return false
            } else {
                return CHARACTERS[item.id] === 'SuperAdministrator'
            }
        }
    }

    useEffect(() => {
        setisDisabled(props.isUpDisabled)
    }, [props.isUpDisabled])

    return (
        <div>
            <Form layout='vertical' ref={ref}>
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: '请输入您的用户名!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: '请输入您的密码!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="区域"
                    name="region"
                    rules={isDisabled ? '' : [{ required: true, message: '请选择区域!' }]}
                >
                    <Select disabled={isDisabled} >
                        {
                            props.regionList.map(item => <Option value={item.value} key={item.id} disabled={checkRegionDisable(item)}>{item.title}</Option>)
                        }
                    </Select>
                </Form.Item>

                <Form.Item
                    label="角色"
                    name="roleId"
                    rules={[
                        {
                            required: true,
                            message: '请选择角色!',
                        },
                    ]}
                >
                    <Select onChange={(value) => {
                        if (value === 1) {
                            setisDisabled(true)
                            ref.current.setFieldsValue({
                                region: ''
                            })
                        }
                        else {
                            setisDisabled(false)
                        }
                    }}>
                        {
                            props.roleList.map(item => <Option value={item.id} key={item.id} disabled={checkRoleDisable(item)}>{item.roleName}</Option>)
                        }
                    </Select>
                </Form.Item>
            </Form>
        </div>
    )
})
export default UserForm