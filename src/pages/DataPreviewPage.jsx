import React, { useMemo, useState } from 'react';
import { FileDown, Send, HelpCircle, CheckCircle2, AlertTriangle, XCircle, Table2, Download, Filter, History, Sparkles, Trash2, Repeat2, Wand2, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function DataPreviewPage({ fileMeta, onBack }) {
  const [previewRows] = useState(200);
  const [toast, setToast] = useState(null);
  const notify = (msg) => {
    setToast(msg);
    window.clearTimeout(window.__lynq_toast_timer);
    window.__lynq_toast_timer = window.setTimeout(() => setToast(null), 2000);
  };
  const [stats] = useState({
    total: 6000,
    valid: 5700,
    invalid: 300,
    duplicates: 42,
    sum: 123456,
    balanceOk: true,
  });

  const headerCols = useMemo(() => ['firstName', 'lastName', 'mobile', 'email', 'package', 'date'], []);
  const sampleRows = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
    id: `row-${i+1}`,
    firstName: `John ${i+1}`,
    lastName: `Doe`,
    mobile: i % 7 === 0 ? '2.55E+11' : `07${(10000000 + i).toString()}`,
    email: `user${i+1}@example.com`,
    package: (i % 5) * 512,
    date: '2024-11-01',
    status: i % 9 === 0 ? 'invalid' : 'valid',
  })), []);
  const [rows, setRows] = useState(sampleRows);
  const duplicateIds = useMemo(() => new Set(rows.filter((_, idx) => idx % 4 === 0).map(r => r.id)), [rows]);
  const [showDupHighlight, setShowDupHighlight] = useState(false);
  const [removedIds, setRemovedIds] = useState(new Set());
  const [modal, setModal] = useState(null); // {type, payload}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Lynq</div>
            <div className="h-6 w-px bg-gray-200" />
            <div>
              <div className="text-sm font-semibold">{fileMeta?.name ?? 'customers.csv'}</div>
              <div className="text-xs text-gray-500">{fileMeta?.size ?? '1.2MB'} • {fileMeta?.uploadedAt ?? 'just now'} • {headerCols.length} columns</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setModal({ type: 'download' })} className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              <FileDown className="w-4 h-4" /> Download raw
            </button>
            <button onClick={() => setModal({ type: 'export' })} className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              <Table2 className="w-4 h-4" /> Export cleaned
            </button>
            <button onClick={() => setModal({ type: 'sendApi' })} className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              <Send className="w-4 h-4" /> Send to API
            </button>
            <button onClick={() => notify('Open Help/Docs (placeholder)')} className="p-2 rounded-lg hover:bg-gray-50" aria-label="Help">
              <HelpCircle className="w-5 h-5 text-gray-500" />
            </button>
            <div className="ml-2 text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">Parsing OK</div>
          </div>
        </div>
      </header>

      {/* Top Stats */}
      <section className="container mx-auto px-6 pt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Total rows" value={stats.total} color="text-gray-900" onClick={()=>notify('Filter: All rows (placeholder)')} />
          <StatCard label={`Preview rows`} value={`${previewRows} / ${stats.total}`} color="text-blue-700" onClick={()=>notify('Show more rows (placeholder)')} />
          <StatCard label="Valid" value={stats.valid} color="text-green-700" onClick={()=>notify('Filter: Valid rows (placeholder)')} icon={<CheckCircle2 className="w-4 h-4"/>} />
          <StatCard label="Invalid" value={stats.invalid} color="text-red-700" onClick={()=>notify('Filter: Invalid rows (placeholder)')} icon={<XCircle className="w-4 h-4"/>} />
          <StatCard label="Duplicates" value={stats.duplicates} color="text-yellow-700" onClick={()=>notify('Filter: Duplicates (placeholder)')} icon={<AlertTriangle className="w-4 h-4"/>} />
          <StatCard label="Total package sum" value={stats.sum} color="text-indigo-700" onClick={()=>notify('Sum calculated on current view (placeholder)')} />
        </div>
      </section>

      {/* Main */}
      <main className="container mx-auto px-6 py-4 grid grid-cols-12 gap-4">
        {/* Left - Table */}
        <section className="col-span-12 lg:col-span-8 xl:col-span-9">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
              <div className="font-semibold">Table Preview</div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">Sticky header • Virtualized</div>
                <button onClick={()=>notify('Open Filters panel (placeholder)')} className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center gap-1"><Filter className="w-3.5 h-3.5"/> Filters</button>
                <button onClick={()=>notify('Open History log (placeholder)')} className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center gap-1"><History className="w-3.5 h-3.5"/> History</button>
              </div>
            </div>
            <div className="overflow-auto max-h-[62vh]">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-white z-10 shadow-sm">
                  <tr>
                    <th className="px-3 py-2 text-left w-10"><input type="checkbox" /></th>
                    <th className="px-3 py-2 text-left text-gray-600">#</th>
                    {headerCols.map(col => (
                      <th key={col} className="px-3 py-2 text-left text-gray-600">{col}</th>
                    ))}
                    <th className="px-3 py-2 text-right text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.filter(r => !removedIds.has(r.id)).slice(0, previewRows).map((row, idx) => (
                    <tr key={row.id} className="border-t hover:bg-blue-50/40">
                      <td className="px-3 py-2"><input type="checkbox" /></td>
                      <td className="px-3 py-2 text-gray-500">{idx + 1}</td>
                      {headerCols.map(col => (
                        <td key={col} className={`px-3 py-2 ${showDupHighlight && duplicateIds.has(row.id) ? 'bg-yellow-50' : ''} ${removedIds.has(row.id) ? 'opacity-50 line-through' : ''}`}>
                          <span className={row.status === 'invalid' && col === 'mobile' ? 'rounded px-1.5 py-0.5 bg-red-50 text-red-700 border border-red-200' : ''}>
                            {row[col]}
                          </span>
                        </td>
                      ))}
                      <td className="px-3 py-2 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button onClick={()=>setModal({ type: 'editRow', payload: { row } })} className="px-2 py-1 text-xs rounded border hover:bg-gray-50">Edit</button>
                          <button onClick={()=>setModal({ type: 'deleteRow', payload: { row } })} className="px-2 py-1 text-xs rounded border hover:bg-gray-50">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Right - Sidebar */}
        <aside className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-4">
          <SidebarSection title="Issues Found">
            <IssueRow onClick={()=>notify('Filter: Invalid phone numbers (placeholder)')} label="Invalid phone numbers" count={123} />
            <IssueRow onClick={()=>notify('Filter: Missing required fields (placeholder)')} label="Missing required fields" count={12} />
            <IssueRow onClick={()=>notify('Filter: Malformed numeric values (placeholder)')} label="Malformed numeric values" count={7} />
            <IssueRow onClick={()=>notify('Filter: Duplicate phone numbers (placeholder)')} label="Duplicate phone numbers" count={42} />
            <IssueRow onClick={()=>notify('Filter: Unknown columns (placeholder)')} label="Unknown columns" count={2} />
          </SidebarSection>
          <SidebarSection title="Suggested Fixes">
            <Suggestion onPreview={()=>setModal({ type: 'suggestionPreview', payload: { rule: 'Normalize phone to +254' } })} onApply={()=>handleApplyRule('normalizePhone')} label="Normalize phone to +254" confidence="high" />
            <Suggestion onPreview={()=>setModal({ type: 'suggestionPreview', payload: { rule: 'Convert scientific notation' } })} onApply={()=>notify('Applied: Convert scientific notation (simulated)')} label="Convert scientific notation" confidence="medium" />
            <Suggestion onPreview={()=>setModal({ type: 'suggestionPreview', payload: { rule: 'Trim whitespaces' } })} onApply={()=>notify('Applied: Trim whitespaces (simulated)')} label="Trim whitespaces" confidence="high" />
          </SidebarSection>
          <SidebarSection title="Column Stats">
            <div className="text-xs text-gray-600 space-y-1">
              <div>Column: mobile • Type: Phone</div>
              <div>Nulls: 12 • Unique: 5,612</div>
              <div>Top values: +254712..., +254711...</div>
            </div>
          </SidebarSection>
          <SidebarSection title="Rules / Presets">
            <RuleToggle onToggle={(on)=>notify(`Rule: Trim Whitespaces ${on ? 'enabled' : 'disabled'} (placeholder)`)} label="Trim Whitespaces" />
            <RuleToggle onToggle={(on)=>notify(`Rule: Normalize phone to +254 ${on ? 'enabled' : 'disabled'} (placeholder)`)} label="Normalize phone to +254" />
            <RuleToggle onToggle={(on)=>notify(`Rule: Remove duplicates ${on ? 'enabled' : 'disabled'} (placeholder)`)} label="Remove duplicates" />
          </SidebarSection>
          <SidebarSection title="Audit & History">
            <div className="text-xs text-gray-600">Auto-Clean applied • 147 rows changed</div>
          </SidebarSection>
        </aside>
      </main>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 z-20 border-t border-gray-200 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-6 py-3 flex flex-wrap gap-2 items-center">
          <button onClick={()=>openAutoCleanPreview()} className="px-3 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2"><Sparkles className="w-4 h-4"/> Auto-Clean</button>
          <button onClick={()=>openRemoveDuplicates()} className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"><Trash2 className="w-4 h-4"/> Remove Duplicates</button>
          <button onClick={()=>notify('Apply Rules (placeholder)')} className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"><Wand2 className="w-4 h-4"/> Apply Rules</button>
          <button onClick={()=>notify('Revalidate (placeholder)')} className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"><Repeat2 className="w-4 h-4"/> Revalidate</button>
          <div className="flex-1" />
          <button onClick={()=>setModal({ type: 'export' })} className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"><Download className="w-4 h-4"/> Export CSV</button>
          <button onClick={()=>setModal({ type: 'sendApi' })} className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Send to API</button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div role="status" aria-live="polite" className="fixed bottom-20 right-6 z-30">
          <div className="px-4 py-2 rounded-xl border border-gray-200 bg-white shadow-sm text-sm text-gray-800">
            {toast}
          </div>
        </div>
      )}

      {/* Modals */}
      {modal && (
        <Modal onClose={()=>setModal(null)}>
          {modal.type === 'export' && (
            <ExportDownloadModal
              title="Export Cleaned CSV"
              rows={rows}
              headerCols={headerCols}
              onCancel={()=>setModal(null)}
              onConfirm={()=>{ setModal(null); notify('Exported CSV (simulated)'); }}
            />
          )}
          {modal.type === 'download' && (
            <ExportDownloadModal
              title="Download Raw CSV"
              rows={sampleRows}
              headerCols={headerCols}
              onCancel={()=>setModal(null)}
              onConfirm={()=>{ setModal(null); notify('Downloaded raw CSV (simulated)'); }}
            />
          )}
          {modal.type === 'deleteRow' && (
            <ConfirmModal
              title="Delete Row"
              description={`Are you sure you want to delete ${modal.payload.row.firstName}'s row?`}
              confirmLabel="Delete"
              tone="danger"
              onCancel={()=>setModal(null)}
              onConfirm={()=>{ setRemovedIds(new Set([...removedIds, modal.payload.row.id])); setModal(null); notify('Row deleted (simulated)'); }}
            />
          )}
          {modal.type === 'editRow' && (
            <ConfirmModal
              title="Edit Row"
              description={`Inline editing will be available. For now, this is a visual placeholder for editing ${modal.payload.row.firstName}.`}
              confirmLabel="Close"
              onCancel={()=>setModal(null)}
              onConfirm={()=>setModal(null)}
            />
          )}
          {modal.type === 'removeDuplicates' && (
            <ConfirmModal
              title="Remove Duplicates"
              description={`Found ${duplicateIds.size} potential duplicates. Proceed to remove them?`}
              confirmLabel="Remove"
              tone="warning"
              onCancel={()=>{ setShowDupHighlight(false); setModal(null); }}
              onConfirm={()=>{ setRemovedIds(new Set([...removedIds, ...Array.from(duplicateIds)])); setModal(null); notify('Duplicates removed (simulated)'); }}
            />
          )}
          {modal.type === 'autoClean' && (
            <ChangePreviewModal
              title="Auto-Clean Preview"
              headerCols={headerCols}
              rows={rows}
              transform={normalizePhone}
              onCancel={()=>setModal(null)}
              onApply={()=>{ setRows(rows.map(r => normalizePhone(r))); setModal(null); notify('Auto-Clean applied (simulated)'); }}
            />
          )}
          {modal.type === 'suggestionPreview' && (
            <ChangePreviewModal
              title={`Preview: ${modal.payload.rule}`}
              headerCols={headerCols}
              rows={rows}
              transform={modal.payload.rule === 'Normalize phone to +254' ? normalizePhone : (r)=>r}
              onCancel={()=>setModal(null)}
              onApply={()=>{ if (modal.payload.rule === 'Normalize phone to +254') setRows(rows.map(r => normalizePhone(r))); setModal(null); notify('Suggestion applied (simulated)'); }}
            />
          )}
          {modal.type === 'sendApi' && (
            <ConfirmModal
              title="Send to API"
              description="This would send the current cleaned dataset to the configured API."
              confirmLabel="Send"
              onCancel={()=>setModal(null)}
              onConfirm={()=>{ setModal(null); notify('Sent to API (simulated)'); }}
            />
          )}
        </Modal>
      )}
    </div>
  );

  function openAutoCleanPreview() {
    setModal({ type: 'autoClean' });
  }

  function openRemoveDuplicates() {
    setShowDupHighlight(true);
    setModal({ type: 'removeDuplicates' });
  }

  function handleApplyRule(kind) {
    if (kind === 'normalizePhone') {
      setModal({ type: 'suggestionPreview', payload: { rule: 'Normalize phone to +254' } });
    }
  }
}

