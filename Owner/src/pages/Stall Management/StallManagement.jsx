import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message, Row, Col, Select } from 'antd';

const StallManagement = () => {
 const dummyStalls = [
    { stallCode: 'A101', monthlyRent: 500, size: '10x10', eeuReader: 'E001' },
    { stallCode: 'B202', monthlyRent: 600, size: '12x12', eeuReader: 'E002' },
    { stallCode: 'C303', monthlyRent: 700, size: '15x15', eeuReader: 'E003' },
  ];




  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [stalls, setStalls] = useState(dummyStalls);
  const [rooms, setRooms] = useState(['']); // Store room numbers dynamically
  const [editingStall, setEditingStall] = useState(null);
  
 
  const columns = [
    { title: 'Stall Code', dataIndex: 'stallCode', key: 'stallCode' },
    { title: 'Rooms', dataIndex: 'rooms', key: 'rooms', render: (rooms) => rooms?.join(', ') || '-' },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    { title: 'Monthly Rent', dataIndex: 'monthlyRent', key: 'monthlyRent' },
    { title: 'EEU Reader', dataIndex: 'eeuReader', key: 'eeuReader' },
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
    setRooms(['']);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingStall(record);
    setRooms(record.rooms || ['']);
    setIsModalVisible(true);
  };

  const handleDelete = (stallCode) => {
    setStalls(stalls.filter((stall) => stall.stallCode !== stallCode));
    message.success('Stall deleted successfully!');
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const updatedData = { ...values, rooms };
      if (editingStall) {
        setStalls(stalls.map((stall) => (stall.stallCode === editingStall.stallCode ? updatedData : stall)));
        message.success('Stall updated successfully!');
      } else {
        setStalls([...stalls, { ...updatedData, key: Date.now() }]);
        message.success('Stall added successfully!');
      }
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const addRoom = () => {
    setRooms([...rooms, '']);
  };

  const handleRoomChange = (value, index) => {
    const newRooms = [...rooms];
    newRooms[index] = value;
    setRooms(newRooms);
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
                <Select>
                  {stalls.map((stall) => (
                    <Select.Option key={stall.stallCode} value={stall.stallCode}>
                      {stall.stallCode}
                    </Select.Option>
                  ))}
                </Select>
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

          {/* Dynamic Room Inputs */}
          <Row gutter={16}>
            <Col span={24}>
              <label>Rooms</label>
              {rooms.map((room, index) => (
                <Input
                  key={index}
                  value={room}
                  onChange={(e) => handleRoomChange(e.target.value, index)}
                  placeholder="Enter room number"
                  style={{ marginBottom: 8 }}
                />
              ))}
              <Button type="dashed" onClick={addRoom} block>
                + Add Room
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default StallManagement;
