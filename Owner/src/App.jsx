import React, {useEffect, useState} from 'react';
import { Link, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {Layout,theme,Breadcrumb,Button, Menu, Tooltip, Dropdown, Badge, Tabs,} from 'antd';

import {FaAngleLeft, FaAngleRight, FaUserShield} from 'react-icons/fa6';
import { MdMessage } from 'react-icons/md';

import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Users from './pages/users/Users';
import PageNotFound from './pages/PageNotFound';
import { IoNotificationsCircle, IoSettingsOutline} from 'react-icons/io5';

import NewUserForm from './components/forms/users/NewUserForm';
import ModalForm from './modal/Modal';
// import NewMessageForm from './components/forms/users/NewMessageForm';
import ChangePasswordForm from './components/forms/users/ChangePasswordForm';
import { BACKENDURL } from './helper/Urls';
import axios from 'axios';
import { MdAdminPanelSettings } from "react-icons/md";
import { FaRegNewspaper } from "react-icons/fa6";
import { RxDashboard } from "react-icons/rx";
import Tenants from './pages/Tenants/Tenants';
import StallManagement from './pages/Stall Management/StallManagement';
import LeaseAgreements from './pages/Lease Agreements/LeaseAgreements ';
import Payments from './pages/Payments/Payments';
import MaintenanceRequests from './pages/Maintenance Requests/MaintenanceRequests';
import RemindersAndNotifications from './pages/Reminder And Notification/RemindersAndNotifications';
import logo from "./assets/imgs/logo.png"
import Termination from './pages/termination/Termination';
import { FaPeopleRoof } from "react-icons/fa6";
import { RiHomeOfficeLine } from "react-icons/ri";
import { TbZoomMoney } from "react-icons/tb";
import { GrHostMaintenance } from "react-icons/gr";
import { IoNotifications } from "react-icons/io5";
import { LuUtilityPole } from "react-icons/lu";
import Utility from './pages/Utility/Utility';
import TenantInfo from './components/TenantsInfo/TenantInfo';


const {Header, Content, Sider} = Layout;

const App = () => {
  
  const {token: {colorBgContainer, borderRadiusLG}} = theme.useToken ();
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    {
      key: '1',
      label: <Link to={'/dashboard'}>Dashboard</Link>,
      icon: <RxDashboard size={20} />,
    },
    {
      key: '2',
      label: 'Owner Dashboard',
      icon: <MdAdminPanelSettings size={20} />,
      children: [
        {
          key: '1',
          label: <Link to={'/tenants'}><FaPeopleRoof/> Tenants</Link>,
        },
        {
          key: '3',
          label: <Link to={'/stall-management'}><RiHomeOfficeLine/> Stall Management</Link>,
        },
        {
          key: '4',
          label: <Link to={'/lease-agreements'}><FaRegNewspaper/> Lease Agreements</Link>,
        },
        {
          key: '5',
          label: <Link to={'/payments'}><TbZoomMoney/> Payments</Link>,
        },
        {
          key: '6',
          label: <Link to={'/maintenance-requests'}><GrHostMaintenance/> Maintenance Requests</Link>,
        },
        {
          key: '7',
          label: <Link to={'/reminders-notifications'}><IoNotifications/> Reminders And Notifications</Link>,
        },
      ],
    },
   
    ///update
    {
      key: '/users',
      label:<Link to={'/users/list'}>Users</Link>,
      icon: <FaUserShield size={20} />,
    },
    
  ];

  
  const getLevelKeys = items1 => {
    const key = {};
    const func = (items2, level = 1) => {
      items2.forEach (item => {
        if (item.key) {
          key[item.key] = level;
        }
        if (item.children) {
          func (item.children, level + 1);
        }
      });
    };
    func (items1);
    return key;
  };
  const levelKeys = getLevelKeys (items);

  const [stateOpenKeys, setStateOpenKeys] = useState ([]);
  const onOpenChange = openKeys => {
    const currentOpenKey = openKeys.find (
      key => stateOpenKeys.indexOf (key) === -1
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter (key => key !== currentOpenKey)
        .findIndex (key => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys (
        openKeys
          // remove repeat key
          .filter ((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter (key => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys (openKeys);
    }
  };

  const pathName=useLocation().pathname
  const paths =pathName.split ('/').filter (path => path);

  const [openValue, setOpenValue] = useState (false);
  const [openTitle, setTitle] = useState (false);
  const [openContent, setOpenContent] = useState ();

  const tabs = [
    {
      key: '1',
      label: 'Alert',
      children: <span>Alert</span>,
    },
    {
      key: '2',
      label: 'Inbox',
      children: <span>Inbox</span>,
    },
    {
      key: '3',
      label: 'Sent',
      children: <span>Sent</span>,
    },
    {
      key: '4',
      label: 'Draft',
      children: <span>Draft</span>,
    },
  ]

  const items1 = [
    {
      key: '1',
      label: (
        <span style={{width:'100%',display:'flex',alignItems:'center'}}
          onClick={() => {
            setOpenValue (true);
            setOpenContent (<NewUserForm />);
            setTitle ('Profile');
          }}
        >
          Profile
        </span>
      ),
    },
    {
      key: '2',
      label: (
        <span
          onClick={() => {
            setOpenValue (true);
            setOpenContent (<ChangePasswordForm />);
            setTitle ('Change Password');
          }}
        >
          Change Password
        </span>
      ),
    },
    {
      key: '3',
      label: (
        <span style={{width:'100%',display:'flex',alignItems:'center'}}
          onClick={()=>{localStorage.setItem('ERPUSER_Token','');navigate('/')}}
        >
          Logout
        </span>
      ),
    },
  ];

  const items2 = [
    {
      key: '4',
      label: (
        <Tabs defaultActiveKey="1" items={paths.includes('administrators')?tabs:tabs} style={{width: '350px',height:'450px'}} onChange={()=>(c=>!c)}/>
      ),
    },
  ];
  const [visible, setVisible] = useState(false);


  const navigate = useNavigate ();
  const [authLoading, setAuthLoading] = useState (true);

  const IsUserAuth =async()=>{
    setAuthLoading(true)
    const headers = {
      "Authorization": `Bearer ${localStorage.getItem('ERPUSER_Token')}`,
    };
  try {
    const res=await axios.get(`${BACKENDURL}/auth/user`,{headers})
    setAuthLoading(false)
    console.log(res)
  } catch (error) {
    setAuthLoading(false)
    // navigate('/')
  }
  }

  // useEffect(() => {
  //   IsUserAuth()
  // }, [pathName])
  

  return (
  <div>
    {/* {authLoading?<Spin style={{display:'flex',alignItems:'center',justifyContent:'center',width:"100vw",height:'100vh'}}></Spin>: */}
    <Layout style={{height: '100vh'}} >
      <ModalForm
        open={openValue}
        close={() => setOpenValue (false)}
        content={openContent}
        title={openTitle}
      />
      <Sider
      trigger={null} collapsible collapsed={collapsed}
      theme='light'
      style={{overflow:'scroll'}}
      >
        <div
          style={{
            width: '100%',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <img src={logo} alt='logo' style={{width:"auto",height:'100%',objectFit:'contain'}}/>
        </div>
        <Menu
            openKeys={stateOpenKeys}
            onOpenChange={onOpenChange}
            theme='light'
            style={{overflow: 'hidden', width: '100%'}}
            mode="inline"
            items={items}
          />
          <div style={{height:'80px'}}></div>
          <div style={{ marginTop: "auto" }}>
        <Menu>
          <Menu.Item key="/utility" icon={<LuUtilityPole size={20} />}>
            <Link to="/utility/list">Utility</Link>
          </Menu.Item>
        </Menu>
      </div>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <Button
            type="text"
            icon={collapsed ? <FaAngleRight /> : <FaAngleLeft />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 30,
              height: 64,
            }}
          />
          </div>
            <Breadcrumb separator={<FaAngleRight />}>
              {paths.map ((path, index) => {
                const url = '/' + paths.slice (0, index + 1).join ('/');
                return (
                  <Breadcrumb.Item key={path}>
                    {path.toLocaleUpperCase()}
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          {/* <Tooltip title='Write Message'>
          <MdMessage onClick={() => {
            setOpenValue (true);
            setOpenContent (<NewMessageForm openModalFun={(e)=>setOpenValue(e)}/>);
            setTitle ('Message');
          }} size={25} cursor={'pointer'} />
          </Tooltip> */}
          <Dropdown
          visible={visible}
          onVisibleChange={v=>setVisible(v)}
              menu={{
                items: items2,onClick:()=>setVisible(true)
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Badge size="small" count={0}>
                <IoNotificationsCircle size={26} cursor={'pointer'} />
                {/* <IoNotificationsCircle size={26} onClick={()=>play()} cursor={'pointer'} /> */}
              </Badge>
            </Dropdown>
            <Dropdown
              menu={{
                items: items1,
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <IoSettingsOutline size={22} cursor={'pointer'} />
            </Dropdown>
          </div>

        </Header>
        <Content
          style={{
            overflow: 'scroll',
            margin: '16px 8px 0',
          }}
        >
          <div
            style={{
              padding: 8,
              minHeight: '100%',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
            <Route element={<Auth />} path="/" />
            <Route element={<Dashboard />} path="/dashboard" />
            <Route element={<Users />} path="/users/list"/>
            <Route element={<Tenants />} path="/tenants" />
            <Route element={<StallManagement/>} path="/stall-management" />
            <Route element={<LeaseAgreements/>} path="/lease-agreements" />
            <Route element={<Payments/>} path="/payments" />
            <Route element={<MaintenanceRequests/>} path="/maintenance-requests"/>
            <Route element={<RemindersAndNotifications/>} path="/reminders-notifications"/>
            <Route element={<Termination/>} path="/termination" />
            <Route path="/tenants/:id" element={<TenantInfo />} />
            <Route element={<Utility/>} path="/utility/list" />
            <Route element={<PageNotFound />} path="*" />

          </Routes>
          </div>
        </Content>
        
      </Layout>
    </Layout>
    {/* } */}
    </div>
  );
};
export default App;
