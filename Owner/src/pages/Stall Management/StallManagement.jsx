import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message, Row, Col } from 'antd';

const StallManagement = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [stalls, setStalls] = useState([]);
  const [editingStall, setEditingStall] = useState(null);

  const columns = [
    {
      title: 'Stall Code',
      dataIndex: 'stallCode',
      key: 'stallCode',
    },
    {
      title: 'Monthly Rent',
      dataIndex: 'monthlyRent',
      key: 'monthlyRent',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'EEU Reader',
      dataIndex: 'eeuReader',
      key: 'eeuReader',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.stallCode)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setEditingStall(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingStall(record);
    setIsModalVisible(true);
  };

  const handleDelete = (stallCode) => {
    setStalls(stalls.filter((stall) => stall.stallCode !== stallCode));
    message.success('Stall deleted successfully!');
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingStall) {
        // Update existing stall
        setStalls(stalls.map((stall) => (stall.stallCode === editingStall.stallCode ? { ...stall, ...values } : stall)));
        message.success('Stall updated successfully!');
      } else {
        // Add new stall
        setStalls([...stalls, { ...values, key: Date.now() }]);
        message.success('Stall added successfully!');
      }
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Stall
      </Button>
      <Table columns={columns} dataSource={stalls} />

      <Modal
        title={editingStall ? 'Edit Stall' : 'Add Stall'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="stallCode"
                label="Stall Code"
                rules={[{ required: true, message: 'Please enter the stall code!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="monthlyRent"
                label="Monthly Rent"
                rules={[{ required: true, message: 'Please enter the monthly rent!' }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="size"
                label="Size"
                rules={[{ required: true, message: 'Please enter the size!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="eeuReader"
                label="EEU Reader"
                rules={[{ required: true, message: 'Please enter the EEU reader!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default StallManagement;