import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Row, Col, Select, Space, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const StallManagement = () => {
  const [form] = Form.useForm();
  const [stallForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isStallModalVisible, setIsStallModalVisible] = useState(false);
  const [stalls, setStalls] = useState([]);
  const [stallCodeInputs, setStallCodeInputs] = useState([{ id: 1, value: '' }]);

  useEffect(() => {
    fetchStalls();
  }, []);

  const fetchStalls = async () => {
    try {
      const response = await axios.get('http://localhost:5000/stalls');
      setStalls(response.data);
    } catch (error) {
      message.error("Failed to fetch stalls");
    }
  };

  const handleCreateStall = async () => {
    const stallCodes = stallCodeInputs.map(input => input.value.trim()).filter(code => code !== '');
    if (stallCodes.length === 0) {
      message.error("Please enter at least one stall code!");
      return;
    }
    try {
      await Promise.all(
        stallCodes.map(code => axios.post('http://localhost:5000/stalls', { stallCode: code, building_id: 3 }))
      );
      message.success(`${stallCodes.length} new stalls created successfully!`);
      fetchStalls();
      setStallCodeInputs([{ id: 1, value: '' }]);
      setIsStallModalVisible(false);
    } catch (error) {
      message.error("Failed to create stalls");
    }
  };

  const addStallCodeInput = () => {
    setStallCodeInputs([...stallCodeInputs, { id: Date.now(), value: '' }]);
  };

  const handleStallCodeChange = (e, id) => {
    const updatedInputs = stallCodeInputs.map(input =>
      input.id === id ? { ...input, value: e.target.value } : input
    );
    setStallCodeInputs(updatedInputs);
  };

  const columns = [
    { title: 'Stall Code', dataIndex: 'stallCode', key: 'stallCode' },
    {
      title: 'Rooms',
      dataIndex: 'rooms',
      key: 'rooms',
      render: (rooms) => {
        if (Array.isArray(rooms)) {
          return rooms.join(', ');
        } else if (typeof rooms === 'string') {
          return rooms;
        }
        return '-';
      }
    },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    { title: 'Monthly Rent', dataIndex: 'monthlyRent', key: 'monthlyRent' },
    { title: 'EEU Reader', dataIndex: 'eeuReader', key: 'eeuReader' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => {
            form.setFieldsValue(record);
            setIsModalVisible(true);
          }}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.stallCode)}>Delete</Button>
        </Space>
      )
    }
  ];

  const handleDelete = async (stallCode) => {
    try {
      await axios.delete(`http://localhost:5000/stalls/${stallCode}`);
      message.success("Stall deleted successfully!");
      fetchStalls();
    } catch (error) {
      message.error("Failed to delete stall");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="default" onClick={() => setIsStallModalVisible(true)}>Create Stall</Button>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>Add Details</Button>
      </Space>

      <Table columns={columns} dataSource={stalls} rowKey="stallCode" />

      {/* Modal for Add/Edit Stall Details */}
      <Modal
        title="Add/Edit Stall Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
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
                const stall = stalls.find(s => s.stallCode === value);
                form.setFieldsValue(stall);
              }}
            >
              {stalls.map(stall => (
                <Option key={stall.stallCode} value={stall.stallCode}>{stall.stallCode}</Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="size" label="Meter Square">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="monthlyRent" label="Monthly Rent">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="eeuReader" label="EEU Reader">
            <Input />
          </Form.Item>
          <Form.Item name="rooms" label="Rooms">
            <Select mode="tags" placeholder="Add rooms" />
          </Form.Item>
          <Button
            type="primary"
            onClick={async () => {
              try {
                const values = await form.validateFields();
                await axios.post(`http://localhost:5000/stalls/${values.stallCode}/details`, values);
                message.success("Stall details added successfully!");
                fetchStalls();
                setIsModalVisible(false);
              } catch (error) {
                message.error("Failed to save stall details");
              }
            }}
          >
            Save
          </Button>
        </Form>
      </Modal>

      {/* Modal for Create New Stalls */}
      <Modal
        title="Create New Stalls"
        visible={isStallModalVisible}
        onCancel={() => setIsStallModalVisible(false)}
        footer={null}
      >
        <Form form={stallForm} layout="vertical">
          {stallCodeInputs.map(input => (
            <Row gutter={16} key={input.id}>
              <Col span={18}>
                <Form.Item label="Stall Code">
                  <Input
                    value={input.value}
                    onChange={(e) => handleStallCodeChange(e, input.id)}
                    placeholder="Enter stall code"
                  />
                </Form.Item>
              </Col>
            </Row>
          ))}
          <Button type="primary" style={{ marginTop: 16 }} onClick={handleCreateStall}>
            Create Stalls
          </Button>
          <Button type="dashed" onClick={addStallCodeInput} style={{ width: '100%', marginTop: 16 }}>
            Add Another Stall Code
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default StallManagement;
