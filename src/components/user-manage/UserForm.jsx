import { Form, Input, Select } from 'antd'
import React, { forwardRef, useEffect, useState } from 'react'

const UserForm = forwardRef((props, ref) => {
    const { Option } = Select
    const [isDisabled, setisDisabled] = useState(false)

    useEffect(() => {
        setisDisabled(props.isUpDisabled)
    },[props.isUpDisabled])

    const isSelect = (value) => {
        if(value === 1){
            setisDisabled(true)
            ref.current.setFieldsValue({
                region:''
            })
        }
        else{
            setisDisabled(false)
        }
    }
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
                    rules={isDisabled ? '': [{ required: true, message: '请选择区域!' }]}
                >
                    <Select options={props.regionList} disabled={isDisabled} />
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
                    <Select onChange={isSelect}>
                        {
                            props.roleList.map(item => <Option value={item.id} key={item.id}>{item.roleName}</Option>)
                        }
                    </Select>
                </Form.Item>
            </Form>
        </div>
    )
})
export default UserForm