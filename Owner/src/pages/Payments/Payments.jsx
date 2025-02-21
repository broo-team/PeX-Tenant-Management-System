import React, { useState } from 'react';
import { Table, Button, Space, message, DatePicker, Input } from 'antd';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';

const Payments = () => {
  const [payments, setPayments] = useState([
    { key: 1, tenantName: 'Sied Abdela', stallCode: 's101', paymentDate: '2024-02-15', amount: 500, status: 'Unpaid' },
    { key: 2, tenantName: 'Brook tefera', stallCode: 'B202', paymentDate: '2024-02-20', amount: 700, status: 'Paid' },
  ]);
  const [filteredPayments, setFilteredPayments] = useState([]);

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

  const columns = [
    { title: 'Tenant Name', dataIndex: 'tenantName', key: 'tenantName' },
    { title: 'Stall Code', dataIndex: 'stallCode', key: 'stallCode' },
    { 
      title: 'Payment Date', 
      dataIndex: 'paymentDate', 
      key: 'paymentDate',
      render: date => dayjs(date).format('YYYY-MM-DD'),
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
    </div>
  );
};

export default Payments;
