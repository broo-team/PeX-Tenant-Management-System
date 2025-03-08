// TenantInfo.js
import React, { useState, useEffect } from 'react';
import { Descriptions, message, Spin } from 'antd';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function TenantInfo() {
  const { id } = useParams();
  const [tenant, setTenant] = useState(null);
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch tenant details first
  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tenants/${id}`);
        setTenant(response.data);

        // If the tenant has a building_id, fetch building details.
        if (response.data.building_id) {
          fetchBuilding(response.data.building_id);
        }
      } catch (error) {
        message.error("Failed to fetch tenant details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [id]);

  // Fetch building details based on building_id
  const fetchBuilding = async (buildingId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/buildings/${buildingId}`);
      setBuilding(response.data);
    } catch (error) {
      message.error("Failed to fetch building details");
      console.error(error);
    }
  };

  if (loading) return <Spin style={{ textAlign: 'center', margin: '20px' }} />;
  if (!tenant) return <div>No tenant information found.</div>;
console.log(tenant)
  return (
    <div style={{ padding: "20px" }}>
      <Descriptions title={`Tenant Information: ${tenant.full_name}`} bordered>
        <Descriptions.Item label="Tenant ID">{tenant.tenant_id}</Descriptions.Item>
        <Descriptions.Item label="Full Name">{tenant.full_name}</Descriptions.Item>
        <Descriptions.Item label="Sex">{tenant.sex}</Descriptions.Item>
        <Descriptions.Item label="Phone">{tenant.phone}</Descriptions.Item>
        <Descriptions.Item label="City">{tenant.city}</Descriptions.Item>
        <Descriptions.Item label="Sub City">{tenant.subcity}</Descriptions.Item>
        <Descriptions.Item label="Woreda">{tenant.woreda}</Descriptions.Item>
        <Descriptions.Item label="House No">{tenant.house_no}</Descriptions.Item>
        <Descriptions.Item label="Room">{tenant.room}</Descriptions.Item>
        <Descriptions.Item label="Price">{tenant.price ? tenant.price : "Not set"}</Descriptions.Item>
        <Descriptions.Item label="Payment Term">{tenant.payment_term}</Descriptions.Item>
        <Descriptions.Item label="Deposit">{tenant.deposit}</Descriptions.Item>
        <Descriptions.Item label="Lease Start">
          {tenant.lease_start ? dayjs(tenant.lease_start).format("YYYY-MM-DD") : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Lease End">
          {tenant.lease_end ? dayjs(tenant.lease_end).format("YYYY-MM-DD") : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Registered by Agent">
          {tenant.registered_by_agent ? "Yes" : "No"}
        </Descriptions.Item>
        <Descriptions.Item label="Authentication No">
          {tenant.authentication_no || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Agent First Name">
          {tenant.agent_first_name || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Agent Sex">
          {tenant.agent_sex || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Agent Phone">
          {tenant.agent_phone || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Agent City">
          {tenant.agent_city || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Agent Sub City">
          {tenant.agent_subcity || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Agent Woreda">
          {tenant.agent_woreda || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Agent House No">
          {tenant.agent_house_no || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="EEU Payment">
          {tenant.eeu_payment ? "Yes" : "No"}
        </Descriptions.Item>
        <Descriptions.Item label="Generator Payment">
          {tenant.generator_payment ? "Yes" : "No"}
        </Descriptions.Item>
        <Descriptions.Item label="Water Payment">
          {tenant.water_payment ? "Yes" : "No"}
        </Descriptions.Item>
        <Descriptions.Item label="Terminated">
          {tenant.terminated ? "Yes" : "No"}
        </Descriptions.Item>
        <Descriptions.Item label="Building">
          {building
            ? `${building.building_name} (ID: ${tenant.building_id})`
            : tenant.building_id}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {tenant.created_at ? dayjs(tenant.created_at).format("YYYY-MM-DD HH:mm:ss") : "N/A"}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}

export default TenantInfo;
