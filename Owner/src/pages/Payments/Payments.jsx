import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  message,
  DatePicker,
  Input,
  Modal,
  Form,
  InputNumber,
} from "antd";
import dayjs from "dayjs";
import { CheckCircleOutlined } from "@ant-design/icons";
import axios from "axios";

// Define utility types for easy iteration and labeling.
// Note: For EEU we use key "electricity" but the tenant property to check is "eeu_payment".
const utilityTypes = [
  { key: "electricity", label: "EEU", paymentField: "eeu_payment" },
  { key: "water", label: "Water", paymentField: "water_payment" },
  { key: "generator", label: "Generator", paymentField: "generator_payment" },
];

const Payments = () => {
  // State for tenants merged with their utility usage records (grouped by utility type).
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);

  // Modal states.
  const [isModalVisible, setIsModalVisible] = useState(false); // For entering meter readings (bill generation)
  const [isProofModalVisible, setIsProofModalVisible] = useState(false); // For uploading payment proofs
  const [isBillModalVisible, setIsBillModalVisible] = useState(false); // For admin viewing & approving proofs

  // Selected tenant (merged record) and form hooks.
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [form] = Form.useForm();
  const [proofForm] = Form.useForm();

  // ---------------------------
  // Fetch Data: First update overdue penalties, then get tenant and utility usage records.
  // Group usage records by utility type.
  // ---------------------------
  const fetchData = async () => {
    try {
      // Update overdue penalties in the database.
      await axios.put("http://localhost:5000/api/utilities/updatePenalties");

      // Fetch tenants and usage records.
      const [tenantsRes, usageRes] = await Promise.all([
        axios.get("http://localhost:5000/api/tenants"),
        axios.get("http://localhost:5000/api/utilities/tenant_utility_usage"),
      ]);

      // For each tenant, group usage records by utility type.
      const mergedData = tenantsRes.data.map((tenant) => {
        const usages = usageRes.data.filter(
          (u) => Number(u.tenant_id) === Number(tenant.id)
        );
        // Group by utility type, selecting the record with the highest id.
        const utilityRecords = {};
        usages.forEach((u) => {
          const key = u.utility_type; // "electricity", "water", or "generator"
          if (!utilityRecords[key] || Number(u.id) > Number(utilityRecords[key].id)) {
            utilityRecords[key] = u;
          }
        });
        return {
          ...tenant,
          utility_usage: utilityRecords, // e.g. { electricity: {…}, water: {…} }
        };
      });

      // Filter out terminated tenants.
      const activeData = mergedData.filter((tenant) => !tenant.terminated);
      setPayments(activeData);
      setFilteredPayments(activeData);
    } catch (error) {
      message.error("Failed to fetch tenants or usage data");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredPayments(payments);
  }, [payments]);

  // ---------------------------
  // Pre-populate previous reading fields when a tenant is selected.
  // ---------------------------
  useEffect(() => {
    if (selectedPayment && selectedPayment.utility_usage) {
      const fields = {};
      utilityTypes.forEach(({ key, paymentField }) => {
        if (selectedPayment[paymentField]) {
          if (selectedPayment.utility_usage[key]) {
            fields[`${key}_previous`] = Number(
              selectedPayment.utility_usage[key].current_reading
            );
          }
        }
      });
      form.setFieldsValue(fields);
    }
  }, [selectedPayment, form]);

  // ---------------------------
  // Handler: Mark a tenant's regular payment (e.g., rent) as paid.
  // ---------------------------
  const handleMarkAsPaid = async (tenantId) => {
    try {
      await axios.put(`http://localhost:5000/api/tenants/${tenantId}/pay`);
      message.success("Payment marked as Paid!");
      fetchData();
    } catch (error) {
      message.error("Failed to update payment status");
      console.error(error);
    }
  };

  // ---------------------------
  // Search Function.
  // ---------------------------
  const handleSearch = (filters) => {
    const filtered = payments.filter((payment) => {
      const matchesTenant = filters.tenantName
        ? payment.full_name.toLowerCase().includes(filters.tenantName.toLowerCase())
        : true;
      // Payment date filtering is not implemented.
      return matchesTenant;
    });
    setFilteredPayments(filtered.length > 0 ? filtered : payments);
  };

  // ---------------------------
  // Modal: Utility Usage Submission (Bill Generation).
  // ---------------------------
  const showUtilityModal = (payment) => {
    setSelectedPayment(payment);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Check each utility independently so that if a tenant is responsible for multiple utilities,
  // all payloads will be processed.
  const handleUtilitySubmit = async () => {
    if (!selectedPayment) {
      return message.error("No tenant selected");
    }
    try {
      const values = await form.validateFields();
      const payloads = [];

      utilityTypes.forEach(({ key, label, paymentField }) => {
        if (selectedPayment[paymentField]) {
          if (values[`${key}_previous`] == null || values[`${key}_current`] == null) {
            return message.error(`Enter both previous and current ${label} readings`);
          }
          payloads.push({
            tenant_id: selectedPayment.id,
            utility_type: key,
            previous_reading: values[`${key}_previous`],
            current_reading: values[`${key}_current`],
          });
        }
      });

      // Submit each utility payload.
      for (const payload of payloads) {
        await axios.post("http://localhost:5000/api/utilities/usage", payload);
      }

      message.success(`Bill Generated for ${payloads.length} utility(ies)!`);
      fetchData();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to record utility usage");
      console.error(error);
    }
  };

  // ---------------------------
  // Modal: Payment Proof Upload (Tenant Side).
  // Now allow separate proofs for each utility that is in "Bill Generated" state.
  // ---------------------------
  const showProofModal = (payment) => {
    setSelectedPayment(payment);
    proofForm.resetFields();
    setIsProofModalVisible(true);
  };

  const handleProofSubmit = async () => {
    try {
      const values = await proofForm.validateFields();
      // Iterate over each utility type and update its proof if applicable.
      for (const { key, label, paymentField } of utilityTypes) {
        if (selectedPayment[paymentField]) {
          const usage = selectedPayment.utility_usage ? selectedPayment.utility_usage[key] : null;
          if (
            usage &&
            usage.utility_status === "Bill Generated" &&
            values[`${key}_payment_proof_link`]
          ) {
            const payload = {
              tenant_id: selectedPayment.id,
              usage_id: usage.id,
              payment_proof_link: values[`${key}_payment_proof_link`],
            };
            await axios.post("http://localhost:5000/api/utilities/confirm", payload);
          }
        }
      }
      message.success("Payment proofs submitted successfully. Await admin review.");
      fetchData();
      setIsProofModalVisible(false);
    } catch (err) {
      message.error("Failed to submit payment proofs");
      console.error(err);
    }
  };

  // ---------------------------
  // Modal: View Bill & Approve Payment Proof (Admin Side).
  // Display details for each utility type.
  // ---------------------------
  const showBillModal = (payment) => {
    setSelectedPayment(payment);
    setIsBillModalVisible(true);
  };

  const handleApproveProof = async () => {
    try {
      // Approve each utility record that is in "Submitted" state.
      let approvedOne = false;
      if (selectedPayment && selectedPayment.utility_usage) {
        for (const usage of Object.values(selectedPayment.utility_usage)) {
          if (usage.utility_status === "Submitted") {
            const payload = { usage_id: usage.id };
            await axios.post("http://localhost:5000/api/utilities/approve", payload);
            approvedOne = true;
          }
        }
      }
      if (approvedOne) {
        message.success("Selected payment proofs approved! Status updated to Approved.");
      } else {
        message.info("No submitted proof available for approval.");
      }
      fetchData();
      setIsBillModalVisible(false);
    } catch (e) {
      message.error("Failed to approve payment proof(s)");
      console.error(e);
    }
  };

  // ---------------------------
  // Renderers for combined utility data.
  // ---------------------------
  const renderUtilitySection = (record) => {
    // If no usage records exist, allow bill generation.
    if (
      !record.utility_usage ||
      Object.keys(record.utility_usage).length === 0
    ) {
      return (
        <Button
          icon={<CheckCircleOutlined />}
          onClick={() => showUtilityModal(record)}
        >
          Generate Bill
        </Button>
      );
    }
    // Otherwise, show a button to view the bill.
    return (
      <Button type="link" onClick={() => showBillModal(record)}>
        View Bill
      </Button>
    );
  };

  const renderPenaltyCombined = (record) => {
    if (record.utility_usage && Object.keys(record.utility_usage).length > 0) {
      return Object.entries(record.utility_usage)
        .map(([ut, usage]) => {
          const label =
            ut === "electricity" ? "EEU" : ut === "water" ? "Water" : "Generator";
          return `${label}: birr${Number(usage.penalty || 0).toFixed(2)}`;
        })
        .join(" | ");
    }
    return "-";
  };

  const renderDueInfoCombined = (record) => {
    if (record.utility_usage && Object.keys(record.utility_usage).length > 0) {
      return Object.entries(record.utility_usage)
        .map(([ut, usage]) => {
          const label =
            ut === "electricity" ? "EEU" : ut === "water" ? "Water" : "Generator";
          const usageDate = dayjs(usage.created_at);
          const dueDate = usageDate.add(30, "day");
          const diffDays = dueDate.diff(dayjs(), "day");
          if (diffDays >= 0) return `${label}: ${diffDays} day(s) left`;
          else
            return `${label}: Overdue. Total Due: birr${Number(usage.cost).toFixed(
              2
            )} (Penalty: birr${Number(usage.penalty).toFixed(2)})`;
        })
        .join(" | ");
    }
    return "-";
  };

  const renderUtilityStatusCombined = (record) => {
    if (record.utility_usage && Object.keys(record.utility_usage).length > 0) {
      return Object.entries(record.utility_usage)
        .map(([ut, usage]) => {
          const label =
            ut === "electricity" ? "EEU" : ut === "water" ? "Water" : "Generator";
          return `${label}: ${usage.utility_status}`;
        })
        .join(" | ");
    }
    return record.status || "-";
  };

  const renderActionsCombined = (record) => {
    const actions = [];
    if (record.status === "Unpaid") {
      actions.push(
        <Button type="link" onClick={() => handleMarkAsPaid(record.id)} key="pay">
          Pay
        </Button>
      );
    }
    if (
      record.utility_usage &&
      Object.values(record.utility_usage).some(
        (usage) => usage.utility_status === "Bill Generated"
      )
    ) {
      actions.push(
        <Button type="link" onClick={() => showProofModal(record)} key="upload">
          Upload Payment Proof
        </Button>
      );
    }
    if (
      record.utility_usage &&
      Object.values(record.utility_usage).some(
        (usage) => usage.utility_status === "Submitted"
      )
    ) {
      actions.push(
        <Button type="link" onClick={() => showBillModal(record)} key="view-approve">
          View & Approve Proof
        </Button>
      );
    }
    return <Space size="middle">{actions}</Space>;
  };

  // ---------------------------
  // Table Columns Definition.
  // ---------------------------
  const columns = [
    { title: "Tenant Name", dataIndex: "full_name", key: "full_name" },
    { title: "Room", dataIndex: "room", key: "room" },
    { title: "Payment Term", dataIndex: "payment_term", key: "payment_term" },
    {
      title: "Payment Duty",
      dataIndex: "paymentDuty",
      key: "paymentDuty",
      render: (duty) => dayjs(duty).format("YYYY-MM-DD"),
    },
    { title: "Utility Section", key: "utilitySection", render: (_, record) => renderUtilitySection(record) },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Utility Status", key: "utility_status", render: (_, record) => renderUtilityStatusCombined(record) },
    {
      title: "Payment Proof",
      key: "payment_proof_link",
      render: (_, record) =>
        record.payment_proof_link ||
        (record.utility_usage &&
         Object.values(record.utility_usage).some(u => u.payment_proof_link)) ? (
          <Button type="link" onClick={() => showBillModal(record)}>
            View Proof
          </Button>
        ) : (
          "-"
        ),
    },
    { title: "Penalty", key: "penalty", render: (_, record) => renderPenaltyCombined(record) },
    { title: "Due Info", key: "dueInfo", render: (_, record) => renderDueInfoCombined(record) },
    { title: "Actions", key: "actions", render: (_, record) => renderActionsCombined(record) },
  ];

  // ---------------------------
  // Render the Component.
  // ---------------------------
  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by Tenant Name"
          onChange={(e) => handleSearch({ tenantName: e.target.value })}
        />
        <DatePicker
          placeholder="Search by Payment Date"
          onChange={(date) => handleSearch({ paymentDate: date })}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={filteredPayments.length > 0 ? filteredPayments : payments}
        rowKey="id"
      />

      {/* Utility Usage Modal for Bill Generation */}
      <Modal
        title="Enter Utility Meter Readings"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleUtilitySubmit}
      >
        <Form form={form} layout="vertical">
          {utilityTypes.map(({ key, label, paymentField }) => {
            if (selectedPayment && selectedPayment[paymentField]) {
              return (
                <React.Fragment key={key}>
                  <Form.Item
                    label={`${label} Previous Reading`}
                    name={`${key}_previous`}
                    rules={[
                      { required: true, message: `Enter previous ${label} reading` },
                    ]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item
                    label={`${label} Current Reading`}
                    name={`${key}_current`}
                    rules={[
                      { required: true, message: `Enter current ${label} reading` },
                    ]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </React.Fragment>
              );
            }
            return null;
          })}
        </Form>
      </Modal>

      {/* Payment Proof Upload Modal (Tenant Side) */}
      <Modal
        title="Upload Payment Proof"
        visible={isProofModalVisible}
        onCancel={() => setIsProofModalVisible(false)}
        onOk={handleProofSubmit}
      >
        <Form form={proofForm} layout="vertical">
          {utilityTypes.map(({ key, label, paymentField }) => {
            if (
              selectedPayment &&
              selectedPayment[paymentField] &&
              selectedPayment.utility_usage &&
              selectedPayment.utility_usage[key] &&
              selectedPayment.utility_usage[key].utility_status === "Bill Generated"
            ) {
              return (
                <Form.Item
                  key={key}
                  label={`${label} Payment Proof`}
                  name={`${key}_payment_proof_link`}
                  rules={[
                    { required: true, message: `Enter the ${label} Payment Proof URL` },
                  ]}
                >
                  <Input placeholder={`Enter URL for ${label} Payment Proof`} />
                </Form.Item>
              );
            }
            return null;
          })}
        </Form>
      </Modal>

      {/* View Bill / Approve Payment Proof Modal (Admin Side) */}
      <Modal
        title="View Bill"
        visible={isBillModalVisible}
        onCancel={() => setIsBillModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsBillModalVisible(false)}>
            Close
          </Button>,
          selectedPayment &&
            selectedPayment.utility_usage &&
            Object.values(selectedPayment.utility_usage).some(
              (usage) => usage.utility_status === "Submitted"
            ) && (
              <Button key="approve" type="primary" onClick={handleApproveProof}>
                Approve Payment Proof
              </Button>
            ),
        ]}
      >
        {selectedPayment && (
          <div>
            {utilityTypes.map(({ key, label }) => {
              const usage =
                selectedPayment.utility_usage && selectedPayment.utility_usage[key]
                  ? selectedPayment.utility_usage[key]
                  : null;
              return usage ? (
                <div
                  key={key}
                  style={{
                    marginBottom: "1em",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "0.5em",
                  }}
                >
                  <p>
                    <strong>{label} Details:</strong>
                  </p>
                  <p>
                    <strong>Cost:</strong> birr{usage.cost || "N/A"}&nbsp;&nbsp;
                    <strong>Penalty:</strong> birr{Number(usage.penalty || 0).toFixed(2)}
                  </p>
                  <p>
                    <strong>Status:</strong> {usage.utility_status}
                  </p>
                  {usage.payment_proof_link ? (
                    <div>
                      <p>
                        <strong>{label} Payment Proof:</strong>
                      </p>
                      <img
                        src={usage.payment_proof_link}
                        alt={`${label} Payment Proof`}
                        style={{ width: "100%" }}
                      />
                    </div>
                  ) : (
                    <p>No Payment Proof Submitted for {label}.</p>
                  )}
                </div>
              ) : null;
            })}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Payments;
