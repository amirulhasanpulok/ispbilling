import React, { useState, useMemo } from 'react';
import {
  Users,
  Shield,
  Layers,
  Plus,
  Search,
  Eye,
  EyeOff,
  Trash2,
  Check,
  X,
  Lock,
  UserCheck,
  KeyRound,
  Sliders,
  AlertTriangle,
  RefreshCw,
  Edit3
} from 'lucide-react';
import { AppUser, UserRoleItem, ModulePermissionItem } from '../types';

interface ApplicationUsersViewProps {
  onShowToast?: (message: string) => void;
}

const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr-1',
    srNo: 1,
    userName: 'bbnanwar',
    password: '•••••••••',
    status: 'Active',
    employee: '',
    roleGroup: 'Management',
    assignedModules: 'Client, Add New, Client List....',
    modulesList: ['Client', 'Billing', 'Mikrotik', 'Accounting', 'Support', 'SMS', 'System', 'Report'],
    email: 'anwar@bbnisp.net',
    mobile: '01711000001',
    createdAt: '2024-01-15'
  },
  {
    id: 'usr-2',
    srNo: 2,
    userName: 'bbnrasel',
    password: '•••••••••',
    status: 'Active',
    employee: 'Rasel Hossain',
    roleGroup: 'Technical',
    assignedModules: 'Billing, Billing List, Support & Ticketing....',
    modulesList: ['Billing', 'Support', 'Mikrotik', 'Network'],
    email: 'rasel@bbnisp.net',
    mobile: '01712000002',
    createdAt: '2024-02-01'
  },
  {
    id: 'usr-3',
    srNo: 3,
    userName: 'bbnpavel',
    password: '•••••••••',
    status: 'Active',
    employee: 'Md Mostaque Ahmed',
    roleGroup: 'Management',
    assignedModules: 'Client, Add New, Client List....',
    modulesList: ['Client', 'Billing', 'Mikrotik', 'Accounting', 'Support', 'System', 'Report'],
    email: 'pavel@bbnisp.net',
    mobile: '01713000003',
    createdAt: '2024-02-10'
  },
  {
    id: 'usr-4',
    srNo: 4,
    userName: 'bbnsobuj',
    password: '•••••••••',
    status: 'Active',
    employee: 'Sobuj Biplob',
    roleGroup: 'Technical',
    assignedModules: 'Billing, Billing List, Support & Ticketing....',
    modulesList: ['Billing', 'Support', 'Mikrotik', 'Network', 'Client'],
    email: 'sobuj@bbnisp.net',
    mobile: '01714000004',
    createdAt: '2024-03-05'
  },
  {
    id: 'usr-5',
    srNo: 5,
    userName: 'bbnasad',
    password: '•••••••••',
    status: 'Active',
    employee: 'Md Assaduzzman Asad',
    roleGroup: 'Employee',
    assignedModules: 'Client, Add New, Client List....',
    modulesList: ['Client', 'Billing', 'Support'],
    email: 'asad@bbnisp.net',
    mobile: '01715000005',
    createdAt: '2024-03-20'
  }
];

const INITIAL_ROLES: UserRoleItem[] = [
  {
    id: 'role-mgmt',
    roleName: 'Management',
    description: 'Executive supervision, complete financial, system setup, router config & audit control',
    userCount: 2,
    status: 'Active',
    permissions: ['Full Access', 'Client Manage', 'Billing Master', 'Mikrotik Exec', 'System Setup']
  },
  {
    id: 'role-tech',
    roleName: 'Technical',
    description: 'NOC operations, fiber line diagnostics, Mikrotik session control & support tickets',
    userCount: 2,
    status: 'Active',
    permissions: ['Support NOC', 'Mikrotik Monitor', 'OLT Inspection', 'Client View']
  },
  {
    id: 'role-emp',
    roleName: 'Employee',
    description: 'Front desk operations, new client registration, basic bill collection & inquiry lookup',
    userCount: 1,
    status: 'Active',
    permissions: ['Client Add/Edit', 'Bill Receive', 'Ticket Log']
  },
  {
    id: 'role-acc',
    roleName: 'Accountant',
    description: 'Daily collection receipts, voucher entry, cash book audit, tax & BTRC reporting',
    userCount: 1,
    status: 'Active',
    permissions: ['Daily Accounts', 'Vouchers', 'Cash Book', 'BTRC Reports']
  },
  {
    id: 'role-reseller',
    roleName: 'Reseller Admin',
    description: 'Sub-ISP branch management, bandwidth pool allocation, sub-client provisioning',
    userCount: 3,
    status: 'Active',
    permissions: ['POP Reseller', 'Sub Clients', 'Branch Ledger']
  }
];

