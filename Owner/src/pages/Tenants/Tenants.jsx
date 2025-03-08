// import React, { useState, useEffect } from "react";
// import { Table, Button, Modal, Form, Input, Checkbox, DatePicker, message, Select, Tabs, Space } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import dayjs from "dayjs";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// const { RangePicker } = DatePicker;
// const { TabPane } = Tabs;

// const paymentTerms = [
//   { value: "1 month", label: "1 month" },
//   { value: "2 months", label: "2 months" },
//   { value: "3 months", label: "3 months" },
//   { value: "6 months", label: "6 months" },
//   { value: "12 months", label: "12 months" },
//   { value: "1 year", label: "1 year" },
//   { value: "2 years", label: "2 years" },
//   { value: "3 years", label: "3 years" },
//   { value: "5 years", label: "5 years" }
// ];

// const Tenants = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isAgentRegistered, setIsAgentRegistered] = useState(false);
//   const [form] = Form.useForm();
//   const [activeTab, setActiveTab] = useState("1");
//   const [tenants, setTenants] = useState([]);
//   const [terminatedTenants, setTerminatedTenants] = useState([]);
//   const [rooms, setRooms] = useState([]);
//   const [activeRooms, setActiveRooms] = useState([]); // list of rooms currently occupied

//   // Fetch tenants, terminated tenants and all room (stall) information on component mount.
//   useEffect(() => {
//     fetchTenants();
//     fetchTerminatedTenants();
//     fetchRooms();
//   }, []);

//   // Fetch active tenants from back end
//   const fetchTenants = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/tenants");
//       setTenants(response.data);
//       // Build an array of occupied room values from active tenants.
//       const occupiedRooms = response.data.map((tenant) => tenant.room);
//       setActiveRooms(occupiedRooms);
//     } catch (err) {
//       message.error("Failed to fetch tenants");
//       console.error(err);
//     }
//   };

//   const navigate = useNavigate()
//   // Fetch terminated tenants from back end
//   const fetchTerminatedTenants = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/tenants/terminated");
//       setTerminatedTenants(response.data);
//     } catch (err) {
//       message.error("Failed to fetch terminated tenants");
//       console.error(err);
//     }
//   };

//   // Fetch stall (room) information from back end
//   const fetchRooms = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/stalls");
//       setRooms(response.data);
//     } catch (err) {
//       message.error("Failed to fetch rooms");
//       console.error(err);
//     }
//   };

//   // Compute available rooms: filter out rooms that are occupied by an active tenant.
//   // We assume that in the room data, the property we want to use for display is called "room".
//   // If your back-end returns stall objects with a property "stallCode" but you want to map that to room,
//   // you can adjust the mapping here accordingly.
//   const availableRooms = rooms.filter((item) => !activeRooms.includes(item.room));

//   const showModal = () => {
//     setIsModalVisible(true);
//     setActiveTab("1");
//     form.resetFields();
//     setIsAgentRegistered(false);
//   };
//   const [isModalVisiblee, setIsModalVisiblee] = useState(false);
//   const handleCancel = () => {
//     setIsModalVisible(false);
//     form.resetFields();
//     setIsAgentRegistered(false);
//   };
//   const showModall = () => {
//     setIsModalVisiblee(true);
//   };

//   // Function to handle closing the modal
//   const handleCancell = () => {
//     setIsModalVisiblee(false);
//     form.resetFields();  // Reset form fields when closing
//   };

//   // Function to handle form submission
//   const handleOkk = (values) => {
//     console.log('Form Values:', values);  // You can replace this with an API call
//     setIsModalVisiblee(false);
//   };
//   // This function maps the front-end snake_case values to camelCase values expected at back end.
//   // It also formats leasePeriod moment objects into strings.
//   const handleOk = async () => {
//     try {
//       const values = await form.validateFields();
//       const leasePeriod = values.leasePeriod;
//       const formattedLeasePeriod = [
//         leasePeriod[0].format("YYYY-MM-DD"),
//         leasePeriod[1].format("YYYY-MM-DD")
//       ];

