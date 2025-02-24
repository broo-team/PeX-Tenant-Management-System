import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const Utility = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [electricityRate, setElectricityRate] = useState(2.5); // Configurable electricity rate
  const [waterRate, setWaterRate] = useState(5); // Configurable water rate
  const [generatorRate, setGeneratorRate] = useState(10); // Configurable generator rate

  const [utilities, setUtilities] = useState([
    {
      key: "1",
      electricityRate: 2.5,
      waterRate: 5,
      generatorRate: 10,
    },
  ]);

  // Show Add Utility Modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle Form Submission
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // Add or update the utility record
        const updatedUtility = {
          key: utilities.length + 1,
          electricityRate: values.electricityRate,
          waterRate: values.waterRate,
          generatorRate: values.generatorRate,
        };

        setUtilities((prevUtilities) => [...prevUtilities, updatedUtility]);
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
    { title: "Electricity Rate (Birr/kWh)", dataIndex: "electricityRate", key: "electricityRate" },
    { title: "Water Rate (Birr/liter)", dataIndex: "waterRate", key: "waterRate" },
    { title: "Generator Rate (Birr/hour)", dataIndex: "generatorRate", key: "generatorRate" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <span>
          <Button
            type="link"
            onClick={() => handleEdit(record.key)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.key)}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  // Handle Edit Utility Record
  const handleEdit = (key) => {
    const selectedUtility = utilities.find((utility) => utility.key === key);
    form.setFieldsValue({
      electricityRate: selectedUtility.electricityRate,
      waterRate: selectedUtility.waterRate,
      generatorRate: selectedUtility.generatorRate,
    });
    setIsModalVisible(true);
  };

  // Handle Delete Utility Record
  const handleDelete = (key) => {
    setUtilities((prevUtilities) => prevUtilities.filter((utility) => utility.key !== key));
    message.success("Utility record deleted");
  };

  return (
    <div>
      <h2>Utility Rates</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Add Utility Rate
      </Button>

      <Table columns={columns} dataSource={utilities} style={{ marginTop: 20 }} />

      {/* Add/Edit Utility Modal */}
      <Modal
        title="Add or Edit Utility Rate"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="electricityRate"
            label="Electricity Rate (Birr/kWh)"
            rules={[{ required: true, message: "Please enter electricity rate" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="waterRate"
            label="Water Rate (Birr/liter)"
            rules={[{ required: true, message: "Please enter water rate" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="generatorRate"
            label="Generator Rate (Birr/hour)"
            rules={[{ required: true, message: "Please enter generator rate" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Utility;
