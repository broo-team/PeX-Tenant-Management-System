import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Space, message, InputNumber } from 'antd';
import dayjs from 'dayjs'; // For date handling

const { RangePicker } = DatePicker;
const { Option } = Select;

const LeaseAgreements = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [leases, setLeases] = useState([]);
  const [editingLease, setEditingLease] = useState(null);

  const columns = [
    {
      title: 'Tenant Name',
      dataIndex: 'tenantName',
      key: 'tenantName',
    },
    {
      title: 'Stall Code',
      dataIndex: 'stallCode',
      key: 'stallCode',
    },
    {
      title: 'Lease Period',
      dataIndex: 'leasePeriod',
      key: 'leasePeriod',
      render: (_, record) => `${dayjs(record.leaseStart).format('YYYY-MM-DD')} to ${dayjs(record.leaseEnd).format('YYYY-MM-DD')}`,
    },
    {
      title: 'Monthly Rent',
      dataIndex: 'monthlyRent',
      key: 'monthlyRent',
    },
    {
      title: 'Lease Status',
      dataIndex: 'leaseStatus',
      key: 'leaseStatus',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.key)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setEditingLease(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      ...record,
      leasePeriod: [dayjs(record.leaseStart), dayjs(record.leaseEnd)],
    });
    setEditingLease(record);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    setLeases((prevLeases) => prevLeases.filter((lease) => lease.key !== key));
    message.success('Lease agreement deleted successfully!');
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const leaseData = {
        ...values,
        leaseStart: values.leasePeriod[0].format('YYYY-MM-DD'),
        leaseEnd: values.leasePeriod[1].format('YYYY-MM-DD'),
        key: editingLease ? editingLease.key : Date.now(),
      };
      delete leaseData.leasePeriod; // Remove the temporary leasePeriod field

      setLeases((prevLeases) =>
        editingLease
          ? prevLeases.map((lease) => (lease.key === editingLease.key ? leaseData : lease))
          : [...prevLeases, leaseData]
      );

      message.success(editingLease ? 'Lease agreement updated successfully!' : 'Lease agreement added successfully!');
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Lease Agreement
      </Button>
      <Table columns={columns} dataSource={leases} rowKey="key" />

      <Modal
        title={editingLease ? 'Edit Lease Agreement' : 'Add Lease Agreement'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="tenantName"
            label="Tenant Name"
            rules={[{ required: true, message: 'Please enter the tenant name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="stallCode"
            label="Stall Code"
            rules={[{ required: true, message: 'Please enter the stall code!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="leasePeriod"
            label="Lease Period"
            rules={[{ required: true, message: 'Please select the lease period!' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="monthlyRent"
            label="Monthly Rent"
            rules={[{ required: true, message: 'Please enter the monthly rent!' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="leaseStatus"
            label="Lease Status"
            rules={[{ required: true, message: 'Please select the lease status!' }]}
          >
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Expired">Expired</Option>
              <Option value="Pending">Pending</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LeaseAgreements;