function StatCard({ label, value, color, onClick, icon }) {
  return (
    <button onClick={onClick} className="text-left group bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">{icon}{label}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="mt-2 h-1.5 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full group-hover:from-blue-100 group-hover:to-blue-200" />
    </button>
  );
}

function SidebarSection({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200">
      <div className="px-4 py-2.5 border-b font-semibold text-sm bg-gray-50">{title}</div>
      <div className="p-3 space-y-2">{children}</div>
    </div>
  );
}

function IssueRow({ label, count, onClick }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-gray-700">{label}</div>
      <button onClick={onClick} className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">{count}</button>
    </div>
  );
}

function Suggestion({ label, confidence, onPreview, onApply }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-gray-700">{label}</div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{confidence}</span>
        <button onClick={onPreview} className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">Preview</button>
        <button onClick={onApply} className="text-xs px-2 py-1 rounded bg-blue-600 text-white">Apply</button>
      </div>
    </div>
  );
}

function RuleToggle({ label, onToggle }) {
  const [on, setOn] = useState(true);
  return (
    <button onClick={() => { const next = !on; setOn(next); onToggle && onToggle(next); }} className={`w-full text-left text-sm px-3 py-2 rounded-lg border ${on ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}>
      {label}
    </button>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/10" onClick={onClose} />
      <div className="relative w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function ExportDownloadModal({ title, rows, headerCols, onCancel, onConfirm }) {
  return (
    <div>
      <div className="px-5 py-4 border-b bg-gray-50 font-semibold">{title}</div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Delimiter</label>
            <select className="w-full border rounded-lg px-3 py-2">
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="\t">Tab</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Encoding</label>
            <select className="w-full border rounded-lg px-3 py-2">
              <option>UTF-8</option>
              <option>ISO-8859-1</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Include header</label>
            <input type="checkbox" defaultChecked className="align-middle" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Print layout</label>
            <select className="w-full border rounded-lg px-3 py-2">
              <option>Compact</option>
              <option>Full width</option>
            </select>
          </div>
        </div>
        <div className="text-xs text-gray-500">Preview (first 5 rows)</div>
        <div className="overflow-auto border rounded-lg">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                {headerCols.map(h => <th key={h} className="px-2 py-1 text-left text-gray-600">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0,5).map(r => (
                <tr key={r.id} className="border-t">
                  {headerCols.map(h => <td key={h} className="px-2 py-1">{r[h]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="px-5 py-3 border-t flex justify-end gap-2">
        <button onClick={onCancel} className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
        <button onClick={() => { onConfirm(); }} className="px-3 py-2 rounded-lg bg-blue-600 text-white">Proceed</button>
      </div>
    </div>
  );
}

function ConfirmModal({ title, description, confirmLabel = 'Confirm', tone = 'primary', onCancel, onConfirm }) {
  return (
    <div>
      <div className="px-5 py-4 border-b bg-gray-50 font-semibold">{title}</div>
      <div className="p-5 text-sm text-gray-700">{description}</div>
      <div className="px-5 py-3 border-t flex justify-end gap-2">
        <button onClick={onCancel} className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
        <button onClick={onConfirm} className={`px-3 py-2 rounded-lg ${tone === 'danger' ? 'bg-red-600' : tone === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'} text-white`}>{confirmLabel}</button>
      </div>
    </div>
  );
}

function ChangePreviewModal({ title, headerCols, rows, transform, onCancel, onApply }) {
  const before = rows.slice(0,5);
  const after = before.map(r => transform(r));
  return (
    <div>
      <div className="px-5 py-4 border-b bg-gray-50 font-semibold">{title}</div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">Before</div>
          <div className="overflow-auto border rounded-lg">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  {headerCols.map(h => <th key={h} className="px-2 py-1 text-left text-gray-600">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {before.map(r => (
                  <tr key={r.id} className="border-t">
                    {headerCols.map(h => <td key={h} className="px-2 py-1">{r[h]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">After</div>
          <div className="overflow-auto border rounded-lg">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  {headerCols.map(h => <th key={h} className="px-2 py-1 text-left text-gray-600">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {after.map(r => (
                  <tr key={r.id} className="border-t">
                    {headerCols.map(h => <td key={h} className="px-2 py-1">{r[h]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="px-5 py-3 border-t flex justify-end gap-2">
        <button onClick={onCancel} className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
        <button onClick={onApply} className="px-3 py-2 rounded-lg bg-blue-600 text-white">Apply</button>
      </div>
    </div>
  );
}

function normalizePhone(row) {
  const r = { ...row };
  if (typeof r.mobile === 'string') {
    let v = r.mobile.trim();
    if (/^\+?2547\d{8}$/.test(v)) {
      v = v.startsWith('+') ? v : `+${v}`;
    } else if (/^07\d{8}$/.test(v)) {
      v = `+2547${v.slice(2)}`;
    } else if (/^7\d{8}$/.test(v)) {
      v = `+254${v}`;
    } else if (/^2547\d{8}$/.test(v)) {
      v = `+${v}`;
    }
    r.mobile = v;
    r.status = 'valid';
  }
  return r;
}
