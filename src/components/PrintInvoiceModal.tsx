import React from 'react';
import { X, Printer, Download, CheckCircle, Wifi } from 'lucide-react';
import { BillRecord, PaymentReceipt } from '../types';

interface PrintInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill?: BillRecord | null;
  receipt?: PaymentReceipt | null;
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({
  isOpen,
  onClose,
  bill,
  receipt
}) => {
  if (!isOpen || (!bill && !receipt)) return null;

  const invoiceNumber = receipt ? receipt.receiptNo : `INV-${bill?.clientCode}-${Date.now().toString().slice(-4)}`;
  const dateStr = receipt ? receipt.receivedDate : '14 Sep 2026';
  const clientName = bill ? bill.clientName : 'Younus Ali';
  const clientCode = bill ? bill.clientCode : receipt?.clientCode || '0006';
  const username = bill ? bill.username : 'haven';
  const amount = receipt ? receipt.receivedBill : bill?.monthlyBill || 500;
  const vat = receipt ? receipt.vat : (bill?.vatAmount || 25);
  const total = receipt ? receipt.totalBill : (bill ? bill.monthlyBill + bill.vatAmount : 525);
  const packageName = bill ? bill.package : '10Mbps Optical Fiber';
  const paymentMethod = receipt ? receipt.paymentMethod : 'bKash Merchant';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-fade-in my-6">
        {/* Header toolbar */}
        <div className="bg-[#162e3d] text-white px-4 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm">Official Billing Receipt / Invoice</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold flex items-center gap-1 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button onClick={onClose} className="text-slate-300 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div id="printable-invoice" className="p-6 text-slate-800 text-xs bg-white space-y-6 print:p-0">
          {/* Top Brand & Invoice Title */}
          <div className="flex items-start justify-between border-b-2 border-[#162e3d] pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#162e3d] text-cyan-400 flex items-center justify-center font-bold">
                  <Wifi className="w-4 h-4" />
                </div>
                <h1 className="text-lg font-black text-[#162e3d] tracking-tight">
                  Bhurungamari Broadband Network (BBN)
                </h1>
              </div>
              <p className="text-slate-500 text-[11px] mt-1">
                Govt. Approved ISP Licensee | High-Speed Fiber Optical Network
              </p>
              <p className="text-slate-500 text-[11px]">
                Upazila Road, Bhurungamari, Kurigram | Helpline: 01710-287818
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-black rounded text-xs tracking-wider border border-emerald-300">
                MONEY RECEIPT
              </span>
              <div className="text-[11px] font-mono font-bold text-slate-800 mt-1">
                #{invoiceNumber}
              </div>
              <div className="text-[11px] text-slate-500">Date: {dateStr}</div>
            </div>
          </div>

          {/* Customer & Billing Metadata */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Bill To Customer</span>
              <div className="font-bold text-sm text-slate-900 mt-0.5">{clientName}</div>
              <div className="text-slate-600">Client Code: <span className="font-mono font-bold text-[#162e3d]">{clientCode}</span></div>
              <div className="text-slate-600">Username/IP: <span className="font-mono">{username}</span></div>
              <div className="text-slate-600">Mobile: 01710287818</div>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Payment Channel</span>
              <div className="font-semibold text-cyan-800">{paymentMethod}</div>
              <div className="text-slate-600">Gateway: BBN Core Billing</div>
              <div className="text-slate-600">Server: BBN-CORE (Mikrotik)</div>
              <div className="text-emerald-600 font-bold flex items-center justify-end gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>PAID IN FULL</span>
              </div>
            </div>
          </div>

          {/* Line Item Table */}
          <div className="border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#162e3d] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-2.5">SL</th>
                  <th className="p-2.5">Description / Service Item</th>
                  <th className="p-2.5">Billing Month</th>
                  <th className="p-2.5 text-right">Rate</th>
                  <th className="p-2.5 text-right">Total (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-mono">01</td>
                  <td className="p-2.5">
                    <div className="font-bold text-slate-800">Broadband Internet Subscription ({packageName})</div>
                    <div className="text-[10px] text-slate-500">Optical Fiber Dedicated Bandwidth, 24/7 BDIX 100Mbps</div>
                  </td>
                  <td className="p-2.5 font-medium">September 2026</td>
                  <td className="p-2.5 text-right font-mono">৳{amount.toFixed(2)}</td>
                  <td className="p-2.5 text-right font-bold font-mono">৳{amount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Subtotal & Totals Box */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Subtotal:</span>
                <span className="font-mono font-semibold">৳{amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">VAT (5%):</span>
                <span className="font-mono font-semibold">৳{vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Discount:</span>
                <span className="font-mono font-semibold">৳0.00</span>
              </div>
              <div className="flex justify-between py-1.5 bg-[#162e3d] text-white px-2 rounded font-bold text-sm">
                <span>Total Received:</span>
                <span className="font-mono text-cyan-300">৳{total.toFixed(2)} BDT</span>
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-8 grid grid-cols-2 gap-8 border-t border-slate-200 text-center">
            <div>
              <div className="border-b border-slate-400 w-40 mx-auto mb-1"></div>
              <span className="text-[11px] text-slate-500">Customer Signature</span>
            </div>
            <div>
              <div className="border-b border-slate-400 w-40 mx-auto mb-1 font-signature text-cyan-800 font-semibold">
                BBN Accounts
              </div>
              <span className="text-[11px] text-slate-500">Authorized Signature &amp; Stamp</span>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 pt-2">
            This is a system-generated electronic receipt created on BBN Cloud ISP Engine v8.2.4. Thank you for choosing Bhurungamari Broadband Network!
          </div>
        </div>
      </div>
    </div>
  );
};