const INITIAL_MODULES: ModulePermissionItem[] = [
  {
    moduleId: 'mod-client',
    moduleName: 'Client Management',
    category: 'Core Subscriber',
    subModules: ['Client List', 'Add New Client', 'Client Profile', 'Left Out Clients'],
    canView: true,
    canCreate: true,
    canEdit: true,
    canDelete: false
  },
  {
    moduleId: 'mod-billing',
    moduleName: 'Billing & Invoicing',
    category: 'Finance & Invoicing',
    subModules: ['Billing List', 'Bill Receive (Cash/MFS)', 'Print Invoice', 'Auto Billing Cycle'],
    canView: true,
    canCreate: true,
    canEdit: true,
    canDelete: false
  },
  {
    moduleId: 'mod-mikrotik',
    moduleName: 'Mikrotik RouterOS Control',
    category: 'Network Operations',
    subModules: ['Router Servers', 'Live Queues', 'PPPoE Secrets', 'Kick Active Sessions'],
    canView: true,
    canCreate: false,
    canEdit: false,
    canDelete: false
  },
  {
    moduleId: 'mod-accounting',
    moduleName: 'Daily Accounts & Cash Book',
    category: 'Finance & Invoicing',
    subModules: ['Daily Collection', 'Expense Entries', 'Cash Book Audit', 'Balance Sheet'],
    canView: true,
    canCreate: false,
    canEdit: false,
    canDelete: false
  },
  {
    moduleId: 'mod-support',
    moduleName: 'Support Ticketing & NOC',
    category: 'Customer Service',
    subModules: ['Ticket List', 'Assign Technician', 'Resolve Ticket', 'Fiber Loss Complain'],
    canView: true,
    canCreate: true,
    canEdit: true,
    canDelete: false
  },
  {
    moduleId: 'mod-sms',
    moduleName: 'SMS Service & Templates',
    category: 'Communication',
    subModules: ['Bill Reminder SMS', 'Welcome SMS', 'Payment Confirmation', 'Gateway Setup'],
    canView: true,
    canCreate: true,
    canEdit: false,
    canDelete: false
  },
  {
    moduleId: 'mod-reseller',
    moduleName: 'POP / Reseller Management',
    category: 'Franchise & POP',
    subModules: ['Branch POPs', 'Bandwidth Allocation', 'Balance Recharge', 'Sub-Clients'],
    canView: false,
    canCreate: false,
    canEdit: false,
    canDelete: false
  },
  {
    moduleId: 'mod-system',
    moduleName: 'System Administration',
    category: 'System Config',
    subModules: ['Application Users', 'Company SetUp', 'Periods SetUp', 'Automatic Process'],
    canView: false,
    canCreate: false,
    canEdit: false,
    canDelete: false
  },
  {
    moduleId: 'mod-reports',
    moduleName: 'Reports & BTRC Submissions',
    category: 'Reporting & Analytics',
    subModules: ['Collection Report', 'BTRC Monthly Return', 'Financial Statement'],
    canView: true,
    canCreate: false,
    canEdit: false,
    canDelete: false
  }
];

const ALL_SYSTEM_MODULES = [
  'Client',
  'Add New',
  'Client List',
  'Billing',
  'Billing List',
  'Bill Receive',
  'Support & Ticketing',
  'Mikrotik RouterOS',
  'Network Monitoring',
  'Daily Account',
  'Accounting',
  'SMS Service',
  'Affiliation',
  'System SetUp',
  'Reports'
];

