import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message, Row, Col, Select } from 'antd';

const StallManagement = () => {
  const initialStalls = [
    { stallCode: 'A101', monthlyRent: 500, size: '10x10', eeuReader: 'E001' },
    { stallCode: 'B202', monthlyRent: 600, size: '12x12', eeuReader: 'E002' },
    { stallCode: 'C303', monthlyRent: 700, size: '15x15', eeuReader: 'E003' },
  ];

  const [form] = Form.useForm();
  const [stallForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isStallModalVisible, setIsStallModalVisible] = useState(false);
  const [stalls, setStalls] = useState(initialStalls);
  const [rooms, setRooms] = useState(['']);
  const [editingStall, setEditingStall] = useState(null);
  const [selectedStall, setSelectedStall] = useState(null);
  const [stallCodeInputs, setStallCodeInputs] = useState([{ id: 1, value: '' }]); // Dynamic stall code inputs

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

  const handleAddStall = () => {
    form.resetFields();
    setEditingStall(null);
    setRooms(['']);
    setSelectedStall(null);
    setIsModalVisible(true);
  };

  const handleCreateStall = () => {
    setStallCodeInputs([{ id: 1, value: '' }]); // Reset to one input
    setIsStallModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingStall(record);
    setRooms(record.rooms || ['']);
    setSelectedStall(record.stallCode);
    setIsModalVisible(true);
  };

  const handleDelete = (stallCode) => {
    setStalls(stalls.filter((stall) => stall.stallCode !== stallCode));
    message.success('Stall deleted successfully!');
  };

  const handleStallOk = () => {
    const stallCodes = stallCodeInputs.map((input) => input.value.trim()).filter((code) => code !== '');

    if (stallCodes.length === 0) {
      message.error('Please enter at least one stall code!');
      return;
    }

    const newStalls = stallCodes.map((code) => ({
      stallCode: code,
      size: '10x10', // Default size, can be customized
      monthlyRent: 500, // Default rent, can be customized
      eeuReader: 'E000', // Default EEU reader, can be customized
      rooms: [], // Initialize with empty rooms
    }));

    setStalls([...stalls, ...newStalls]);
    message.success(`${stallCodes.length} new stalls created successfully!`);
    setIsStallModalVisible(false);
  };

  const handleAddOk = () => {
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
    setIsStallModalVisible(false);
  };

  const addRoom = () => {
    setRooms([...rooms, '']);
  };

  const handleRoomChange = (value, index) => {
    const newRooms = [...rooms];
    newRooms[index] = value;
    setRooms(newRooms);
  };

  const addStallCodeInput = () => {
    setStallCodeInputs([...stallCodeInputs, { id: Date.now(), value: '' }]);
  };

  const handleStallCodeChange = (e, id) => {
    const updatedInputs = stallCodeInputs.map((input) =>
      input.id === id ? { ...input, value: e.target.value } : input
    );
    setStallCodeInputs(updatedInputs);
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAddStall}>Add Stall</Button>
        <Button type="default" onClick={handleCreateStall}>Create Stall</Button>
      </Space>

      <Table columns={columns} dataSource={stalls} rowKey="stallCode" />

      {/* Modal for Adding Stall with Room Selection */}
      <Modal
        title={editingStall ? 'Edit Stall' : 'Add Stall'}
        visible={isModalVisible}
        onOk={handleAddOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="stallCode"
            label="Stall Code"
            rules={[{ required: true, message: 'Please select a stall!' }]}
          >
            <Select
              placeholder="Select a stall"
              onChange={(value) => {
                setSelectedStall(value);
                const stall = stalls.find((s) => s.stallCode === value);
                form.setFieldsValue(stall);
              }}
            >
              {stalls.map((stall) => (
                <Select.Option key={stall.stallCode} value={stall.stallCode}>
                  {stall.stallCode}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="size" label="Meter Square">
                <Input disabled={!selectedStall} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="monthlyRent" label="Monthly Rent">
                <InputNumber style={{ width: '100%' }} disabled={!selectedStall} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="eeuReader" label="EEU Reader">
            <Input disabled={!selectedStall} />
          </Form.Item>

          {/* Dynamic Room Inputs */}
          <Form.Item label="Rooms">
            {rooms.map((room, index) => (
              <Input
                key={index}
                value={room}
                onChange={(e) => handleRoomChange(e.target.value, index)}
                placeholder="Enter room number"
                style={{ marginBottom: 8 }}
                disabled={!selectedStall}
              />
            ))}
            <Button type="dashed" onClick={addRoom} block disabled={!selectedStall}>
              + Add Room
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Creating New Stalls */}
      <Modal
        title="Create New Stalls"
        visible={isStallModalVisible}
        onOk={handleStallOk}
        onCancel={handleCancel}
      >
        <Form form={stallForm} layout="vertical">
          {stallCodeInputs.map((input) => (
            <Form.Item
              key={input.id}
              label={`Stall Code`}
            >
              <Input
                value={input.value}
                onChange={(e) => handleStallCodeChange(e, input.id)}
                placeholder="Enter stall code"
              />
            </Form.Item>
          ))}
          <Button type="dashed" onClick={addStallCodeInput} block>
            + Add More Stall Codes
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default StallManagement;