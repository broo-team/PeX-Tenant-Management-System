import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Checkbox } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Tenants = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAgentRegistered, setIsAgentRegistered] = useState(false);
  const [form] = Form.useForm();
  const [tenants, setTenants] = useState([
    {
      key: "1",
      tenantID: "TT001",
      fullName: "seid abdela",
      sex: "Male",
      phone: "0923797665",
      Rome: "105/12",
      Price:"8000",
      registeredByAgent: false,
    },
  ]);

  // Show modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle form submission
  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        setTenants([...tenants, { key: tenants.length + 1, ...values }]);
        form.resetFields();
        setIsModalVisible(false);
        setIsAgentRegistered(false);
      })
      .catch((error) => console.log("Validation Failed:", error));
  };

  // Handle cancel button
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setIsAgentRegistered(false);
  };

  // Table columns
  const columns = [
    { title: "Tenant ID", dataIndex: "tenantID", key: "tenantID" },
    { title: "Full Name", dataIndex: "fullName", key: "FulltName" },
    { title: "Sex", dataIndex: "sex", key: "sex" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Rome", dataIndex: "Rome", key: "Build" },
    { title: "Price", dataIndex: "Price", key: "houseNo" },
    { title: "Registered by Agent", dataIndex: "registeredByAgent", key: "registeredByAgent", render: (text) => (text ? "Yes" : "No") },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} />
          <Link to="/termination"><Button type="link" icon={"termination"} danger /></Link>
          
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Tenants</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Add Tenant
      </Button>

      <Table columns={columns} dataSource={tenants} style={{ marginTop: 20 }} />

      <Modal title="Add New Tenant" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
  <Form form={form} layout="vertical">
    {/* Main Form Fields in a Grid Layout */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
      <Form.Item name="tenantID" label="Tenant ID" rules={[{ required: true, message: "Please enter Tenant ID" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="sex" label="Sex" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="Room" label="Rome" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="Price" label="Price">
        <Input />
      </Form.Item>
      <Form.Item name="houseNo" label="House No.">
        <Input />
      </Form.Item>
    </div>

    {/* Checkbox for agent registration */}
    <Form.Item style={{ marginTop: '16px' }}>
      <Checkbox checked={isAgentRegistered} onChange={(e) => setIsAgentRegistered(e.target.checked)}>
        Registered by Agent?
      </Checkbox>
    </Form.Item>

    {/* Show extra fields if registered by agent */}
    {isAgentRegistered && (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
        <Form.Item name="authenticationNo" label="Authentication No." rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="date" label="Date" rules={[{ required: true }]}>
          <Input type="date" />
        </Form.Item>
        <Form.Item name="agentFirstName" label="Agent First Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="agentMiddleName" label="Agent Middle Name">
          <Input />
        </Form.Item>
        <Form.Item name="agentLastName" label="Agent Last Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </div>
    )}
  </Form>
</Modal>
    </div>
  );
};

export default Tenants;