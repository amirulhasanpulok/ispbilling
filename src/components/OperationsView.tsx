import React, { useState } from 'react';
import {
  CheckSquare,
  Handshake,
  DollarSign,
  ShoppingBag,
  Package,
  Layers,
  Tag,
  Share2,
  Video,
  Wrench,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Server,
  FileText,
  ExternalLink,
  ShieldCheck,
  Zap,
  Boxes,
  Cpu
} from 'lucide-react';

export type OperationModuleType =
  | 'task'
  | 'bandwidth-buy'
  | 'bandwidth-sale'
  | 'purchase'
  | 'inventory'
  | 'assets'
  | 'sales-service'
  | 'affiliation'
  | 'tutorials'
  | 'release';

interface OperationsViewProps {
  module: OperationModuleType;
  onShowToast?: (message: string) => void;
  onNavigate?: (nav: string) => void;
}

export const OperationsView: React.FC<OperationsViewProps> = ({
  module,
  onShowToast,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const notify = (msg: string) => {
    if (onShowToast) onShowToast(msg);
  };

  // 1. Task Management
  const [tasks, setTasks] = useState([
    {
      id: 'TSK-101',
      title: 'Fiber Splice Maintenance at Jamtola Node',
      assignee: 'Sobuj Biplob',
      priority: 'High',
      status: 'In Progress',
      dueDate: 'Today, 04:00 PM',
      category: 'Field Optical'
    },
    {
      id: 'TSK-102',
      title: 'Configure BTRC Monthly Log Archive',
      assignee: 'Md Assaduzzman Asad',
      priority: 'Normal',
      status: 'Completed',
      dueDate: 'Yesterday',
      category: 'System'
    },
    {
      id: 'TSK-103',
      title: 'Deploy Huawei OLT Board 2 in Bot Tola Subzone',
      assignee: 'Rasel Hossain',
      priority: 'High',
      status: 'Pending',
      dueDate: '16 Sep 2026',
      category: 'Infrastructure'
    },
    {
      id: 'TSK-104',
      title: 'Reconcile bKash Merchant Gateway Balances',
      assignee: 'Md Mostaque Ahmed',
      priority: 'Urgent',
      status: 'In Progress',
      dueDate: 'Today, 06:00 PM',
      category: 'Finance'
    }
  ]);

  // 2. Bandwidth Buy
  const [bandwidthPurchases, setBandwidthPurchases] = useState([
    {
      id: 'BW-BUY-01',
      provider: 'Summit Communications Ltd (ITC)',
      capacity: '2.5 Gbps',
      linkType: 'Dark Fiber 10G',
      location: 'Kurigram POP',
      monthlyCost: 215000,
      status: 'Active',
      latency: '8.4 ms'
    },
    {
      id: 'BW-BUY-02',
      provider: 'Fiber@Home Ltd (IIG)',
      capacity: '1.5 Gbps',
      linkType: 'Ethernet Layer-2',
      location: 'Rangpur Central',
      monthlyCost: 140000,
      status: 'Active',
      latency: '7.1 ms'
    },
    {
      id: 'BW-BUY-03',
      provider: 'BDIX Peering Port',
      capacity: '10.0 Gbps',
      linkType: 'Direct Peering VLAN 400',
      location: 'Dhaka Equinix',
      monthlyCost: 35000,
      status: 'Active',
      latency: '14.2 ms'
    }
  ]);

  // 3. Bandwidth Sale
  const [bandwidthSales, setBandwidthSales] = useState([
    {
      id: 'BW-SALE-01',
      client: 'Bhurungamari Pilot Govt High School',
      bandwidth: '100 Mbps Dedicated',
      ipAllocation: '/29 Public IPv4',
      monthlyBill: 12000,
      status: 'Active'
    },
    {
      id: 'BW-SALE-02',
      client: 'Upazila Health Complex NOC',
      bandwidth: '50 Mbps Dedicated',
      ipAllocation: '/29 Public IPv4',
      monthlyBill: 7500,
      status: 'Active'
    },
    {
      id: 'BW-SALE-03',
      client: 'Sonali Bank Bhurungamari Branch',
      bandwidth: '30 Mbps 1:1 Intranet',
      ipAllocation: '/30 Point-to-Point',
      monthlyBill: 6000,
      status: 'Active'
    }
  ]);

  // 4. Inventory Hardware & Stock
  const [inventoryItems, setInventoryItems] = useState([
    {
      code: 'INV-ONU-01',
      name: 'V-SOL Dual Band XPON ONU (V2802DAC)',
      category: 'ONU/ONT',
      inStock: 48,
      minAlert: 15,
      unitPrice: 2150,
      location: 'Main Warehouse Rack A'
    },
    {
      code: 'INV-RTR-02',
      name: 'TP-Link Archer C6 AC1200 Dual-Band Router',
      category: 'Customer Router',
      inStock: 24,
      minAlert: 10,
      unitPrice: 2850,
      location: 'Store Room Shelf 2'
    },
    {
      code: 'INV-FBR-03',
      name: 'Fiber Optic Drop Cable (2 Core FTTH - 1000m)',
      category: 'Cabling',
      inStock: 14,
      minAlert: 4,
      unitPrice: 4200,
      location: 'Field Depot Drum Area'
    },
    {
      code: 'INV-SPL-04',
      name: 'PLC Optical Splitter 1:8 SC/UPC Box Type',
      category: 'Passive Optical',
      inStock: 65,
      minAlert: 20,
      unitPrice: 380,
      location: 'Parts Bin #12'
    },
    {
      code: 'INV-MC-05',
      name: 'Gigabit Fiber Media Converter Pair (10/100/1000M)',
      category: 'Media Converter',
      inStock: 18,
      minAlert: 5,
      unitPrice: 1650,
      location: 'Electronics Cabinet B'
    }
  ]);

  // 5. Fixed Assets
  const [assets, setAssets] = useState([
    {
      id: 'AST-01',
      title: 'MikroTik CCR2116-12G-4S+ Core Router',
      serial: 'HE89-CCR-0019',
      purchaseDate: '2024-03-15',
      cost: 145000,
      condition: 'Excellent',
      location: 'NOC Data Center Rack 1'
    },
    {
      id: 'AST-02',
      title: 'Huawei SmartAX MA5800-X7 Chassis OLT',
      serial: 'HW-OLT-882194',
      purchaseDate: '2024-01-10',
      cost: 320000,
      condition: 'Operational',
      location: 'Central Distribution Room'
    },
    {
      id: 'AST-03',
      title: 'Online UPS 6KVA with 16x 100Ah Battery Bank',
      serial: 'UPS-POW-6000',
      purchaseDate: '2023-08-22',
      cost: 185000,
      condition: 'Good (Batteries healthy)',
      location: 'Power Substation 1'
    },
    {
      id: 'AST-04',
      title: 'Fujikura 70S+ Core Alignment Fusion Splicer Kit',
      serial: 'FJK-70S-9901',
      purchaseDate: '2023-11-05',
      cost: 295000,
      condition: 'Excellent (1,240 arcs)',
      location: 'Field Service Vehicle 1'
    }
  ]);

  return (
    <div className="p-4 md:p-6 bg-[#f4f7f9] min-h-[calc(100vh-3.5rem)] text-slate-800">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-[#162e3d] text-white flex items-center justify-center shadow-xs">
            {module === 'task' && <CheckSquare className="w-4 h-4 text-cyan-400" />}
            {(module === 'bandwidth-buy' || module === 'bandwidth-sale') && (
              <Zap className="w-4 h-4 text-amber-400" />
            )}
            {(module === 'purchase' || module === 'inventory') && (
              <Package className="w-4 h-4 text-emerald-400" />
            )}
            {module === 'assets' && <Cpu className="w-4 h-4 text-purple-400" />}
            {module === 'sales-service' && <Tag className="w-4 h-4 text-cyan-400" />}
            {module === 'affiliation' && <Share2 className="w-4 h-4 text-cyan-400" />}
            {module === 'tutorials' && <Video className="w-4 h-4 text-rose-400" />}
            {module === 'release' && <Wrench className="w-4 h-4 text-cyan-400" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight capitalize">
              {module === 'task' && 'Task Management'}
              {module === 'bandwidth-buy' && 'Bandwidth Buy (Upstream IIG/ITC)'}
              {module === 'bandwidth-sale' && 'Bandwidth Sale (Corporate & Leased Lines)'}
              {module === 'purchase' && 'Purchase Orders & Optical Procurements'}
              {module === 'inventory' && 'Hardware & Fiber Inventory'}
              {module === 'assets' && 'ISP Fixed Assets & NOC Equipment'}
              {module === 'sales-service' && 'Sales & Installation Services'}
              {module === 'affiliation' && 'Reseller & Affiliate Program'}
              {module === 'tutorials' && 'Knowledgebase & Video Tutorials'}
              {module === 'release' && 'Release Notes & Platform Changelog (v8.2.4)'}
            </h2>
            <p className="text-xs text-slate-500">BBN ISP Operational Management Module</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsActionModalOpen(true)}
            className="bg-[#162e3d] hover:bg-[#1f3f53] text-white text-xs font-semibold px-3 py-1.5 rounded shadow-xs flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {module === 'task' && 'New Task'}
              {module === 'bandwidth-buy' && 'Add Upstream Link'}
              {module === 'bandwidth-sale' && 'New Corporate Lease'}
              {module === 'inventory' && 'Stock Intake'}
              {module === 'assets' && 'Add NOC Asset'}
              {(module === 'purchase' || module === 'sales-service') && 'Create Order'}
              {(module === 'affiliation' || module === 'tutorials' || module === 'release') &&
                'Action Center'}
            </span>
          </button>
        </div>
      </div>

      {/* MODULE 1: TASK MANAGEMENT */}
      {module === 'task' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Active Tasks</span>
                <div className="text-xl font-bold text-slate-900">
                  {tasks.filter((t) => t.status !== 'Completed').length}
                </div>
              </div>
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Urgent Field Work</span>
                <div className="text-xl font-bold text-red-600">2</div>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Resolved This Week</span>
                <div className="text-xl font-bold text-emerald-600">14</div>
              </div>
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-[#1b3a4b] text-white px-4 py-2.5 flex items-center justify-between">
              <span className="font-semibold text-xs flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-cyan-400" />
                Operational Tasks Queue
              </span>
              <span className="text-[11px] text-slate-300">Live NOC & Field Sync</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Task ID</th>
                    <th className="py-2.5 px-3">Task Title</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Assignee</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">Due Time</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tasks.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{t.id}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">{t.title}</td>
                      <td className="py-2.5 px-3 text-slate-600">{t.category}</td>
                      <td className="py-2.5 px-3 text-slate-800">{t.assignee}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.priority === 'Urgent' || t.priority === 'High'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{t.dueDate}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => {
                            setTasks((prev) =>
                              prev.map((item) =>
                                item.id === t.id
                                  ? {
                                      ...item,
                                      status: item.status === 'Completed' ? 'In Progress' : 'Completed'
                                    }
                                  : item
                              )
                            );
                            notify(`Task ${t.id} status toggled!`);
                          }}
                          className="text-cyan-700 hover:text-cyan-900 font-semibold"
                        >
                          {t.status === 'Completed' ? 'Reopen' : 'Done'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: BANDWIDTH BUY & SALE */}
      {(module === 'bandwidth-buy' || module === 'bandwidth-sale') && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Total Upstream Capacity</span>
                <div className="text-xl font-bold text-slate-900">14.0 Gbps</div>
              </div>
              <Zap className="w-6 h-6 text-amber-500" />
            </div>
            <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Monthly Upstream Expense</span>
                <div className="text-xl font-bold text-red-600">৳390,000</div>
              </div>
              <DollarSign className="w-6 h-6 text-red-500" />
            </div>
            <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Corporate Lease Revenue</span>
                <div className="text-xl font-bold text-emerald-600">৳25,500/mo</div>
              </div>
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-[#1b3a4b] text-white px-4 py-2.5 flex items-center justify-between">
              <span className="font-semibold text-xs flex items-center gap-2">
                <Handshake className="w-4 h-4 text-cyan-400" />
                {module === 'bandwidth-buy' ? 'IIG / ITC Upstream Feeds' : 'Corporate Leased Lines'}
              </span>
              <span className="text-[11px] text-slate-300">BTRC Compliant Gateway Links</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                  {module === 'bandwidth-buy' ? (
                    <tr>
                      <th className="py-2.5 px-3">Link ID</th>
                      <th className="py-2.5 px-3">Carrier / Upstream Provider</th>
                      <th className="py-2.5 px-3">Capacity</th>
                      <th className="py-2.5 px-3">Interface</th>
                      <th className="py-2.5 px-3">Latency</th>
                      <th className="py-2.5 px-3">Monthly Charge</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="py-2.5 px-3">Circuit ID</th>
                      <th className="py-2.5 px-3">Corporate Client</th>
                      <th className="py-2.5 px-3">Committed Bandwidth</th>
                      <th className="py-2.5 px-3">IP Subnet</th>
                      <th className="py-2.5 px-3">Monthly Bill</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {module === 'bandwidth-buy'
                    ? bandwidthPurchases.map((bw) => (
                        <tr key={bw.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{bw.id}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{bw.provider}</td>
                          <td className="py-2.5 px-3 font-bold text-cyan-700">{bw.capacity}</td>
                          <td className="py-2.5 px-3 text-slate-600">{bw.linkType}</td>
                          <td className="py-2.5 px-3 font-mono text-emerald-600">{bw.latency}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">
                            ৳{bw.monthlyCost.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {bw.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    : bandwidthSales.map((bs) => (
                        <tr key={bs.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{bs.id}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{bs.client}</td>
                          <td className="py-2.5 px-3 font-bold text-cyan-700">{bs.bandwidth}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{bs.ipAllocation}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">
                            ৳{bs.monthlyBill.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {bs.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: INVENTORY & HARDWARE */}
      {(module === 'inventory' || module === 'purchase') && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Total Stock Items</span>
                <div className="text-xl font-bold text-slate-900">
                  {inventoryItems.reduce((acc, i) => acc + i.inStock, 0)} Units
                </div>
              </div>
              <Boxes className="w-6 h-6 text-cyan-500" />
            </div>
            <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Inventory Valuation</span>
                <div className="text-xl font-bold text-emerald-600">
                  ৳
                  {inventoryItems
                    .reduce((acc, i) => acc + i.inStock * i.unitPrice, 0)
                    .toLocaleString()}
                </div>
              </div>
              <DollarSign className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Low Stock Reorders</span>
                <div className="text-xl font-bold text-amber-600">
                  {inventoryItems.filter((i) => i.inStock <= i.minAlert).length} Items
                </div>
              </div>
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
          </div>

          <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-[#1b3a4b] text-white px-4 py-2.5 flex items-center justify-between">
              <span className="font-semibold text-xs flex items-center gap-2">
                <Package className="w-4 h-4 text-cyan-400" />
                Optical & Hardware Stock Catalog
              </span>
              <span className="text-[11px] text-slate-300">Central Storage Bin Control</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Item Code</th>
                    <th className="py-2.5 px-3">Equipment Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Storage Location</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-center">In Stock</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventoryItems.map((item) => (
                    <tr key={item.code} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{item.code}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{item.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{item.category}</td>
                      <td className="py-2.5 px-3 text-slate-500">{item.location}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-800">
                        ৳{item.unitPrice.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.inStock <= item.minAlert
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.inStock} units
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => {
                            setInventoryItems((prev) =>
                              prev.map((i) =>
                                i.code === item.code ? { ...i, inStock: i.inStock + 10 } : i
                              )
                            );
                            notify(`Added 10 units to ${item.name}!`);
                          }}
                          className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-medium"
                        >
                          +10 Stock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 4: ASSETS */}
      {module === 'assets' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Core Network Assets Total</span>
                <div className="text-xl font-bold text-slate-900">
                  ৳{assets.reduce((acc, a) => acc + a.cost, 0).toLocaleString()}
                </div>
              </div>
              <Cpu className="w-6 h-6 text-purple-600" />
            </div>
            <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Equipment Operational Status</span>
                <div className="text-xl font-bold text-emerald-600">100% Online</div>
              </div>
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-[#1b3a4b] text-white px-4 py-2.5 flex items-center justify-between">
              <span className="font-semibold text-xs flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Capital NOC & Infrastructure Assets
              </span>
              <span className="text-[11px] text-slate-300">Depreciation Tracking</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Asset ID</th>
                    <th className="py-2.5 px-3">Asset Description</th>
                    <th className="py-2.5 px-3">Serial No</th>
                    <th className="py-2.5 px-3">Acquired Date</th>
                    <th className="py-2.5 px-3">Installed Location</th>
                    <th className="py-2.5 px-3 text-right">Acquisition Cost</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assets.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{a.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{a.title}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{a.serial}</td>
                      <td className="py-2.5 px-3 text-slate-600">{a.purchaseDate}</td>
                      <td className="py-2.5 px-3 text-slate-600">{a.location}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        ৳{a.cost.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {a.condition}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 5: SALES & SERVICE */}
      {module === 'sales-service' && (
        <div className="bg-white rounded border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Broadband Installation & Retail Packages</h3>
            <span className="text-xs text-slate-500">Service Area: Bhurungamari & Neighboring Upazilas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-200 rounded p-4 bg-slate-50 space-y-2">
              <span className="font-bold text-xs text-cyan-700 uppercase tracking-wide">Fiber Home Starter</span>
              <div className="text-2xl font-bold text-slate-900">৳500<span className="text-xs text-slate-500">/month</span></div>
              <ul className="text-xs text-slate-600 space-y-1 pt-2">
                <li>• 15 Mbps Internet Speed</li>
                <li>• Unlimited BDIX / Youtube / FB Cache</li>
                <li>• Dual-Band ONU + Fiber Drop Included</li>
                <li>• 24/7 Field Tech Support</li>
              </ul>
              <button
                onClick={() => notify('Starter package selected!')}
                className="w-full mt-3 bg-[#162e3d] text-white py-1.5 rounded text-xs font-semibold"
              >
                Assign Package
              </button>
            </div>

            <div className="border-2 border-cyan-500 rounded p-4 bg-cyan-50/30 space-y-2 relative">
              <span className="absolute top-2 right-2 bg-cyan-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">POPULAR</span>
              <span className="font-bold text-xs text-cyan-800 uppercase tracking-wide">Standard Fiber Pro</span>
              <div className="text-2xl font-bold text-slate-900">৳800<span className="text-xs text-slate-500">/month</span></div>
              <ul className="text-xs text-slate-600 space-y-1 pt-2">
                <li>• 30 Mbps Full Duplex Speed</li>
                <li>• Real-Time Mikrotik Queue Priority</li>
                <li>• 1 Gbps BDIX FTP & Torrent Peering</li>
                <li>• Instant SMS Billing Alerts</li>
              </ul>
              <button
                onClick={() => notify('Standard Fiber Pro selected!')}
                className="w-full mt-3 bg-cyan-600 hover:bg-cyan-700 text-white py-1.5 rounded text-xs font-semibold"
              >
                Assign Package
              </button>
            </div>

            <div className="border border-slate-200 rounded p-4 bg-slate-50 space-y-2">
              <span className="font-bold text-xs text-purple-700 uppercase tracking-wide">Corporate Dedicated</span>
              <div className="text-2xl font-bold text-slate-900">৳2,500<span className="text-xs text-slate-500">/month</span></div>
              <ul className="text-xs text-slate-600 space-y-1 pt-2">
                <li>• 50 Mbps 1:1 CIR Bandwidth</li>
                <li>• 1 Static Public IPv4 Address</li>
                <li>• 99.9% Optical SLA Guarantee</li>
                <li>• Dedicated Account Manager</li>
              </ul>
              <button
                onClick={() => notify('Corporate Dedicated selected!')}
                className="w-full mt-3 bg-[#162e3d] text-white py-1.5 rounded text-xs font-semibold"
              >
                Assign Package
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 6: AFFILIATION */}
      {module === 'affiliation' && (
        <div className="bg-white rounded border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Reseller & Local Area Agent Affiliation</h3>
              <p className="text-xs text-slate-500">Commission model, POP partner distribution, and affiliate referral codes</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
              Affiliate Commission: 15% Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded p-4 space-y-2 bg-slate-50">
              <h4 className="font-bold text-xs text-slate-800">Partner Referral Link</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://bbnisp.net/join?ref=bbn_bhurungamari_hq"
                  className="flex-1 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono text-slate-700"
                />
                <button
                  onClick={() => notify('Affiliate link copied to clipboard!')}
                  className="bg-[#1b3a4b] text-white px-3 py-1 text-xs rounded font-medium"
                >
                  Copy
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Any customer signing up through this link is credited under your affiliate referral commission account.
              </p>
            </div>

            <div className="border border-slate-200 rounded p-4 space-y-2 bg-slate-50">
              <h4 className="font-bold text-xs text-slate-800">Top Reseller Points</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span>Bot Tola Fiber Hub (Rezaul)</span>
                  <span className="font-bold text-emerald-600">142 Active Clients</span>
                </div>
                <div className="flex justify-between">
                  <span>Jamtola North POP (Akhtar)</span>
                  <span className="font-bold text-emerald-600">89 Active Clients</span>
                </div>
                <div className="flex justify-between">
                  <span>College Mor Substation (Zaman)</span>
                  <span className="font-bold text-emerald-600">64 Active Clients</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 7: TUTORIALS */}
      {module === 'tutorials' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
              <div className="h-32 bg-slate-800 flex items-center justify-center text-white relative">
                <Video className="w-10 h-10 text-cyan-400" />
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                  08:45
                </span>
              </div>
              <div className="p-3.5 space-y-1">
                <h4 className="font-bold text-xs text-slate-900">
                  Configuring MikroTik RouterOS PPPoE Server with BBN Billing Sync
                </h4>
                <p className="text-[11px] text-slate-500">
                  Step-by-step guide on creating RADIUS profiles, secret secrets, and auto IP pool routing.
                </p>
                <button
                  onClick={() => notify('Opening tutorial video')}
                  className="text-xs text-cyan-600 hover:text-cyan-800 font-semibold pt-1 flex items-center gap-1"
                >
                  <span>Watch Video</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
              <div className="h-32 bg-slate-800 flex items-center justify-center text-white relative">
                <Video className="w-10 h-10 text-emerald-400" />
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                  12:20
                </span>
              </div>
              <div className="p-3.5 space-y-1">
                <h4 className="font-bold text-xs text-slate-900">
                  Optical Power Budget & OLT GPON Port Splicing Best Practices
                </h4>
                <p className="text-[11px] text-slate-500">
                  How to maintain -18dBm to -24dBm signal strength across 1:8 and 1:16 optical splitters.
                </p>
                <button
                  onClick={() => notify('Opening tutorial video')}
                  className="text-xs text-cyan-600 hover:text-cyan-800 font-semibold pt-1 flex items-center gap-1"
                >
                  <span>Watch Video</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
              <div className="h-32 bg-slate-800 flex items-center justify-center text-white relative">
                <Video className="w-10 h-10 text-amber-400" />
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                  06:15
                </span>
              </div>
              <div className="p-3.5 space-y-1">
                <h4 className="font-bold text-xs text-slate-900">
                  Automated Billing Cycles, SMS Gateways & bKash Tokenized Checkout
                </h4>
                <p className="text-[11px] text-slate-500">
                  Setting auto lock schedules on the 10th of every month and sending reminder templates.
                </p>
                <button
                  onClick={() => notify('Opening tutorial video')}
                  className="text-xs text-cyan-600 hover:text-cyan-800 font-semibold pt-1 flex items-center gap-1"
                >
                  <span>Watch Video</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 8: RELEASE NOTES (v8.2.4) */}
      {module === 'release' && (
        <div className="bg-white rounded border border-slate-200 shadow-xs p-5 space-y-5">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">BBN ISP Core Release v8.2.4 (Sep 2026)</h3>
              <p className="text-xs text-slate-500">Engineered for carrier-grade stability, BTRC compliance and MikroTik API v7.14+</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 font-mono text-xs font-bold">
              Build #2026.09.14-LTS
            </span>
          </div>

          <div className="space-y-4 text-xs text-slate-700">
            <div>
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Application Users & Granular RBAC Permissions
              </h4>
              <p className="text-slate-600">
                Added full management interface (`/ApplicationUsers/Index`) with User Roles, Role Modules matrix, employee linking, and toggleable masked password credentials.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                SMS Gateway Setup & Khudebarta v2.0 Integration
              </h4>
              <p className="text-slate-600">
                Integrated `/CompanySettings/SmsGateway` featuring 4 live metric cards (SMS Balance, Todays Send, Month Send, Month Failed), provider credentials management, and live test SMS transmitter.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                BTRC Regulatory Monthly Reporting
              </h4>
              <p className="text-slate-600">
                Enhanced subscriber logs, IPDR NAT logs retention, BTRC Form A &amp; Form B generation, and real-time active subscriber count verification.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Automated Customer Self-Service Portal
              </h4>
              <p className="text-slate-600">
                Subscribers can check live fiber ping, download VAT invoice receipts, and trigger instant bKash/Nagad digital recharges with automatic MikroTik session renewal.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {isActionModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              Quick Action: {module.replace('-', ' ').toUpperCase()}
            </h3>
            <p className="text-xs text-slate-600">
              Enter details below to log new item into the BBN core database.
            </p>
            <input
              type="text"
              placeholder="Item title or description..."
              className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-cyan-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsActionModalOpen(false)}
                className="px-3 py-1 border border-slate-300 rounded text-xs text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsActionModalOpen(false);
                  notify('Operational record saved successfully!');
                }}
                className="px-3.5 py-1 bg-[#162e3d] text-white rounded text-xs font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