//       // Create payload with mapping (snake_case to camelCase) and assign room value directly
//       const payload = {
//         tenantID: values.tenant_id,
//         fullName: values.full_name,
//         sex: values.sex,
//         phone: values.phone,
//         city: values.city,
//         subcity: values.subcity,
//         woreda: values.woreda,
//         house_no: values.house_no,
//         room: values.room, // selected room from drop-down
//         price: values.price,
//         paymentTerm: values.payment_term,
//         deposit: values.deposit,
//         leasePeriod: formattedLeasePeriod,
//         eeuPayment: values.eeu_payment ?? false,
//         generatorPayment: values.generator_payment ?? false,
//         waterPayment: values.water_payment ?? false,
//         registeredByAgent: values.registered_by_agent || false,
//         authenticationNo: values.authentication_no,
//         agentFirstName: values.agent_first_name,
//         agentSex: values.agent_sex,
//         agentPhone: values.agent_phone,
//         agentCity: values.agent_city,
//         agentSubcity: values.agent_subcity,
//         agentWoreda: values.agent_woreda,
//         agentHouseNo: values.agent_house_no,
//         building_id: values.building_id || 3 // Default to building 1 for testing
//       };

//       await axios.post("http://localhost:5000/api/tenants", payload);
//       message.success("Tenant added successfully!");
//       fetchTenants();
//       fetchTerminatedTenants();
//       setIsModalVisible(false);
//       form.resetFields();
//       setIsAgentRegistered(false);
//     } catch (error) {
//       message.error("Failed to add tenant");
//       console.error(error);
//     }
//   };

//   const handleTerminate = async (record) => {
//     try {
//       await axios.put(`http://localhost:5000/api/tenants/terminate/${record.id}`);
//       message.warning(`${record.full_name} has been terminated.`);
//       fetchTenants();
//       fetchTerminatedTenants();
//     } catch (error) {
//       message.error("Failed to terminate tenant");
//       console.error(error);
//     }
//   };

//   const columns = [
//     { title: "Tenant ID", dataIndex: "tenant_id", key: "tenant_id" },
//     { title: "Full Name", dataIndex: "full_name", key: "full_name" },
//     { title: "Sex", dataIndex: "sex", key: "sex" },
//     { title: "Phone", dataIndex: "phone", key: "phone" },
//     {
//       title: "Monthly Rent",
//       key: "monthlyRent",
//       render: (_, record) => {
//         console.log("Rooms Data:", rooms);
//         console.log("Current Record Room:", record.room);
    
//         const stall = rooms.find(
//           (s) => s.room === record.rooms || s.stallCode === record.room
//         );
    
//         console.log("Found Stall:", stall);
    
//         return stall ? stall.monthlyRent : "-";
//       },
//     },    
//     {
//       title: "Lease Period",
//       key: "leasePeriod",
//       render: (_, record) =>
//         `${dayjs(record.lease_start).format("YYYY-MM-DD")} to ${dayjs(record.lease_end).format("YYYY-MM-DD")}`
//     },
//     {
//       title: "Registered by Agent",
//       dataIndex: "registered_by_agent",
//       key: "registered_by_agent",
//       render: (flag) => (flag ? "Yes" : "No")
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <Space size="middle">
//           <Button
//             type="link"
//             icon={<EditOutlined />}
//             onClick={(e) => {
//               e.stopPropagation(); // Prevents the row click event from firing.
//               form.setFieldsValue({
//                 ...record,
//                 leasePeriod: [dayjs(record.lease_start), dayjs(record.lease_end)]
//               });
//               setIsModalVisible(true);
//             }}
//           />
//           <Button
//             type="link"
//             icon={<DeleteOutlined />}
//             danger
//             onClick={(e)=>{
//               e.stopPropagation()
//               showModall
//             }}
//             // onClick={(e) => {
//             //   e.stopPropagation(); // Also stop event propagation here
//             //   handleTerminate(record);
//             // }}
//           />
//         </Space>
//       )
//     }
    
//   ];

//   const terminatedColumns = columns.filter((col) => col.key !== "actions");

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Tenants</h2>
//       <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
//         Add Tenant
//       </Button>

//       <Table columns={columns} dataSource={tenants} style={{ marginTop: 20 }} rowKey="id" onRow={(record) => ({
//           onClick: () => {
//             navigate(`/tenants/${record.id}`);
//           }
//         })} />

//       {terminatedTenants.length > 0 && (
//         <>
//           <h2 style={{ marginTop: 40 }}>Terminated Tenants</h2>
//           <Table columns={terminatedColumns} dataSource={terminatedTenants} style={{ marginTop: 20 }} rowKey="id" onRow={(record) => ({
//           onClick: () => {
//             navigate(`/tenants/${record.id}`);
//           }
//         })} />
//         </>
//       )}

