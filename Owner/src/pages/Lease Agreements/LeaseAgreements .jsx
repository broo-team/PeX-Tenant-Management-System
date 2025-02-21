import React, { useState } from 'react';
import { Table, Button, Space, message } from 'antd';
import dayjs from 'dayjs'; // For date handling

const LeaseAgreements = () => {
  const [leases, setLeases] = useState([]);

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
          <Button type="link" danger onClick={() => handleDelete(record.key)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const handleDelete = (key) => {
    setLeases((prevLeases) => prevLeases.filter((lease) => lease.key !== key));
    message.success('Lease agreement deleted successfully!');
  };

  return (
    <div>
      <Table columns={columns} dataSource={leases} rowKey="key" />
    </div>
  );
};

export default LeaseAgreements;
