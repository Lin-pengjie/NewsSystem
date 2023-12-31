import React, { useEffect, useState, useRef, useContext } from 'react'
import { Button, Form, Input, Table } from 'antd'
import axios from 'axios'
import { DeleteOutlined } from '@ant-design/icons';

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
}

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

export default function NewsClassification() {
  const [dataSource, setdataSource] = useState([])

  const handleSave = (record)=>{
    // console.log(record)

    setdataSource(dataSource.map(item=>{
        if(item.id===record.id){
            return {
                id:item.id,
                title:record.title,
                value:record.title
            }
        }
        return item
    }))

    axios.patch(`/categories/${record.id}`,{
        title:record.title,
        value:record.title
    })
}

  useEffect(() => {
    axios('/categories').then(res => {
      setdataSource(res.data)
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave: handleSave,
      }),
    },
    {
      title: '操作',
      render: (item) => <Button shape="circle" danger icon={<DeleteOutlined />} />
    },
  ]

  return (
    <div>
      <Table components={{
        body: {
          row: EditableRow,
          cell: EditableCell,
        }
      }}
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
        pagination={{ pageSize: 5 }} />
    </div>
  )
}
