import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message, Row, Col, Select, List } from 'antd';

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
  const [stallCodeInputs, setStallCodeInputs] = useState([{ id: 1, value: '' }]);
  const [newStallsList, setNewStallsList] = useState([]);

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
    setStallCodeInputs([{ id: 1, value: '' }]);
    setNewStallsList([]);
    setIsStallModalVisible(true);  // Opens the modal for creating stalls
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
      size: '10x10',
      monthlyRent: 500,
      eeuReader: 'E000',
      rooms: [],
    }));

    setNewStallsList(newStalls);
    setStalls([...stalls, ...newStalls]);
    message.success(`${stallCodes.length} new stalls created successfully!`);
    setStallCodeInputs([{ id: 1, value: '' }]);
  };

  const handleAddSave = () => {
    form.validateFields().then((values) => {
      const updatedData = { ...values, rooms };
      if (editingStall) {
        setStalls(stalls.map((stall) => (stall.stallCode === editingStall.stallCode ? updatedData : stall)));
        message.success('Stall updated successfully!');
      } else {
        setStalls([...stalls, { ...updatedData, key: Date.now() }]);
        message.success('Stall added successfully!');
      }
      form.resetFields();
      setRooms(['']);
      setEditingStall(null);
      setSelectedStall(null);
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

  const handleEditNewStall = (stallCode) => {
    const stallToEdit = newStallsList.find((stall) => stall.stallCode === stallCode);
    setEditingStall(stallToEdit);
    setIsStallModalVisible(true);
  };

  const handleDeleteNewStall = (stallCode) => {
    setNewStallsList(newStallsList.filter((stall) => stall.stallCode !== stallCode));
    message.success('Stall deleted successfully!');
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="default" onClick={handleCreateStall}>Create Stall</Button> {/* Change text here */}
        <Button type="primary" onClick={handleAddStall}>Add Room</Button>
      </Space>

      <Table columns={columns} dataSource={stalls} rowKey="stallCode" />

      {/* Modal for Adding Stall with Room Selection */}
      <Modal
        title={editingStall ? 'Edit Stall' : 'Add Stall'}
        visible={isModalVisible}
        onOk={handleAddSave}
        onCancel={handleCancel}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="stallCode"
            label="Stall Code"
            rules={[{ required: true, message: 'Please select a stall!' }]}>
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

          <Form.Item label="Room">
            <InputNumber style={{ width: '100%' }} disabled={!selectedStall} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Creating New Stalls */}
      <Modal
        title="Create New Stalls"
        visible={isStallModalVisible}
        onOk={handleStallOk}
        onCancel={handleCancel}
        footer={[
          // <Button key="back" onClick={handleCancel}>
          //   Close
          // </Button>
        ]}
      >
        <Form form={stallForm} layout="vertical">
          {stallCodeInputs.map((input) => (
            <Row gutter={16} key={input.id}>
              <Col span={18}>
                <Form.Item label={`Stall Code`}>
                  <Input
                    value={input.value}
                    onChange={(e) => handleStallCodeChange(e, input.id)}
                    placeholder="Enter stall code"
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                
                <Button style={{ marginTop: 30 }} key="submit" type="primary" onClick={handleStallOk}>
            Create Stalls
          </Button>
              </Col>
            </Row>
          ))}
        </Form>
        
        {newStallsList.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h4>Newly Created Stalls:</h4>
            <List
              dataSource={newStallsList}
              renderItem={(item) => (
                <List.Item>
                  {item.stallCode} - {item.size} - ${item.monthlyRent}
                  <Space>
                    <Button type="link" onClick={() => handleEditNewStall(item.stallCode)}>Edit</Button>
                    <Button type="link" danger onClick={() => handleDeleteNewStall(item.stallCode)}>Delete</Button>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StallManagement;