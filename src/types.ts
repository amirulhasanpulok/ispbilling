export interface Client {
  id: string;
  code: string; // e.g. "0006", "1040"
  username: string; // e.g. "haven", "sofiquejm"
  name: string;
  password?: string;
  mobile: string;
  phone?: string;
  email: string;
  nid?: string;
  zone: string;
  subzone: string;
  box?: string;
  connectionType: 'Optical Fiber' | 'Cat5' | 'Wireless';
  clientType: 'Home' | 'Corporate' | 'Shop User';
  address: string;
  permanentAddress?: string;
  packageSpeed: string; // e.g. "10Mbps/10mb_pkg_500tk"
  packageName: string; // "10Mbps"
  monthlyBill: number; // e.g. 500
  macAddress: string;
  server: string; // "BBN-CORE"
  billingStatus: 'Active' | 'Inactive' | 'Expired' | 'LeftOut';
  mikrotikStatus: boolean;
  joiningDate: string;
  expireDate: number; // day of month, e.g. 27 or 5
  balanceDue: number;
  lastLogin?: string;
  isVip?: boolean;
  allocatedIp?: string;
}

export interface BillRecord {
  id: string;
  clientCode: string;
  username: string;
  clientName: string;
  mobile: string;
  zone: string;
  clientType: string;
  connectionType: string;
  address: string;
  package: string;
  speed: string;
  expireDay: number;
  monthlyBill: number;
  receivedAmount: number;
  vatAmount: number;
  balanceDue: number;
  advanceAmount: number;
  paymentDate?: string;
  server: string;
  mikrotikStatus: boolean;
  billingStatus: 'Paid' | 'Unpaid' | 'Partially Paid';
}

export interface PaymentReceipt {
  id: string;
  clientCode: string;
  receivedDate: string;
  receivedBy: string; // "bKash", "Cash", "Nagad", "Rocket", "Bank"
  paymentMethod: string;
  paymentInfo: string;
  createdBy: string;
  remarks: string;
  discount: number;
  receivedBill: number;
  totalBill: number;
  vat: number;
  balanceDue: number;
  receiptNo: string;
  month: string;
}

export interface SupportTicket {
  ticketNo: string;
  clientCode: string;
  username: string;
  customerName: string;
  mobile: string;
  complainNo: string;
  zone: string;
  subzone: string;
  box: string;
  problem: 'No Internet' | 'Fiber Cut' | 'Pon Loss' | 'Speed Issue' | 'Forget Password' | 'Billing Query';
  priority: 'High' | 'Medium' | 'Low';
  complainTime: string;
  createdBy: string;
  status: 'Pending' | 'Processing' | 'Solved';
  assignTo: string; // "Sobuj Biplob (09-05-26)", "Rasel Hossain (09-05-26)"
  solvedTime?: string;
  duration: string;
  note?: string;
}

export interface MikrotikServerItem {
  id: string;
  serial: number;
  name: string; // "BBN-CORE"
  ip: string; // "157.10.238.100"
  username: string;
  port: number; // 1122
  version: string; // "v3" / "v7"
  timeout: string; // "10 sec."
  status: boolean;
  activeClients: number;
  latencyMs: number;
  cpuUsage: number;
  uptime: string;
}

export interface PopReseller {
  id?: string;
  code?: string; // "0002"
  name: string; // "BBN- Joymonirhat Branch"
  type?: 'Prepaid' | 'Postpaid';
  contactPerson?: string;
  serverName?: string;
  mobile?: string;
  companyName?: string;
  level?: string; // "Level 1"
  tariffName?: string; // "Zinnia"
  clientsRunning?: number; // 115
  clientsEnabled?: number; // 38
  clientsDisabled?: number; // 77
  clientsLeft?: number; // 24
  remainingFund?: number; // 441.47
  clientEnabled?: boolean;
  fundStart?: boolean;
  isLocked?: boolean;
  proprietor?: string;
  zone?: string;
  server?: string;
  bandwidthAllocated?: string;
  clientCount?: number;
  balanceDue?: number;
  monthlyBill?: number;
  status?: string;
}

export interface AutomatedProcessItem {
  id: string;
  branch: string;
  processName: string;
  executeAt: string;
  interval: 'Daily' | 'Hourly' | 'Monthly' | 'Minutely' | 'Yearly' | 'Custom';
  executionDay: string;
  status: 'Active' | 'Paused';
  category?: 'System' | 'Admin Customer' | 'POP' | 'POP Customer' | 'Bandwidth POP';
  lastRun?: string;
  nextRun?: string;
  name?: string;
  description?: string;
  frequency?: string;
  enabled?: boolean;
  targetSubsystem?: string;
  cronPattern?: string;
  recordsAffected?: number;
  lastRunDuration?: string;
  lastRunStatus?: 'Success' | 'Warning' | 'Error';
}

export interface SmsTemplateItem {
  id: number | string;
  name: string;
  type: 'Default' | 'Custom';
  template: string;
  title?: string;
  status?: string;
}

export interface SmsGatewayConfig {
  provider: string;
  senderId: string;
  username: string;
  password?: string;
  smsBalance: number;
  todaysSend: number;
  thisMonthSend: number;
  thisMonthFailed: number;
  apiEndpoint?: string;
  isConnected?: boolean;
}

export interface AppUser {
  id: string;
  srNo: number;
  userName: string;
  password?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  employee?: string;
  roleGroup: string;
  assignedModules: string;
  modulesList?: string[];
  email?: string;
  mobile?: string;
  lastLogin?: string;
  createdAt?: string;
}

export interface UserRoleItem {
  id: string;
  roleName: string;
  description: string;
  userCount: number;
  status: 'Active' | 'Inactive';
  permissions: string[];
}

export interface ModulePermissionItem {
  moduleId: string;
  moduleName: string;
  category: string;
  subModules: string[];
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}
