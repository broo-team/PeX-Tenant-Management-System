import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Checkbox, DatePicker, message, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;


const paymentTerms = [
  { value: '1 month', label: '1 month' },
  { value: '2 months', label: '2 months' },
  { value: '3 months', label: '3 months' },
  { value: '6 months', label: '6 months' },
  { value: '12 months', label: '12 months' },
  { value: '1 year', label: '1 year' },
  { value: '2 years', label: '2 years' },
  { value: '3 years', label: '3 years' },
  { value: '5 years', label: '5 years' },
];




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
      leaseStart: "2024-01-01",
      leaseEnd: "2025-01-01",
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
        const { leasePeriod, ...rest } = values;
        const newTenant = {
          key: Date.now().toString(),
          leaseStart: leasePeriod[0].format("YYYY-MM-DD"),
          leaseEnd: leasePeriod[1].format("YYYY-MM-DD"),
          ...rest,
          registeredByAgent: isAgentRegistered,
        };
        setTenants([...tenants, newTenant]);
        form.resetFields();
        setIsModalVisible(false);
        setIsAgentRegistered(false);
        message.success("Tenant added successfully!");
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
    setTerminatedTenants([...terminatedTenants, record]);
    setTenants(tenants.filter((tenant) => tenant.key !== record.key));
    message.warning(`${record.fullName} has been terminated.`);
  };

  // Tenant Table Columns
  const columns = [
    { title: "Tenant ID", dataIndex: "tenantID", key: "tenantID" },
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Sex", dataIndex: "sex", key: "sex" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Room", dataIndex: "room", key: "room" },
    { title: "Rent Price", dataIndex: "price", key: "price" },
    {
      title: "Lease Period",
      dataIndex: "leasePeriod",
      key: "leasePeriod",
      render: (_, record) => `${dayjs(record.leaseStart).format("YYYY-MM-DD")} to ${dayjs(record.leaseEnd).format("YYYY-MM-DD")}`,
    },
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
          <Button type="link" icon={<DeleteOutlined />} danger onClick={() => handleTerminate(record)} />
        </>
      ),
    },
  ];

  // Terminated Tenants Table Columns
  const terminatedColumns = columns.filter(col => col.key !== "actions");

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
      <Modal title="Add New Tenant" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            <Form.Item name="tenantID" label="Tenant ID" rules={[{ required: true, message: "Please enter Tenant ID" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: "Please enter Full Name" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="sex" label="Sex" rules={[{ required: true, message: "Please enter Sex" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: "Please enter Phone Number" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="City" label="city" rules={[{ required: true, message: "Please enter the name of Tenant City" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="subcity" label="Sub city" rules={[{ required: true, message: "Please enter subcity" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="woreda" label="Woreda" rules={[{ required: true, message: "Please enter Woreda" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="House No" label="House No" rules={[{ required: true, message: "Please enter the Tenant House Number" }]}>
              <Input />
            </Form.Item>
            <Form.Item
            name="room"
            label="room/stall"
            rules={[{ required: true, message: 'Please select the room' }]}
          >
            <Select>
              <Option value="Active">b658</Option>
              <Option value="Expired">b69</Option>
              <Option value="Pending">b568</Option>
            </Select>
          </Form.Item>
          <Form.Item name="eeuPayment" label="EEU Payment"> <Input /> </Form.Item>
          <Form.Item name="generatorPayment" label="Generator Payment"> <Input /> </Form.Item>
          <Form.Item name="waterPayment" label="Water Payment"> <Input /> </Form.Item>
            <Form.Item name="leasePeriod" label="Lease Period" rules={[{ required: true, message: "Please select Lease Period" }]}>
              <RangePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
      name="paymentTerm"
      label="Payment Term"
      rules={[{ required: true, message: 'Please select the term of payment' }]}
    >
      <Select>
        {paymentTerms.map((term) => (
          <Option key={term.value} value={term.value}>
            {term.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
            <Form.Item name="deposit" label="deposit(optinal)">
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
              <Form.Item name="authenticationNo" label="Agent No." rules={[{ required: true, message: "Please enter Authentication No." }]}>
                <Input />
              </Form.Item>
              <Form.Item name="agentFirstName" label="Agent Full Name" rules={[{ required: true, message: "Please enter Agent First Name" }]}>
                <Input />
              </Form.Item>
              <Form.Item name="sex" label="Sex" rules={[{ required: true, message: "Please enter Sex" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: "Please enter Phone Number" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="City" label="city" rules={[{ required: true, message: "Please enter the name of Tenant City" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="subcity" label="Sub city" rules={[{ required: true, message: "Please enter subcity" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="woreda" label="Woreda" rules={[{ required: true, message: "Please enter Woreda" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="House No" label="House No" rules={[{ required: true, message: "Please enter the Tenant House Number" }]}>
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
