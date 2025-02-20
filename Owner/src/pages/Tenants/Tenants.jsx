import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Checkbox, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Tenants = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAgentRegistered, setIsAgentRegistered] = useState(false);
  const [form] = Form.useForm();
  
  // Active Tenants List
  const [tenants, setTenants] = useState([
    {
      key: "1",
      tenantID: "TT001",
      fullName: "Seid Abdela",
      sex: "Male",
      phone: "0923797665",
      room: "105/12",
      price: "8000",
      registeredByAgent: false,
    },
  ]);

  // Terminated Tenants List
  const [terminatedTenants, setTerminatedTenants] = useState([]);

  // Show Add Tenant Modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle Form Submission
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

  // Handle Cancel Modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setIsAgentRegistered(false);
  };

  // Handle Tenant Termination
  const handleTerminate = (record) => {
    setTerminatedTenants([...terminatedTenants, record]); // Move to terminated list
    setTenants(tenants.filter((tenant) => tenant.key !== record.key)); // Remove from active list
    message.warning(`${record.fullName} has been terminated.`);
  };

  // Tenant Table Columns
  const columns = [
    { title: "Tenant ID", dataIndex: "tenantID", key: "tenantID" },
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Sex", dataIndex: "sex", key: "sex" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Room", dataIndex: "room", key: "room" },
    { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Registered by Agent",
      dataIndex: "registeredByAgent",
      key: "registeredByAgent",
      render: (text) => (text ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} />
          <Link to={"/termination"}><Button  type="link" icon={"termination"} danger onClick={() => handleTerminate(record)} /></Link>
          
        </>
      ),
    },
  ];

  // Terminated Tenants Table Columns
  const terminatedColumns = [...columns].map((col) => ({ ...col })); // Copy columns
  terminatedColumns.pop(); // Remove the "Actions" column for terminated tenants

  return (
    <div>
      <h2>Tenants</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Add Tenant
      </Button>

      <Table columns={columns} dataSource={tenants} style={{ marginTop: 20 }} />

      {/* Terminated Tenants Table */}
      {terminatedTenants.length > 0 && (
        <>
          <h2 style={{ marginTop: 40 }}>Terminated Tenants</h2>
          <Table columns={terminatedColumns} dataSource={terminatedTenants} style={{ marginTop: 20 }} />
        </>
      )}

      {/* Add Tenant Modal */}
      <Modal title="Add New Tenant" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
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
            <Form.Item name="room" label="Room" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Price">
              <Input />
            </Form.Item>
          </div>

          {/* Checkbox for Agent Registration */}
          <Form.Item>
            <Checkbox checked={isAgentRegistered} onChange={(e) => setIsAgentRegistered(e.target.checked)}>
              Registered by Agent?
            </Checkbox>
          </Form.Item>

          {/* Show Extra Fields if Registered by Agent */}
          {isAgentRegistered && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
              <Form.Item name="authenticationNo" label="Authentication No." rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                <Input type="date" />
              </Form.Item>
              <Form.Item name="agentFirstName" label="Agent First Name" rules={[{ required: true }]}>
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