// <Modal
//         title="Tenant Termination"
//         visible={isModalVisiblee}
//         onCancel={handleCancell}
//         footer={null}  // You can customize footer here if needed
//         destroyOnClose
//       >
//         <Form
//           form={form}
//           onFinish={handleOkk}
//           layout="vertical"
//           initialValues={{
//             depositReturned: false,  // Default value
//             clearanceCheck: true,    // Default value
//           }}
//         >
//           <Form.Item
//             label="Termination Reason"
//             name="terminationReason"
//             rules={[{ required: true, message: 'Please enter the termination reason' }]}
//           >
//             <Input.TextArea rows={4} />
//           </Form.Item>

//           <Form.Item
//             label="Termination Date"
//             name="terminationDate"
//             rules={[{ required: true, message: 'Please select the termination date' }]}
//           >
//             <DatePicker style={{ width: '100%' }} />
//           </Form.Item>

//           <Form.Item
//             label="Deposit Returned"
//             name="depositReturned"
//             valuePropName="checked"
//           >
//             <Checkbox>Yes, deposit has been returned</Checkbox>
//           </Form.Item>

//           <Form.Item
//             label="Clearance Check"
//             name="clearanceCheck"
//             valuePropName="checked"
//             rules={[{ required: true, message: 'Please confirm the clearance check status' }]}
//           >
//             <Checkbox>Clearance Check Completed</Checkbox>
//           </Form.Item>

//           <Form.Item
//             label="Termination Document URL"
//             name="terminationDocumentUrl"
//             rules={[{ required: true, message: 'Please provide the URL of the termination document' }]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
//               Submit
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       <Modal
//         title="Add New Tenant"
//         visible={isModalVisible}
//         onCancel={handleCancel}
//         footer={activeTab === "2" ? [
//           <Button key="back" onClick={() => setActiveTab("1")}>
//             Back: Tenant Info
//           </Button>,
//           <Button key="submit" type="primary" onClick={handleOk}>
//             Submit
//           </Button>
//         ] : null}
//       >
//         <Form form={form} layout="vertical" initialValues={{
//     eeu_payment: false,
//     generator_payment: false,
//     water_payment: false,
//   }}>
//           <Tabs activeKey={activeTab} onChange={setActiveTab}>
//             <TabPane tab="Tenant Info" key="1">
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
//                 <Form.Item name="tenant_id" label="Tenant ID" rules={[{ required: true, message: "Please enter Tenant ID" }]}>
//                   <Input />
//                 </Form.Item>
//                 <Form.Item name="full_name" label="Full Name" rules={[{ required: true, message: "Please enter Full Name" }]}>
//                   <Input />
//                 </Form.Item>
//                 <Form.Item name="sex" label="Sex" rules={[{ required: true, message: "Please enter Sex" }]}>
//                   <Input />
//                 </Form.Item>
//                 <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: "Please enter Phone Number" }]}>
//                   <Input />
//                 </Form.Item>
//                 <Form.Item name="city" label="City" rules={[{ required: true, message: "Please enter Tenant City" }]}>
//                   <Input />
//                 </Form.Item>
//                 <Form.Item name="subcity" label="Sub City" rules={[{ required: true, message: "Please enter Sub City" }]}>
//                   <Input />
//                 </Form.Item>
//                 <Form.Item name="woreda" label="Woreda" rules={[{ required: true, message: "Please enter Woreda" }]}>
//                   <Input />
//                 </Form.Item>
//                 <Form.Item name="house_no" label="House No" rules={[{ required: true, message: "Please enter Tenant House No" }]}>
//                   <Input />
//                 </Form.Item>
//               </div>

//               <Form.Item>
//                 <Checkbox
//                   checked={isAgentRegistered}
//                   onChange={(e) => {
//                     form.setFieldsValue({ registered_by_agent: e.target.checked });
//                     setIsAgentRegistered(e.target.checked);
//                   }}
//                 >
//                   Registered by Agent?
//                 </Checkbox>
//               </Form.Item>