export const ApplicationUsersView: React.FC<ApplicationUsersViewProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions'>('users');
  const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS);
  const [roles, setRoles] = useState<UserRoleItem[]>(INITIAL_ROLES);
  const [permissions, setPermissions] = useState<ModulePermissionItem[]>(INITIAL_MODULES);

  // Filters for Application Users table
  const [filterStatus, setFilterStatus] = useState('Select');
  const [filterEmployee, setFilterEmployee] = useState('Select');
  const [filterRole, setFilterRole] = useState('Select');
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(100);

  // Password visibility map (per user ID)
  const [visiblePasswords, setVisiblePasswords] = useState<{ [userId: string]: boolean }>({});

  // Modals state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<AppUser | null>(null);
  const [deleteConfirmationUser, setDeleteConfirmationUser] = useState<AppUser | null>(null);

  // Form state for New User
  const [newUserForm, setNewUserForm] = useState({
    userName: '',
    password: '',
    employee: '',
    roleGroup: 'Technical',
    status: 'Active' as 'Active' | 'Inactive' | 'Suspended',
    email: '',
    mobile: '',
    assignedModules: ['Client', 'Billing', 'Support & Ticketing']
  });

  // Selected role for Permissions tab
  const [selectedPermissionRole, setSelectedPermissionRole] = useState('Technical');

  // Helper toast trigger
  const notify = (msg: string) => {
    if (onShowToast) onShowToast(msg);
  };

  // Toggle password visibility
  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (filterStatus !== 'Select' && u.status !== filterStatus) return false;
      if (filterEmployee !== 'Select') {
        if (!u.employee || u.employee !== filterEmployee) return false;
      }
      if (filterRole !== 'Select' && u.roleGroup !== filterRole) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesUser = u.userName.toLowerCase().includes(q);
        const matchesEmp = (u.employee || '').toLowerCase().includes(q);
        const matchesRole = u.roleGroup.toLowerCase().includes(q);
        const matchesMod = u.assignedModules.toLowerCase().includes(q);
        if (!matchesUser && !matchesEmp && !matchesRole && !matchesMod) return false;
      }
      return true;
    });
  }, [users, filterStatus, filterEmployee, filterRole, searchQuery]);

  // Unique employees for filter dropdown
  const employeeOptions = useMemo(() => {
    const list: string[] = [];
    users.forEach((u) => {
      if (u.employee && !list.includes(u.employee)) {
        list.push(u.employee);
      }
    });
    return list;
  }, [users]);

  // Unique roles for filter dropdown
  const roleOptions = useMemo(() => {
    const list: string[] = [];
    users.forEach((u) => {
      if (u.roleGroup && !list.includes(u.roleGroup)) {
        list.push(u.roleGroup);
      }
    });
    return list;
  }, [users]);

  // Handle Add New User
  const handleSaveNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.userName.trim()) {
      notify('Please enter a valid User Name.');
      return;
    }
    if (!newUserForm.password.trim()) {
      notify('Please specify a secure password for this user.');
      return;
    }

    const assignedStr =
      newUserForm.assignedModules.length > 0
        ? `${newUserForm.assignedModules.slice(0, 3).join(', ')}....`
        : 'None';

    const newUser: AppUser = {
      id: `usr-${Date.now()}`,
      srNo: users.length + 1,
      userName: newUserForm.userName.toLowerCase().trim(),
      password: newUserForm.password,
      status: newUserForm.status,
      employee: newUserForm.employee.trim(),
      roleGroup: newUserForm.roleGroup,
      assignedModules: assignedStr,
      modulesList: newUserForm.assignedModules,
      email: newUserForm.email,
      mobile: newUserForm.mobile,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers((prev) => [...prev, newUser]);
    setIsAddUserModalOpen(false);
    setNewUserForm({
      userName: '',
      password: '',
      employee: '',
      roleGroup: 'Technical',
      status: 'Active',
      email: '',
      mobile: '',
      assignedModules: ['Client', 'Billing', 'Support & Ticketing']
    });
    notify(`Application User '${newUser.userName}' created successfully!`);
  };

  // Handle Save Edit User
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForEdit) return;

    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUserForEdit.id ? selectedUserForEdit : u))
    );
    setIsEditUserModalOpen(false);
    setSelectedUserForEdit(null);
    notify(`User '${selectedUserForEdit.userName}' updated successfully.`);
  };

  // Handle Delete User
  const handleConfirmDelete = () => {
    if (!deleteConfirmationUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteConfirmationUser.id));
    notify(`User '${deleteConfirmationUser.userName}' has been deleted.`);
    setDeleteConfirmationUser(null);
  };

  // Toggle permission matrix checkbox
  const handleTogglePermission = (
    moduleId: string,
    field: 'canView' | 'canCreate' | 'canEdit' | 'canDelete'
  ) => {
    setPermissions((prev) =>
      prev.map((m) => (m.moduleId === moduleId ? { ...m, [field]: !m[field] } : m))
    );
  };

  return (
    <div className="p-4 md:p-6 bg-[#f4f7f9] min-h-[calc(100vh-3.5rem)] text-slate-800">
      {/* Top Header & Tab Pill Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Pill Tabs matching the screenshot */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="tab-app-users"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-sm ${
              activeTab === 'users'
                ? 'bg-[#162e3d] text-white border border-[#162e3d]'
                : 'bg-white text-[#162e3d] border border-[#162e3d] hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Application Users</span>
          </button>

          <button
            id="tab-user-roles"
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-sm ${
              activeTab === 'roles'
                ? 'bg-[#162e3d] text-white border border-[#162e3d]'
                : 'bg-white text-[#162e3d] border border-[#162e3d] hover:bg-slate-100'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>User Roles(Groups)</span>
          </button>

          <button
            id="tab-role-modules"
            onClick={() => setActiveTab('permissions')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-sm ${
              activeTab === 'permissions'
                ? 'bg-[#162e3d] text-white border border-[#162e3d]'
                : 'bg-white text-[#162e3d] border border-[#162e3d] hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Role Modules(Permissions)</span>
          </button>
        </div>

        {/* Right side + New User action button */}
        <div className="flex items-center gap-2">
          <button
            id="btn-new-user"
            onClick={() => setIsAddUserModalOpen(true)}
            className="bg-[#162e3d] hover:bg-[#1b3a4b] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New User</span>
          </button>
          <button
            title="Refresh Users"
            onClick={() => notify('User listing refreshed')}
            className="w-8 h-8 rounded-full bg-[#162e3d] hover:bg-[#1b3a4b] text-white flex items-center justify-center shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* TAB 1: APPLICATION USERS (Exact match to screenshot) */}
      {activeTab === 'users' && (
        <div className="bg-white rounded border border-slate-200 shadow-sm p-4 md:p-5">
          {/* Top Filter Bar (USER STATUS, EMPLOYEE, USER ROLE) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 pb-5 border-b border-slate-100">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 tracking-wider uppercase">
                USER STATUS
              </label>
              <select
                id="filter-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Select">Select</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 tracking-wider uppercase">
                EMPLOYEE
              </label>
              <select
                id="filter-employee"
                value={filterEmployee}
                onChange={(e) => setFilterEmployee(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Select">Select</option>
                {employeeOptions.map((emp) => (
                  <option key={emp} value={emp}>
                    {emp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 tracking-wider uppercase">
                USER ROLE
              </label>
              <select
                id="filter-role"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Select">Select</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Show entries and Search row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-medium uppercase tracking-wide">
              <span>SHOW</span>
              <select
                id="entries-per-page"
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 bg-white focus:outline-none focus:border-cyan-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>ENTRIES</span>
            </div>

            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 w-full sm:w-auto">
              <span>SEARCH:</span>
              <input
                id="search-users-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder=""
                className="border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:border-cyan-500 w-full sm:w-48 bg-white"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="border border-slate-200 rounded overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[880px]">
              {/* Table Header: Dark Navy */}
              <thead>
                <tr className="bg-[#1b3a4b] text-white text-xs font-semibold border-b border-[#162e3d]">
                  <th className="py-2.5 px-3 text-center w-16 border-r border-[#274b5f]">Sr.No.</th>
                  <th className="py-2.5 px-4 border-r border-[#274b5f]">User Name</th>
                  <th className="py-2.5 px-4 text-center border-r border-[#274b5f]">Password</th>
                  <th className="py-2.5 px-4 text-center border-r border-[#274b5f]">Status</th>
                  <th className="py-2.5 px-4 border-r border-[#274b5f]">Employee</th>
                  <th className="py-2.5 px-4 border-r border-[#274b5f]">Role/Group</th>
                  <th className="py-2.5 px-4 border-r border-[#274b5f]">Assigned Module</th>
                  <th className="py-2.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No matching application users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, idx) => {
                    const isPasswordRevealed = visiblePasswords[user.id];
                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        {/* Sr.No. */}
                        <td className="py-3 px-3 text-center text-slate-600 font-medium border-r border-slate-200">
                          {user.srNo || idx + 1}
                        </td>

                        {/* User Name */}
                        <td className="py-3 px-4 font-mono font-medium text-slate-800 border-r border-slate-200">
                          {user.userName}
                        </td>

                        {/* Password with toggle eye */}
                        <td className="py-3 px-4 text-center border-r border-slate-200">
                          <div className="inline-flex items-center justify-center gap-2">
                            <span className="tracking-widest font-mono text-slate-600">
                              {isPasswordRevealed ? (user.password === '•••••••••' ? 'anwar@bbn2026' : user.password) : '•••••••••'}
                            </span>
                            <button
                              id={`toggle-pwd-${user.id}`}
                              onClick={() => togglePasswordVisibility(user.id)}
                              title={isPasswordRevealed ? 'Hide Password' : 'Show Password'}
                              className="text-cyan-600 hover:text-cyan-800 focus:outline-none transition-colors"
                            >
                              {isPasswordRevealed ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Status (Green Pill badge) */}
                        <td className="py-3 px-4 text-center border-r border-slate-200">
                          <span
                            className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold ${
                              user.status === 'Active'
                                ? 'bg-[#00a65a] text-white shadow-xs'
                                : user.status === 'Suspended'
                                ? 'bg-red-500 text-white'
                                : 'bg-slate-400 text-white'
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>

                        {/* Employee */}
                        <td className="py-3 px-4 font-medium text-slate-700 border-r border-slate-200">
                          {user.employee || ''}
                        </td>

                        {/* Role/Group */}
                        <td className="py-3 px-4 font-medium text-slate-700 border-r border-slate-200">
                          {user.roleGroup}
                        </td>

                        {/* Assigned Module */}
                        <td className="py-3 px-4 text-slate-600 border-r border-slate-200">
                          {user.assignedModules}
                        </td>

                        {/* Action: Green Eye & Red Trash */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center justify-center gap-2">
                            {/* View / Edit Eye Button */}
                            <button
                              id={`btn-view-user-${user.id}`}
                              onClick={() => {
                                setSelectedUserForEdit({ ...user });
                                setIsEditUserModalOpen(true);
                              }}
                              title="View / Edit User"
                              className="text-[#00a65a] hover:text-emerald-700 p-1 rounded hover:bg-emerald-50 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Delete User Trash Button */}
                            <button
                              id={`btn-delete-user-${user.id}`}
                              onClick={() => setDeleteConfirmationUser(user)}
                              title="Delete User"
                              className="text-[#dd4b39] hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 text-xs text-slate-600">
            <div>
              Showing 1 to {filteredUsers.length} of {users.length} entries
            </div>

            <div className="flex items-center space-x-1">
              <button
                disabled
                className="px-3 py-1.5 border border-slate-200 rounded text-slate-400 cursor-not-allowed bg-slate-50 font-medium"
              >
                Previous
              </button>
              <button className="px-3 py-1.5 bg-[#007bff] text-white rounded font-semibold shadow-xs">
                1
              </button>
              <button
                disabled
                className="px-3 py-1.5 border border-slate-200 rounded text-slate-400 cursor-not-allowed bg-slate-50 font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER ROLES (GROUPS) */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded border border-slate-200 shadow-sm p-4 md:p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-600" />
                <span>Security Roles &amp; Groups</span>
              </h3>
              <p className="text-xs text-slate-500">
                Configure role templates and default permission sets for ISP administrative staff.
              </p>
            </div>
            <button
              onClick={() => notify('Create new Role modal available.')}
              className="bg-[#162e3d] hover:bg-[#1b3a4b] text-white text-xs font-semibold px-3.5 py-1.5 rounded shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Role</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:bg-white hover:border-cyan-300 transition-all shadow-xs"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{role.roleName}</h4>
                    <span className="text-[11px] text-cyan-700 font-medium">
                      {role.userCount} assigned users
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    {role.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-3 min-h-[36px]">{role.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {role.permissions.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600 font-medium"
                    >
                      {p}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <button
                    onClick={() => {
                      setSelectedPermissionRole(role.roleName);
                      setActiveTab('permissions');
                    }}
                    className="text-cyan-700 hover:text-cyan-900 font-medium hover:underline"
                  >
                    View Permissions &rarr;
                  </button>
                  <button
                    onClick={() => notify(`Editing role ${role.roleName}`)}
                    className="text-slate-500 hover:text-slate-800 font-medium"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ROLE MODULES (PERMISSIONS) */}
      {activeTab === 'permissions' && (
        <div className="bg-white rounded border border-slate-200 shadow-sm p-4 md:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-600" />
                <span>Module Permissions Matrix</span>
              </h3>
              <p className="text-xs text-slate-500">
                Grant or restrict fine-grained CRUD capabilities across core ISP application modules.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-xs font-semibold text-slate-600">Select Role:</label>
              <select
                value={selectedPermissionRole}
                onChange={(e) => setSelectedPermissionRole(e.target.value)}
                className="border border-slate-300 rounded px-3 py-1 text-xs text-slate-800 bg-white focus:outline-none focus:border-cyan-500"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.roleName}>
                    {r.roleName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border border-slate-200 rounded overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-[#1b3a4b] text-white text-xs font-semibold">
                  <th className="py-2.5 px-4">Application Module</th>
                  <th className="py-2.5 px-4">Sub-Modules Included</th>
                  <th className="py-2.5 px-3 text-center w-20">View</th>
                  <th className="py-2.5 px-3 text-center w-20">Create</th>
                  <th className="py-2.5 px-3 text-center w-20">Edit</th>
                  <th className="py-2.5 px-3 text-center w-20">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                {permissions.map((mod) => (
                  <tr key={mod.moduleId} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      <div>{mod.moduleName}</div>
                      <span className="text-[10px] text-slate-400 font-normal">{mod.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {mod.subModules.map((sub, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px]"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={mod.canView}
                        onChange={() => handleTogglePermission(mod.moduleId, 'canView')}
                        className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={mod.canCreate}
                        onChange={() => handleTogglePermission(mod.moduleId, 'canCreate')}
                        className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={mod.canEdit}
                        onChange={() => handleTogglePermission(mod.moduleId, 'canEdit')}
                        className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={mod.canDelete}
                        onChange={() => handleTogglePermission(mod.moduleId, 'canDelete')}
                        className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => notify(`Permissions successfully saved for ${selectedPermissionRole}!`)}
              className="bg-[#162e3d] hover:bg-[#1b3a4b] text-white px-5 py-2 rounded text-xs font-semibold shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Permissions for {selectedPermissionRole}</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL: + New User */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="bg-[#162e3d] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-sm">Add New Application User</h3>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewUser} className="p-5 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    User Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. bbnarif"
                    value={newUserForm.userName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, userName: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Enter password"
                      value={newUserForm.password}
                      onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setNewUserForm({
                          ...newUserForm,
                          password: `bbn#${Math.random().toString(36).slice(-6)}`
                        })
                      }
                      className="absolute right-2 top-1.5 text-[10px] text-cyan-600 font-semibold hover:underline"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Linked Employee Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Arifur Rahman"
                    value={newUserForm.employee}
                    onChange={(e) => setNewUserForm({ ...newUserForm, employee: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Role / Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newUserForm.roleGroup}
                    onChange={(e) => setNewUserForm({ ...newUserForm, roleGroup: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Management">Management</option>
                    <option value="Technical">Technical</option>
                    <option value="Employee">Employee</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Reseller Admin">Reseller Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile</label>
                  <input
                    type="text"
                    placeholder="017xxxxxxxx"
                    value={newUserForm.mobile}
                    onChange={(e) => setNewUserForm({ ...newUserForm, mobile: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={newUserForm.status}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        status: e.target.value as 'Active' | 'Inactive' | 'Suspended'
                      })
                    }
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Module Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Assigned Application Modules
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200 max-h-36 overflow-y-auto">
                  {ALL_SYSTEM_MODULES.map((mod) => {
                    const isChecked = newUserForm.assignedModules.includes(mod);
                    return (
                      <label
                        key={mod}
                        className="flex items-center space-x-1.5 text-[11px] text-slate-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setNewUserForm({
                                ...newUserForm,
                                assignedModules: newUserForm.assignedModules.filter((m) => m !== mod)
                              });
                            } else {
                              setNewUserForm({
                                ...newUserForm,
                                assignedModules: [...newUserForm.assignedModules, mod]
                              });
                            }
                          }}
                          className="w-3.5 h-3.5 text-cyan-600 rounded border-slate-300"
                        />
                        <span className="truncate">{mod}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#162e3d] hover:bg-[#1b3a4b] text-white rounded text-xs font-semibold shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: View / Edit User Details */}
      {isEditUserModalOpen && selectedUserForEdit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="bg-[#162e3d] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-sm">
                  User Details: {selectedUserForEdit.userName}
                </h3>
              </div>
              <button
                onClick={() => setIsEditUserModalOpen(false)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="p-5 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">User Name</label>
                  <input
                    type="text"
                    disabled
                    value={selectedUserForEdit.userName}
                    className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-500 bg-slate-100 font-mono cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={selectedUserForEdit.status}
                    onChange={(e) =>
                      setSelectedUserForEdit({
                        ...selectedUserForEdit,
                        status: e.target.value as 'Active' | 'Inactive' | 'Suspended'
                      })
                    }
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Linked Employee</label>
                  <input
                    type="text"
                    value={selectedUserForEdit.employee || ''}
                    onChange={(e) =>
                      setSelectedUserForEdit({
                        ...selectedUserForEdit,
                        employee: e.target.value
                      })
                    }
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role / Group</label>
                  <select
                    value={selectedUserForEdit.roleGroup}
                    onChange={(e) =>
                      setSelectedUserForEdit({
                        ...selectedUserForEdit,
                        roleGroup: e.target.value
                      })
                    }
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Management">Management</option>
                    <option value="Technical">Technical</option>
                    <option value="Employee">Employee</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Reseller Admin">Reseller Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reset Password
                </label>
                <input
                  type="text"
                  placeholder="Enter new password (optional)"
                  value={
                    selectedUserForEdit.password === '•••••••••' ? '' : selectedUserForEdit.password
                  }
                  onChange={(e) =>
                    setSelectedUserForEdit({
                      ...selectedUserForEdit,
                      password: e.target.value
                    })
                  }
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Modules Description</label>
                <input
                  type="text"
                  value={selectedUserForEdit.assignedModules}
                  onChange={(e) =>
                    setSelectedUserForEdit({
                      ...selectedUserForEdit,
                      assignedModules: e.target.value
                    })
                  }
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00a65a] hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Update User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Delete User Confirmation */}
      {deleteConfirmationUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-5 animate-in fade-in duration-150">
            <div className="flex items-center space-x-3 text-red-600 mb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-sm text-slate-900">Delete Application User?</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Are you sure you want to remove user{' '}
              <strong className="font-mono text-slate-800">{deleteConfirmationUser.userName}</strong>{' '}
              ({deleteConfirmationUser.employee || deleteConfirmationUser.roleGroup})? This user will
              no longer be able to log in to the BBN ISP portal.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteConfirmationUser(null)}
                className="px-4 py-1.5 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 bg-[#dd4b39] hover:bg-red-700 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
