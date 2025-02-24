import React, { useState } from 'react';
import { Table, Button, Space, message, DatePicker, Input, Modal, Form, InputNumber } from 'antd';
import dayjs from 'dayjs';
import { EditOutlined, CheckCircleOutlined, CloudServerOutlined } from '@ant-design/icons';

const Payments = () => {
  const [payments, setPayments] = useState([
    { key: 1, tenantName: 'Sied Abdela', stallCode: 's101', paymentDate: '2024-02-15', paymentTerm: 'Monthly', amount: 500, status: 'Unpaid', 
       paymentDuty: '2024-02-28',usesEEU: false},
    { key: 2, tenantName: 'Brook Tefera', stallCode: 'B202', paymentDate: '2024-02-20', amount: 700, status: 'Paid', 
      usesGenerator: false, usesEEU: true, usesWater: false, paymentTerm: 'Quarterly', paymentDuty: '2024-05-20' },
  ]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [utilityFormData, setUtilityFormData] = useState({ generatorUsage: 0, eeuUsage: 0, waterUsage: 0 });

  const handleMarkAsPaid = (key) => {
    setPayments(payments.map(payment => 
      payment.key === key ? { ...payment, status: 'Paid' } : payment
    ));
    message.success('Payment marked as Paid!');
  };

  const handleSearch = (filters) => {
    const filtered = payments.filter(payment => {
      const matchesTenant = filters.tenantName ? payment.tenantName.toLowerCase().includes(filters.tenantName.toLowerCase()) : true;
      const matchesDate = filters.paymentDate ? dayjs(payment.paymentDate).isSame(filters.paymentDate, 'day') : true;
      return matchesTenant && matchesDate;
    });
    setFilteredPayments(filtered.length > 0 ? filtered : payments);
  };

  const handleUtilityChange = (field, value) => {
    setUtilityFormData({ ...utilityFormData, [field]: value });
  };

  const handleUtilitySubmit = () => {
    message.success('Utility usage recorded!');
    setIsModalVisible(false);
  };

  const columns = [
    { title: 'Tenant Name', dataIndex: 'tenantName', key: 'tenantName' },
    { title: 'Stall Code', dataIndex: 'stallCode', key: 'stallCode' },
    {
      title: 'Payment Term',
      dataIndex: 'paymentTerm',
      key: 'paymentTerm',
      render: (term) => term,
    },
    {
      title: 'Payment Duty',
      dataIndex: 'paymentDuty',
      key: 'paymentDuty',
      render: (duty) => dayjs(duty).format('YYYY-MM-DD'),
    },
    {
      title: 'Utility Section',
      key: 'utilitySection',
      render: (_, record) => (
        <Space size="middle">
          {record.usesGenerator && (
            <Button
              icon={<CloudServerOutlined />}
              onClick={() => {
                setSelectedPayment(record);
                setIsModalVisible(true);
              }}
            >
              Generator
            </Button>
          )}
          {record.usesEEU && (
            <Button
              icon={<CheckCircleOutlined />}
              onClick={() => {
                setSelectedPayment(record);
                setIsModalVisible(true);
              }}
            >
              Utility
            </Button>
          )}
          {record.usesWater && (
            <Button
              icon={"dropout"}
              onClick={() => {
                setSelectedPayment(record);
                setIsModalVisible(true);
              }}
            >
              Water
            </Button>
          )}
        </Space>
      ),
    },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'Unpaid' && (
            <Button type="link" onClick={() => handleMarkAsPaid(record.key)}>Pay</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input placeholder="Search by Tenant Name" onChange={e => handleSearch({ tenantName: e.target.value })} />
        <DatePicker placeholder="Search by Payment Date" onChange={date => handleSearch({ paymentDate: date })} />
      </Space>
      <Table columns={columns} dataSource={filteredPayments.length > 0 ? filteredPayments : payments} />

      <Modal
        title="Enter Utility Usage"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleUtilitySubmit}
      >
        <Form layout="vertical">
          <Form.Item label="Generator Usage (hours)">
            <InputNumber
              value={utilityFormData.generatorUsage}
              onChange={(value) => handleUtilityChange('generatorUsage', value)}
              min={0}
            />
          </Form.Item>
          <Form.Item label="EEU Usage (kWh)">
            <InputNumber
              value={utilityFormData.eeuUsage}
              onChange={(value) => handleUtilityChange('eeuUsage', value)}
              min={0}
            />
          </Form.Item>
          <Form.Item label="Water Usage (cubic meters)">
            <InputNumber
              value={utilityFormData.waterUsage}
              onChange={(value) => handleUtilityChange('waterUsage', value)}
              min={0}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Payments;