//               {isAgentRegistered && (
//                 <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
//                   <Form.Item name="authentication_no" label="Agent No" rules={[{ required: true, message: "Please enter Agent No" }]}>
//                     <Input />
//                   </Form.Item>
//                   <Form.Item name="agent_first_name" label="Agent Full Name" rules={[{ required: true, message: "Please enter Agent Full Name" }]}>
//                     <Input />
//                   </Form.Item>
//                   <Form.Item name="agent_sex" label="Agent Sex" rules={[{ required: true, message: "Please enter Agent Sex" }]}>
//                     <Input />
//                   </Form.Item>
//                   <Form.Item name="agent_phone" label="Agent Phone" rules={[{ required: true, message: "Please enter Agent Phone" }]}>
//                     <Input />
//                   </Form.Item>
//                   <Form.Item name="agent_city" label="Agent City" rules={[{ required: true, message: "Please enter Agent City" }]}>
//                     <Input />
//                   </Form.Item>
//                   <Form.Item name="agent_subcity" label="Agent Sub City" rules={[{ required: true, message: "Please enter Agent Sub City" }]}>
//                     <Input />
//                   </Form.Item>
//                   <Form.Item name="agent_woreda" label="Agent Woreda" rules={[{ required: true, message: "Please enter Agent Woreda" }]}>
//                     <Input />
//                   </Form.Item>
//                   <Form.Item name="agent_house_no" label="Agent House No" rules={[{ required: true, message: "Please enter Agent House No" }]}>
//                     <Input />
//                   </Form.Item>
//                 </div>
//               )}

//               <Button type="primary" onClick={() => setActiveTab("2")}>
//                 Next: Payment Info
//               </Button>
//             </TabPane>
//             <TabPane tab="Payment Info" key="2">
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
//                 <Form.Item name="room" label="Room" rules={[{ required: true, message: "Please select a room" }]}>
//                   <Select placeholder="Select a room">
//                     {availableRooms.map((r) => (
//                       <Select.Option key={r.id} value={r.room}>
//                         {r.rooms}
//                       </Select.Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//                 <Form.Item name="payment_term" label="Payment Term" rules={[{ required: true, message: "Please select the payment term" }]}>
//                   <Select placeholder="Select payment term">
//                     {paymentTerms.map((term) => (
//                       <Select.Option key={term.value} value={term.value}>
//                         {term.label}
//                       </Select.Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//                 <Form.Item name="deposit" label="Deposit (optional)">
//                   <Input />
//                 </Form.Item>
//               </div>
//               <Form.Item name="leasePeriod" label="Lease Period" rules={[{ required: true, message: "Please select Lease Period" }]}>
//                 <RangePicker style={{ width: "100%" }} />
//               </Form.Item>
//               <div style={{ margin: "10px" }}>Utilities</div>
//               <Form.Item name="eeu_payment" valuePropName="checked">
//     <Checkbox>EEU</Checkbox>
//   </Form.Item>
//   <Form.Item name="generator_payment" valuePropName="checked">
//     <Checkbox>Generator</Checkbox>
//   </Form.Item>
  
//   <Form.Item name="water_payment" valuePropName="checked">
//     <Checkbox>Water</Checkbox>
//   </Form.Item>
//             </TabPane>
//           </Tabs>
//         </Form>
        
//       </Modal>
//     </div>
//   );
// };

// export default Tenants;

import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Checkbox, DatePicker, message, Select, Tabs, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const paymentTerms = [
  { value: "1 month", label: "1 month" },
  { value: "2 months", label: "2 months" },
  { value: "3 months", label: "3 months" },
  { value: "6 months", label: "6 months" },
  { value: "12 months", label: "12 months" },
  { value: "1 year", label: "1 year" },
  { value: "2 years", label: "2 years" },
  { value: "3 years", label: "3 years" },
  { value: "5 years", label: "5 years" }
];

