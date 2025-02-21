import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

// Utility rates based on Ethiopian electric rules
const electricityRates = [
  { limit: 100, rate: 1 }, // First 100 kWh at 1 Birr/kWh
  { limit: 300, rate: 2 }, // Next 200 kWh at 2 Birr/kWh
  { limit: Infinity, rate: 3 }, // Above 300 kWh at 3 Birr/kWh
];

const Utility = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  
  const [utilities, setUtilities] = useState([
    {
      key: "1",
      tenantID: "TT001",
      initialReading: 1000,
      currentReading: 1000101,
      waterUsage: 300, // in liters
      rentPrice: 8000, // Tenant's rent price
      date: "2025-02-21",
    },
  ]);

  // Show Add Utility Modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle Form Submission
  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        // Calculate electricity usage
        const electricityUsage = values.currentReading - values.initialReading;
        
        // Calculate electricity cost based on Ethiopian rates
        let electricityCost = 0;
        let remainingUsage = electricityUsage;
        
        for (let i = 0; i < electricityRates.length; i++) {
          const { limit, rate } = electricityRates[i];
          const usageInSlab = Math.min(remainingUsage, limit);
          electricityCost += usageInSlab * rate;
          remainingUsage -= usageInSlab;
          if (remainingUsage <= 0) break;
        }

        // Calculate water cost
        const waterCost = values.waterUsage * 5; // Example: 5 Birr per liter

        // Calculate total payment (rent + utilities)
        const totalPayment = parseFloat(values.rentPrice) + electricityCost + waterCost;

        // Add new utility record
        setUtilities([...utilities, {
          key: utilities.length + 1,
          ...values,
          electricityUsage,
          electricityCost,
          waterCost,
          totalPayment,
        }]);
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch((error) => console.log("Validation Failed:", error));
  };

  // Handle Cancel Modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Utility Table Columns
  const columns = [
    { title: "Tenant ID", dataIndex: "tenantID", key: "tenantID" },
    { title: "Initial Reading", dataIndex: "initialReading", key: "initialReading" },
    { title: "Current Reading", dataIndex: "currentReading", key: "currentReading" },
    { title: "Electricity Usage (kWh)", dataIndex: "electricityUsage", key: "electricityUsage" },
    { title: "Water Usage (liters)", dataIndex: "waterUsage", key: "waterUsage" },
    { title: "Rent Price", dataIndex: "rentPrice", key: "rentPrice" },
    { title: "Electricity Cost", dataIndex: "electricityCost", key: "electricityCost" },
    { title: "Water Cost", dataIndex: "waterCost", key: "waterCost" },
    { title: "Total Payment", dataIndex: "totalPayment", key: "totalPayment" },
    { title: "Date", dataIndex: "date", key: "date" },
  ];

  return (
    <div>
      <h2>Utility Usage</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Add Utility Usage
      </Button>

      <Table columns={columns} dataSource={utilities} style={{ marginTop: 20 }} />

      {/* Add Utility Modal */}
      <Modal
        title="Add Utility Usage"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="tenantID"
            label="Tenant ID"
            rules={[{ required: true, message: "Please enter Tenant ID" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="initialReading"
            label="Initial Meter Reading"
            rules={[{ required: true, message: "Please enter initial reading" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="currentReading"
            label="Current Meter Reading"
            rules={[{ required: true, message: "Please enter current reading" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="waterUsage"
            label="Water Usage (liters)"
            rules={[{ required: true, message: "Please enter water usage" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="rentPrice"
            label="Rent Price"
            rules={[{ required: true, message: "Please enter rent price" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select the date" }]}
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Utility;