const Tenants = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAgentRegistered, setIsAgentRegistered] = useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("1");
  const [tenants, setTenants] = useState([]);
  const [terminatedTenants, setTerminatedTenants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [activeRooms, setActiveRooms] = useState([]); // list of rooms currently occupied

  // Fetch tenants, terminated tenants and all room (stall) information on component mount.
  useEffect(() => {
    fetchTenants();
    fetchTerminatedTenants();
    fetchRooms();
  }, []);

  // Fetch active tenants from back end
  const fetchTenants = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tenants");
      setTenants(response.data);
      // Build an array of occupied room values from active tenants.
      const occupiedRooms = response.data.map((tenant) => tenant.room);
      setActiveRooms(occupiedRooms);
    } catch (err) {
      message.error("Failed to fetch tenants");
      console.error(err);
    }
  };

  const navigate = useNavigate()
  // Fetch terminated tenants from back end
  const fetchTerminatedTenants = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tenants/terminated");
      setTerminatedTenants(response.data);
    } catch (err) {
      message.error("Failed to fetch terminated tenants");
      console.error(err);
    }
  };

  // Fetch stall (room) information from back end
  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/stalls");
      setRooms(response.data);
    } catch (err) {
      message.error("Failed to fetch rooms");
      console.error(err);
    }
  };

  // Compute available rooms: filter out rooms that are occupied by an active tenant.
  // We assume that in the room data, the property we want to use for display is called "room".
  // If your back-end returns stall objects with a property "stallCode" but you want to map that to room,
  // you can adjust the mapping here accordingly.
  const availableRooms = rooms.filter((item) => !activeRooms.includes(item.room));

  const showModal = () => {
    setIsModalVisible(true);
    setActiveTab("1");
    form.resetFields();
    setIsAgentRegistered(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setIsAgentRegistered(false);
  };

  // This function maps the front-end snake_case values to camelCase values expected at back end.
  // It also formats leasePeriod moment objects into strings.
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const leasePeriod = values.leasePeriod;
      const formattedLeasePeriod = [
        leasePeriod[0].format("YYYY-MM-DD"),
        leasePeriod[1].format("YYYY-MM-DD")
      ];

      // Create payload with mapping (snake_case to camelCase) and assign room value directly
      const payload = {
        tenantID: values.tenant_id,
        fullName: values.full_name,
        sex: values.sex,
        phone: values.phone,
        city: values.city,
        subcity: values.subcity,
        woreda: values.woreda,
        house_no: values.house_no,
        room: values.room, // selected room from drop-down
        price: values.price,
        paymentTerm: values.payment_term,
        deposit: values.deposit,
        leasePeriod: formattedLeasePeriod,
        eeuPayment: values.eeu_payment ?? false,
        generatorPayment: values.generator_payment ?? false,
        waterPayment: values.water_payment ?? false,
        registeredByAgent: values.registered_by_agent || false,
        authenticationNo: values.authentication_no,
        agentFirstName: values.agent_first_name,
        agentSex: values.agent_sex,
        agentPhone: values.agent_phone,
        agentCity: values.agent_city,
        agentSubcity: values.agent_subcity,
        agentWoreda: values.agent_woreda,
        agentHouseNo: values.agent_house_no,
        building_id: values.building_id || 3 // Default to building 1 for testing
      };

      await axios.post("http://localhost:5000/api/tenants", payload);
      message.success("Tenant added successfully!");
      fetchTenants();
      fetchTerminatedTenants();
      setIsModalVisible(false);
      form.resetFields();
      setIsAgentRegistered(false);
    } catch (error) {
      message.error("Failed to add tenant");
      console.error(error);
    }
  };

  const handleTerminate = async (record) => {
    try {
      await axios.put(`http://localhost:5000/api/tenants/terminate/${record.id}`);
      message.warning(`${record.full_name} has been terminated.`);
      fetchTenants();
      fetchTerminatedTenants();
    } catch (error) {
      message.error("Failed to terminate tenant");
      console.error(error);
    }
  };

  const columns = [
    { title: "Tenant ID", dataIndex: "tenant_id", key: "tenant_id" },
    { title: "Full Name", dataIndex: "full_name", key: "full_name" },
    { title: "Sex", dataIndex: "sex", key: "sex" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Monthly Rent",
      key: "monthlyRent",
      render: (_, record) => {
        console.log("Rooms Data:", rooms);
        console.log("Current Record Room:", record.room);
    
        const stall = rooms.find(
          (s) => s.room === record.rooms || s.stallCode === record.room
        );
    
        console.log("Found Stall:", stall);
    
        return stall ? stall.monthlyRent : "-";
      },
    },    
    {
      title: "Lease Period",
      key: "leasePeriod",
      render: (_, record) =>
        `${dayjs(record.lease_start).format("YYYY-MM-DD")} to ${dayjs(record.lease_end).format("YYYY-MM-DD")}`
    },
    {
      title: "Registered by Agent",
      dataIndex: "registered_by_agent",
      key: "registered_by_agent",
      render: (flag) => (flag ? "Yes" : "No")
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation(); // Prevents the row click event from firing.
              form.setFieldsValue({
                ...record,
                leasePeriod: [dayjs(record.lease_start), dayjs(record.lease_end)]
              });
              setIsModalVisible(true);
            }}
          />
          <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
            onClick={(e) => {
              e.stopPropagation(); // Also stop event propagation here
              handleTerminate(record);
            }}
          />
        </Space>
      )
    }
    
  ];

  const terminatedColumns = columns.filter((col) => col.key !== "actions");

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tenants</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Add Tenant
      </Button>

      <Table columns={columns} dataSource={tenants} style={{ marginTop: 20 }} rowKey="id" onRow={(record) => ({
          onClick: () => {
            navigate(`/tenants/${record.id}`);
          }
        })} />

      {terminatedTenants.length > 0 && (
        <>
          <h2 style={{ marginTop: 40 }}>Terminated Tenants</h2>
          <Table columns={terminatedColumns} dataSource={terminatedTenants} style={{ marginTop: 20 }} rowKey="id" onRow={(record) => ({
          onClick: () => {
            navigate(`/tenants/${record.id}`);
          }
        })} />
        </>
      )}

      <Modal
        title="Add New Tenant"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={activeTab === "2" ? [
          <Button key="back" onClick={() => setActiveTab("1")}>
            Back: Tenant Info
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Submit
          </Button>
        ] : null}
      >
        <Form form={form} layout="vertical" initialValues={{
    eeu_payment: false,
    generator_payment: false,
    water_payment: false,
  }}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Tenant Info" key="1">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                <Form.Item name="tenant_id" label="Tenant ID" rules={[{ required: true, message: "Please enter Tenant ID" }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="full_name" label="Full Name" rules={[{ required: true, message: "Please enter Full Name" }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="sex" label="Sex" rules={[{ required: true, message: "Please enter Sex" }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: "Please enter Phone Number" }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="city" label="City" rules={[{ required: true, message: "Please enter Tenant City" }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="subcity" label="Sub City" rules={[{ required: true, message: "Please enter Sub City" }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="woreda" label="Woreda" rules={[{ required: true, message: "Please enter Woreda" }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="house_no" label="House No" rules={[{ required: true, message: "Please enter Tenant House No" }]}>
                  <Input />
                </Form.Item>
              </div>

              <Form.Item>
                <Checkbox
                  checked={isAgentRegistered}
                  onChange={(e) => {
                    form.setFieldsValue({ registered_by_agent: e.target.checked });
                    setIsAgentRegistered(e.target.checked);
                  }}
                >
                  Registered by Agent?
                </Checkbox>
              </Form.Item>

              {isAgentRegistered && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                  <Form.Item name="authentication_no" label="Agent No" rules={[{ required: true, message: "Please enter Agent No" }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="agent_first_name" label="Agent Full Name" rules={[{ required: true, message: "Please enter Agent Full Name" }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="agent_sex" label="Agent Sex" rules={[{ required: true, message: "Please enter Agent Sex" }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="agent_phone" label="Agent Phone" rules={[{ required: true, message: "Please enter Agent Phone" }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="agent_city" label="Agent City" rules={[{ required: true, message: "Please enter Agent City" }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="agent_subcity" label="Agent Sub City" rules={[{ required: true, message: "Please enter Agent Sub City" }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="agent_woreda" label="Agent Woreda" rules={[{ required: true, message: "Please enter Agent Woreda" }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="agent_house_no" label="Agent House No" rules={[{ required: true, message: "Please enter Agent House No" }]}>
                    <Input />
                  </Form.Item>
                </div>
              )}

              <Button type="primary" onClick={() => setActiveTab("2")}>
                Next: Payment Info
              </Button>
            </TabPane>
            <TabPane tab="Payment Info" key="2">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                <Form.Item name="room" label="Room" rules={[{ required: true, message: "Please select a room" }]}>
                  <Select placeholder="Select a room">
                    {availableRooms.map((r) => (
                      <Select.Option key={r.id} value={r.room}>
                        {r.rooms}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="payment_term" label="Payment Term" rules={[{ required: true, message: "Please select the payment term" }]}>
                  <Select placeholder="Select payment term">
                    {paymentTerms.map((term) => (
                      <Select.Option key={term.value} value={term.value}>
                        {term.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="deposit" label="Deposit (optional)">
                  <Input />
                </Form.Item>
              </div>
              <Form.Item name="leasePeriod" label="Lease Period" rules={[{ required: true, message: "Please select Lease Period" }]}>
                <RangePicker style={{ width: "100%" }} />
              </Form.Item>
              <div style={{ margin: "10px" }}>Utilities</div>
              <Form.Item name="eeu_payment" valuePropName="checked">
    <Checkbox>EEU</Checkbox>
  </Form.Item>
  <Form.Item name="generator_payment" valuePropName="checked">
    <Checkbox>Generator</Checkbox>
  </Form.Item>
  
  <Form.Item name="water_payment" valuePropName="checked">
    <Checkbox>Water</Checkbox>
  </Form.Item>
            </TabPane>
          </Tabs>
        </Form>
      </Modal>
    </div>
  );
};

export default Tenants;