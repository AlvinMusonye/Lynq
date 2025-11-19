import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { FileDown, Send, HelpCircle, CheckCircle2, AlertTriangle, XCircle, Table2, Download, Filter, History, Sparkles, Trash2, Repeat2, Wand2, ShieldCheck, ArrowLeft, Upload } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function DataPreviewPage({ fileMeta, onBack }) {
  const [previewRows] = useState(200);
  const [toast, setToast] = useState(null);
  const notify = (msg) => {
    setToast(msg);
    window.clearTimeout(window.__lynq_toast_timer);
    window.__lynq_toast_timer = window.setTimeout(() => setToast(null), 2000);
  };

  // stats are computed from current rows below via useMemo

  const initialHeaders = useMemo(() => ['firstName', 'lastName', 'mobile', 'email', 'package', 'date'], []);
  const [headerCols, setHeaderCols] = useState(initialHeaders);
  const [fileName, setFileName] = useState(() => fileMeta?.name ?? 'customers.csv');
  const [editingName, setEditingName] = useState(false);
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
  const stats = useMemo(() => {
    const total = rows.length;
    const valid = rows.filter(r => r.status === 'valid').length;
    const invalid = rows.filter(r => r.status === 'invalid').length;
    const duplicates = duplicateIds.size;
    const sum = rows.reduce((acc, r) => acc + (Number((r.package ?? '0').toString().replace(/[^\d.]/g,'')) || 0), 0);
    const balanceOk = true;
    return { total, valid, invalid, duplicates, sum, balanceOk };
  }, [rows, duplicateIds]);

  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);
  const filteredRows = useMemo(() => rows.filter(r => !removedIds.has(r.id)), [rows, removedIds]);
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pageStart = (page - 1) * pageSize;
  const pageRows = filteredRows.slice(pageStart, pageStart + pageSize);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);
  const [modal, setModal] = useState(null); // {type, payload}

  function escapeCsvCell(s, delimiter) {
    const needsQuote = s.includes('"') || s.includes('\n') || s.includes('\r') || s.includes(delimiter);
    let out = s.replace(/"/g, '""');
    return needsQuote ? `"${out}"` : out;
  }
  function downloadCSV(headerCols, rows, opts) {
    const d = opts?.delimiter || ',';
    const inc = opts?.includeHeader !== false;
    const header = inc ? headerCols.join(d) + '\n' : '';
    const body = rows.map(r => headerCols.map(h => escapeCsvCell(String(r[h] ?? ''), d)).join(d)).join('\n');
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lynq_export.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  function buildHtmlTable(headerCols, rows) {
    const head = headerCols.map(h => `<th style=\"text-align:left;padding:6px;border:1px solid #ddd;background:#f6f6f6;color:#555\">${String(h)}</th>`).join('');
    const body = rows.map(r => `<tr>${headerCols.map(h => `<td style=\"padding:6px;border:1px solid #eee\">${String(r[h] ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</td>`).join('')}</tr>`).join('');
    const html = `<!doctype html><html><head><meta charset=\"utf-8\"><title>Lynq Export</title></head><body style=\"font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Arial,sans-serif;padding:16px\"><h2 style=\"margin:0 0 12px\">Lynq Export</h2><table style=\"border-collapse:collapse;width:100%;font-size:12px\">${`<thead><tr>${head}</tr></thead><tbody>${body}</tbody>`}</table></body></html>`;
    return html;
  }
  function downloadDoc(headerCols, rows) {
    const html = buildHtmlTable(headerCols, rows);
    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lynq_export.doc';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  function downloadPDF(headerCols, rows) {
    const doc = new jsPDF();
    doc.autoTable({
      head: [headerCols],
      body: rows.map(r => headerCols.map(h => String(r[h] ?? ''))),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [234, 88, 12] },
    });
    doc.save('lynq_export.pdf');
  }
  function openPrintPreview(headerCols, rows) {
    const html = buildHtmlTable(headerCols, rows);
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => { try { w.print(); } catch {} }, 300);
  }

  function EditRowModal({ headerCols, row, onCancel, onSave }) {
    const [form, setForm] = useState(() => {
      const base = {};
      headerCols.forEach(h => { base[h] = row?.[h] ?? ''; });
      return base;
    });
    const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
    return (
      <div>
        <div className="px-5 py-4 border-b bg-gray-50 font-semibold">Edit Row</div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {headerCols.map((h) => (
            <div key={h}>
              <label className="block text-xs text-gray-500 mb-1">{h}</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form[h]}
                onChange={(e)=>update(h, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
          <button onClick={()=>onSave(form)} className="px-3 py-2 rounded-lg bg-blue-600 text-white">Save</button>
        </div>
      </div>
    );
  }

  const fileInputRef = useRef(null);
  const [pendingUpload, setPendingUpload] = useState(null); // { headers, rows, meta }
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lynq_dataset');
      if (saved) {
        const data = JSON.parse(saved);
        if (Array.isArray(data?.headers) && Array.isArray(data?.rows)) {
          setHeaderCols(data.headers);
          setRows(data.rows);
          if (data.meta && fileMeta && typeof fileMeta === 'object') {
            Object.assign(fileMeta, data.meta);
          }
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const meta = (fileMeta && typeof fileMeta === 'object') ? fileMeta : {};
      localStorage.setItem('lynq_dataset', JSON.stringify({ headers: headerCols, rows, meta }));
    } catch {}
  }, [headerCols, rows]);

  const onDropFiles = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result);
      const parsed = parseCsvBasic(text);
      if (!parsed || !parsed.headers.length) { notify('Could not parse CSV'); return; }
      const newRows = parsed.rows.map((r, i) => ({ id: `row-${i+1}`, ...r, status: 'valid' }));
      setHeaderCols(parsed.headers);
      setRows(newRows);
      setPendingUpload(null);
      setFileName(file.name || 'customers.csv');
      notify('CSV uploaded (displayed)');
    };
    reader.readAsText(file);
  }, [notify]);

function trimWhitespaceRow(row) {
  const r = { ...row };
  Object.keys(r).forEach(k => {
    if (typeof r[k] === 'string') r[k] = r[k].trim();
  });
  return r;
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <img src="logo.png" alt="Lynq Logo" className="h-7 sm:h-8 w-auto" />
              <div className="h-6 w-px bg-gray-200 hidden sm:block" />
              <div className="min-w-0">
                <div className="text-sm font-semibold flex items-center gap-2">
                  {!editingName ? (
                    <button 
                      className="text-left hover:underline truncate max-w-[120px] sm:max-w-none" 
                      onClick={()=>setEditingName(true)}
                      title={fileName}
                    >
                      {fileName}
                    </button>
                  ) : (
                    <input
                      className="px-2 py-1 border rounded w-full max-w-[180px] sm:max-w-none"
                      autoFocus
                      value={fileName}
                      onChange={(e)=>setFileName(e.target.value)}
                      onBlur={()=>setEditingName(false)}
                      onKeyDown={(e)=>{ if (e.key==='Enter') e.currentTarget.blur(); if (e.key==='Escape'){ setEditingName(false);} }}
                    />
                  )}
                </div>
                <div className="text-xs text-gray-500">{headerCols.length} columns</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-end">
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 flex items-center gap-1.5 transition-all whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
                  <span className="hidden xs:inline">Upload CSV</span>
                </button>
                <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={onFilePick} />
                <button 
                  onClick={() => setModal({ type: 'download' })} 
                  className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <FileDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
                  <span className="hidden sm:inline">Download</span>
                </button>
                <button 
                  onClick={() => setModal({ type: 'export' })} 
                  className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-orange-200 hover:bg-orange-50 text-orange-700 flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <Table2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
                  <span className="hidden sm:inline">Export</span>
                </button>
                <button 
                  onClick={() => setModal({ type: 'sendApi' })} 
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-50 text-orange-700" 
                  title="Send to API"
                >
                  <Send className="w-4 h-4 sm:w-4 sm:h-4" />
                </button>
                <button 
                  onClick={() => notify('Open Help/Docs (placeholder)')} 
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-50" 
                  aria-label="Help"
                >
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                </button>
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 whitespace-nowrap">
                Parsing OK
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Prominent Upload Banner */}
      <section className="container mx-auto px-4 sm:px-6 pt-3 sm:pt-4">
        <div
          onDragOver={(e)=>{e.preventDefault(); setDragActive(true);}}
          onDragLeave={()=>setDragActive(false)}
          onDrop={onDropFiles}
          className={`rounded-xl sm:rounded-2xl border-2 ${dragActive ? 'border-blue-400 bg-blue-50/60' : 'border-dashed border-gray-300 bg-white'} p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-orange-100 text-orange-600 flex-shrink-0 flex items-center justify-center">
              <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm sm:text-base">Upload your CSV to start cleaning</div>
              <div className="text-xs sm:text-sm text-gray-600">Drag & drop a file here, or use the Upload CSV button. Client-side only.</div>
            </div>
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button 
              onClick={()=>fileInputRef.current?.click()} 
              className="px-3 sm:px-4 py-2 text-sm rounded-lg bg-orange-600 text-white hover:bg-orange-700 whitespace-nowrap text-center"
            >
              Choose File
            </button>
            <div className="text-xs text-gray-500 text-center sm:text-left">Supported: .csv</div>
          </div>
        </div>
      </section>

      {/* Top Stats */}
      <section className="container mx-auto px-6 pt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Total rows" value={stats.total} color="text-gray-900" onClick={()=>notify('Filter: All rows (placeholder)')} />
          <StatCard label={`Preview rows`} value={`${pageRows.length} / ${stats.total}`} color="text-orange-700" onClick={()=>notify('Show more rows (placeholder)')} />
          <StatCard label="Valid" value={stats.valid} color="text-green-700" onClick={()=>notify('Filter: Valid rows (placeholder)')} icon={<CheckCircle2 className="w-4 h-4"/>} />
          <StatCard label="Invalid" value={stats.invalid} color="text-red-700" onClick={()=>notify('Filter: Invalid rows (placeholder)')} icon={<XCircle className="w-4 h-4"/>} />
          <StatCard label="Duplicates" value={stats.duplicates} color="text-yellow-700" onClick={()=>notify('Filter: Duplicates (placeholder)')} icon={<AlertTriangle className="w-4 h-4"/>} />
          <StatCard label="Total package sum" value={stats.sum} color="text-indigo-700" onClick={()=>notify('Sum calculated on current view (placeholder)')} />
        </div>
      </section>

      {/* Main */}
      <main className="container mx-auto px-6 py-4 grid grid-cols-12 gap-4 items-stretch">
        {/* Left - Table */}
        <section className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
              <div className="font-semibold">Table Preview</div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">Sticky header • Scrollable</div>
                <div className="hidden sm:flex items-center gap-1 text-xs text-gray-600">
                  <span>Rows:</span>
                  <select
                    className="px-2 py-1 border border-gray-200 rounded-md bg-white"
                    value={pageSize}
                    onChange={(e)=>{ setPageSize(Number(e.target.value)); setPage(1); }}
                  >
                    {[25,50,100,200].map(sz => (
                      <option key={sz} value={sz}>{sz}</option>
                    ))}
                  </select>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs">
                  <button
                    className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
                    onClick={()=>setPage(p=>Math.max(1, p-1))}
                    disabled={page <= 1}
                  >
                    Prev
                  </button>
                  <div className="px-2 text-gray-600">{page} / {totalPages}</div>
                  <button
                    className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
                    onClick={()=>setPage(p=>Math.min(totalPages, p+1))}
                    disabled={page >= totalPages}
                  >
                    Next
                  </button>
                </div>
                <button onClick={()=>notify('Open Filters panel (placeholder)')} className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center gap-1"><Filter className="w-3.5 h-3.5"/> Filters</button>
                <button onClick={()=>notify('Open History log (placeholder)')} className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center gap-1"><History className="w-3.5 h-3.5"/> History</button>
              </div>
            </div>
            <div className="overflow-auto">
              <table className="min-w-max w-full text-sm table-auto">
                <thead className="sticky top-0 bg-white z-10 shadow-sm">
                  <tr>
                    <th className="px-3 py-2 text-left w-10"><input type="checkbox" /></th>
                    <th className="px-3 py-2 text-left text-gray-600 whitespace-nowrap">#</th>
                    {headerCols.map(col => (
                      <th key={col} className="px-3 py-2 text-left text-gray-600 whitespace-nowrap">{col}</th>
                    ))}
                    <th className="px-3 py-2 text-right text-gray-600 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((row, idx) => (
                    <tr key={row.id} className="border-t hover:bg-orange-50/40">
                      <td className="px-3 py-2"><input type="checkbox" /></td>
                      <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{pageStart + idx + 1}</td>
                      {headerCols.map(col => (
                        <td
                          key={col}
                          className={`px-3 py-2 whitespace-nowrap ${showDupHighlight && duplicateIds.has(row.id) ? 'bg-yellow-50' : ''} ${removedIds.has(row.id) ? 'opacity-50 line-through' : ''}`}
                        >
                          <span
                            title={row[col] != null ? String(row[col]) : ''}
                            className={`${row.status === 'invalid' && col === 'mobile' ? 'rounded px-1.5 py-0.5 bg-red-50 text-red-700 border border-red-200' : ''} block max-w-[200px] truncate`}
                          >
                            {row[col]}
                          </span>
                        </td>
                      ))}
                      <td className="px-3 py-2 text-right whitespace-nowrap">
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
            <RuleItem
              label="Trim Whitespaces"
              onToggle={(on)=>notify(`Rule: Trim Whitespaces ${on ? 'enabled' : 'disabled'}`)}
              onPreview={()=>handleRulePreview('trimWhitespace')}
              onApply={()=>handleRuleApply('trimWhitespace')}
            />
            <RuleItem
              label="Normalize phone to +254"
              onToggle={(on)=>notify(`Rule: Normalize phone to +254 ${on ? 'enabled' : 'disabled'}`)}
              onPreview={()=>handleRulePreview('normalizePhone')}
              onApply={()=>handleRuleApply('normalizePhone')}
            />
            <RuleItem
              label="Remove duplicates"
              onToggle={(on)=>notify(`Rule: Remove duplicates ${on ? 'enabled' : 'disabled'}`)}
              onPreview={()=>handleRulePreview('removeDuplicates')}
              onApply={()=>handleRuleApply('removeDuplicates')}
            />
          </SidebarSection>
          <SidebarSection title="Audit & History">
            <div className="text-xs text-gray-600">Auto-Clean applied • 147 rows changed</div>
          </SidebarSection>
        </aside>
      </main>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 z-20 border-t border-gray-200 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-6 py-3 flex flex-wrap gap-2 items-center">
          <button onClick={()=>setModal({ type: 'autoCleanSettings' })} className="px-3 py-2 rounded-lg bg-orange-600 text-white flex items-center gap-2"><Sparkles className="w-4 h-4"/> Auto-Clean</button>
          <button onClick={()=>openRemoveDuplicates()} className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"><Trash2 className="w-4 h-4"/> Remove Duplicates</button>
          <button onClick={()=>notify('Apply Rules (placeholder)')} className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"><Wand2 className="w-4 h-4"/> Apply Rules</button>
          <button onClick={()=>notify('Revalidate (placeholder)')} className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"><Repeat2 className="w-4 h-4"/> Revalidate</button>
          <div className="flex-1" />
          <button onClick={()=>setModal({ type: 'export' })} className="px-3 py-2 rounded-lg border border-orange-200 hover:bg-orange-50 text-orange-700 flex items-center gap-2"><Download className="w-4 h-4"/> Export CSV</button>
          <button onClick={()=>setModal({ type: 'sendApi' })} className="px-3 py-2 rounded-lg border border-orange-200 hover:bg-orange-50 text-orange-700 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Send to API</button>
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
          {modal.type === 'autoCleanSettings' && (
            <AutoCleanSettingsModal
              onCancel={()=>setModal(null)}
              onPreview={(settings)=>{
                setModal({ type: 'changePreview', payload: { title: 'Auto-Clean Preview', transform: buildTransformFromSettings(settings) } });
              }}
              onApply={(settings)=>{
                const tf = buildTransformFromSettings(settings);
                let next = rows.map(r => tf(r));
                if (settings.removeEmptyRows) {
                  next = next.filter(r => !isRowEmpty(r));
                }
                if (settings.dedupe && settings.dedupe !== 'none') {
                  next = dedupeRows(next, settings.dedupe, settings.dedupeKeep || 'first');
                }
                setRows(next);
                setModal(null);
                notify('Auto-Clean applied (simulated)');
              }}
            />
          )}
          {modal.type === 'uploadPreview' && (
            <ExportDownloadModal
              title={`Preview Upload: ${pendingUpload?.meta?.name ?? ''}`}
              rows={pendingUpload?.rows ?? []}
              headerCols={pendingUpload?.headers ?? []}
              onCancel={()=>{ setPendingUpload(null); setModal(null); }}
              onConfirm={()=>{
                setHeaderCols(pendingUpload.headers);
                setRows(pendingUpload.rows);
                if (pendingUpload.meta) {
                  (fileMeta && typeof fileMeta === 'object')
                    ? Object.assign(fileMeta, pendingUpload.meta)
                    : null;
                }
                try {
                  const meta = pendingUpload.meta || {};
                  localStorage.setItem('lynq_dataset', JSON.stringify({ headers: pendingUpload.headers, rows: pendingUpload.rows, meta }));
                } catch {}
                setPage(1);
                setModal(null);
                notify('CSV uploaded (simulated)');
              }}
            />
          )}
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
              onConfirm={()=>{
                setRows(rows.filter(r => r.id !== modal.payload.row.id));
                setModal(null);
                notify('Row deleted');
              }}
            />
          )}
          {modal.type === 'editRow' && (
            <EditRowModal
              headerCols={headerCols}
              row={modal.payload.row}
              onCancel={()=>setModal(null)}
              onSave={(updated)=>{
                setRows(rows.map(r => r.id === modal.payload.row.id ? { ...r, ...updated } : r));
                setModal(null);
                notify('Row updated');
              }}
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
          {modal.type === 'changePreview' && (
            <ChangePreviewModal
              title={modal.payload.title}
              headerCols={headerCols}
              rows={rows}
              transform={modal.payload.transform}
              onCancel={()=>setModal(null)}
              onApply={()=>{ setRows(rows.map(r => modal.payload.transform(r))); setModal(null); notify('Rule applied (simulated)'); }}
            />
          )}
          {modal.type === 'dupPreview' && (
            <ConfirmModal
              title="Preview: Duplicate Highlight"
              description={`Potential duplicates are highlighted in yellow. Use 'Remove Duplicates' to proceed.`}
              confirmLabel="Close"
              onCancel={()=>{ setShowDupHighlight(false); setModal(null); }}
              onConfirm={()=>{ setModal(null); }}
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

  function handleRulePreview(kind) {
    if (kind === 'normalizePhone') {
      setModal({ type: 'suggestionPreview', payload: { rule: 'Normalize phone to +254' } });
    } else if (kind === 'trimWhitespace') {
      setModal({ type: 'changePreview', payload: { title: 'Preview: Trim Whitespaces', transform: trimWhitespaceRow } });
    } else if (kind === 'removeDuplicates') {
      setShowDupHighlight(true);
      setModal({ type: 'dupPreview' });
    }
  }

  function handleRuleApply(kind) {
    if (kind === 'normalizePhone') {
      setRows(rows.map(r => normalizePhone(r)));
      notify('Applied: Normalize phone (simulated)');
    } else if (kind === 'trimWhitespace') {
      setRows(rows.map(r => trimWhitespaceRow(r)));
      notify('Applied: Trim whitespaces (simulated)');
    } else if (kind === 'removeDuplicates') {
      openRemoveDuplicates();
    }
  }

  async function onFilePick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseCsvBasic(text);
    if (!parsed || !parsed.headers.length) {
      notify('Could not parse CSV');
      return;
    }
    const newRows = parsed.rows.map((r, i) => ({ id: `row-${i+1}`, ...r, status: 'valid' }));
    setHeaderCols(parsed.headers);
    setRows(newRows);
    setPendingUpload(null);
    setFileName(file.name || 'customers.csv');
    notify('CSV uploaded (displayed)');
    // reset input so same file can be reselected
    e.target.value = '';
  }


  function buildTransformFromSettings(settings) {
    return function tf(row) {
      let r = { ...row };
      // Text
      if (settings.trimWhitespace) r = trimWhitespaceRow(r);
      if (settings.collapseInternalWhitespace) r = collapseInternalWhitespaceRow(r);
      if (settings.removeSpecialChars) r = removeSpecialCharsRow(r);
      if (settings.caseTransform && settings.caseTransform !== 'none') r = caseTransformRow(r, settings.caseTransform);
      // Email
      if (settings.lowercaseEmails) r = lowercaseEmail(r);
      if (settings.validateEmail) r = validateEmailRow(r);
      // Phone
      if (settings.stripNonNumericPhone) r = stripNonNumericPhone(r);
      if (settings.normalizePhone) r = normalizePhone(r);
      if (settings.enforceKenyaPrefix && typeof r.mobile === 'string' && !r.mobile.startsWith('+254')) {
        r.status = 'invalid';
      }
      // Dates
      if (settings.standardizeDate) r = standardizeDateRow(r);
      // Numeric
      if (settings.sanitizeNumeric) r = sanitizeNumericRow(r);
      if (settings.convertScientific) r = convertScientificRow(r);
      // Required columns -> mark invalid if missing
      if (settings.requiredColumns) {
        const req = settings.requiredColumns.split(',').map(s=>s.trim()).filter(Boolean);
        if (req.some(k => (r[k] ?? '') === '')) r.status = 'invalid';
      }
      return r;
    }
  }

  // UI helper components (hoisted in function scope)
  function StatCard({ label, value, color, onClick, icon }) {
    return (
      <button onClick={onClick} className="text-left group bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">{icon}{label}</div>
        <div className={`text-xl font-bold ${color}`}>{value}</div>
        <div className="mt-2 h-1.5 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full group-hover:from-orange-100 group-hover:to-orange-200" />
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
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">{confidence}</span>
          <button onClick={onPreview} className="text-xs px-2 py-1 rounded border border-orange-200 hover:bg-orange-50">Preview</button>
          <button onClick={onApply} className="text-xs px-2 py-1 rounded bg-orange-600 text-white hover:bg-orange-700">Apply</button>
        </div>
      </div>
    );
  }

  function RuleItem({ label, onToggle, onPreview, onApply }) {
    const [on, setOn] = useState(true);
    return (
      <div className="p-2 border border-gray-200 rounded-xl flex items-center justify-between gap-2">
        <button onClick={() => { const next = !on; setOn(next); onToggle && onToggle(next); }} className={`flex-1 text-left text-sm px-3 py-2 rounded-lg border ${on ? 'border-orange-200 bg-orange-50 text-orange-700' : 'border-gray-200 hover:bg-gray-50'}`}>
          {label}
        </button>
        <div className="flex items-center gap-2">
          <button onClick={onPreview} className="text-xs px-2 py-1 rounded border border-orange-200 hover:bg-orange-50">Preview</button>
          <button onClick={onApply} className="text-xs px-2 py-1 rounded bg-orange-600 text-white hover:bg-orange-700">Apply</button>
        </div>
      </div>
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
    const [format, setFormat] = useState('csv');
    const [delimiter, setDelimiter] = useState(',');
    const [includeHeader, setIncludeHeader] = useState(true);
    return (
      <div>
        <div className="px-5 py-4 border-b bg-gray-50 font-semibold">{title}</div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Format</label>
              <select className="w-full border rounded-lg px-3 py-2" value={format} onChange={(e)=>setFormat(e.target.value)}>
                <option value="csv">CSV (.csv)</option>
                <option value="doc">Word (.doc)</option>
                <option value="pdf">PDF (.pdf)</option>
                <option value="print">Print / PDF</option>
              </select>
            </div>
            {format === 'csv' && (
              <>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Delimiter</label>
                  <select className="w-full border rounded-lg px-3 py-2" value={delimiter} onChange={(e)=>setDelimiter(e.target.value)}>
                    <option value=",">Comma (,)</option>
                    <option value=";">Semicolon (;)</option>
                    <option value="\t">Tab</option>
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <label className="text-xs text-gray-500 mb-1 block">Include header</label>
                  <input type="checkbox" className="h-4 w-4" checked={includeHeader} onChange={(e)=>setIncludeHeader(e.target.checked)} />
                </div>
              </>
            )}
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
        <div className="px-5 py-3 border-t flex flex-wrap justify-between gap-2">
          <button onClick={onCancel} className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openPrintPreview(headerCols, rows)}
              className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              Print
            </button>
            <button
              onClick={() => {
                if (format === 'csv') {
                  downloadCSV(headerCols, rows, { delimiter, includeHeader });
                } else if (format === 'doc') {
                  downloadDoc(headerCols, rows);
                } else if (format === 'pdf') {
                  downloadPDF(headerCols, rows);
                }
                onConfirm && onConfirm();
              }}
              className="px-3 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700"
            >
              Download
            </button>
          </div>
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
          <button onClick={onConfirm} className={`px-3 py-2 rounded-lg ${tone === 'danger' ? 'bg-red-600' : tone === 'warning' ? 'bg-yellow-600' : 'bg-orange-600'} text-white`}>{confirmLabel}</button>
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
          <button onClick={onApply} className="px-3 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700">Apply</button>
        </div>
      </div>
    );
  }

  function AutoCleanSettingsModal({ onCancel, onPreview, onApply }) {
    const [settings, setSettings] = useState({
      // Text
      trimWhitespace: true,
      collapseInternalWhitespace: true,
      removeSpecialChars: false,
      caseTransform: 'none', // none | lower | upper | title
      // Phone
      normalizePhone: true,
      stripNonNumericPhone: true,
      enforceKenyaPrefix: true,
      // Email
      lowercaseEmails: true,
      validateEmail: true,
      // Dates
      standardizeDate: true,
      // Numeric
      sanitizeNumeric: true,
      convertScientific: true,
      // Rows
      removeEmptyRows: true,
      requiredColumns: 'mobile,email',
      // Dedupe
      dedupe: 'normalized', // none | exact | normalized
      dedupeKeep: 'first', // first | last | highestPackage
    });

    const set = (k, v) => setSettings(prev => ({ ...prev, [k]: v }));

    return (
      <div>
        <div className="px-5 py-4 border-b bg-gray-50 font-semibold">Auto-Clean Settings</div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <div className="font-semibold text-gray-700">Text</div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={settings.trimWhitespace} onChange={e=>set('trimWhitespace', e.target.checked)} /> Trim whitespace</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={settings.collapseInternalWhitespace} onChange={e=>set('collapseInternalWhitespace', e.target.checked)} /> Collapse spaces</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={settings.removeSpecialChars} onChange={e=>set('removeSpecialChars', e.target.checked)} /> Remove special chars</label>
            <div>
              <div className="text-xs text-gray-500 mb-1">Case</div>
              <select className="w-full border rounded-lg px-3 py-2" value={settings.caseTransform} onChange={e=>set('caseTransform', e.target.value)}>
                <option value="none">None</option>
                <option value="lower">lowercase</option>
                <option value="upper">UPPERCASE</option>
                <option value="title">Title Case</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-semibold text-gray-700">Phone</div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={settings.stripNonNumericPhone} onChange={e=>set('stripNonNumericPhone', e.target.checked)} /> Strip non-numeric</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={settings.normalizePhone} onChange={e=>set('normalizePhone', e.target.checked)} /> Normalize to +2547XXXXXXXX</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={settings.enforceKenyaPrefix} onChange={e=>set('enforceKenyaPrefix', e.target.checked)} /> Enforce +254 prefix</label>
          </div>

          <div className="space-y-3">
            <div className="font-semibold text-gray-700">Email</div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={settings.lowercaseEmails} onChange={e=>set('lowercaseEmails', e.target.checked)} /> Lowercase emails</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={settings.validateEmail} onChange={e=>set('validateEmail', e.target.checked)} /> Validate email format</label>
          </div>

          <div className="space-y-3">
            <div className="font-semibold text-gray-700">Dates & Numeric</div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={settings.standardizeDate} onChange={e=>set('standardizeDate', e.target.checked)} /> Standardize dates (YYYY-MM-DD)</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={settings.sanitizeNumeric} onChange={e=>set('sanitizeNumeric', e.target.checked)} /> Sanitize numbers</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={settings.convertScientific} onChange={e=>set('convertScientific', e.target.checked)} /> Convert scientific notation</label>
          </div>

          <div className="space-y-3">
            <div className="font-semibold text-gray-700">Rows</div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={settings.removeEmptyRows} onChange={e=>set('removeEmptyRows', e.target.checked)} /> Remove empty rows</label>
            <div>
              <div className="text-xs text-gray-500 mb-1">Required columns (comma-separated)</div>
              <input className="w-full border rounded-lg px-3 py-2" value={settings.requiredColumns} onChange={e=>set('requiredColumns', e.target.value)} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-semibold text-gray-700">Deduplication</div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Strategy</div>
              <select className="w-full border rounded-lg px-3 py-2" value={settings.dedupe} onChange={e=>set('dedupe', e.target.value)}>
                <option value="none">None</option>
                <option value="exact">Exact rows</option>
                <option value="normalized">Normalized phone</option>
              </select>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Keep</div>
              <select className="w-full border rounded-lg px-3 py-2" value={settings.dedupeKeep} onChange={e=>set('dedupeKeep', e.target.value)}>
                <option value="first">First</option>
                <option value="last">Last</option>
                <option value="highestPackage">Highest package</option>
              </select>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 border-t flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
          <button onClick={() => onPreview(settings)} className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Preview</button>
          <button onClick={() => onApply(settings)} className="px-3 py-2 rounded-lg bg-blue-600 text-white">Apply</button>
        </div>
      </div>
    );
  }

// Helpers used by Auto-Clean and Upload parsing
function isRowEmpty(row) {
  const vals = Object.values(row ?? {});
  if (vals.length === 0) return true;
  return vals.every(v => (typeof v === 'string' ? v.trim() : v) === '' || v == null);
}

function normalizePhone(row) {
  const r = { ...row };
  if (typeof r.mobile === 'string') {
    let v = r.mobile.trim();
    // Accept formats: 07XXXXXXXX, 7XXXXXXXX, 2547XXXXXXXX, +2547XXXXXXXX
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
  }
  return r;
}

function stripNonNumericPhone(row) {
  const r = { ...row };
  if (typeof r.mobile === 'string') {
    r.mobile = r.mobile.replace(/\D+/g, '');
  }
  return r;
}

function lowercaseEmail(row) {
  const r = { ...row };
  if (typeof r.email === 'string') r.email = r.email.trim().toLowerCase();
  return r;
}

function validateEmailRow(row) {
  const r = { ...row };
  if (typeof r.email === 'string') {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email.trim());
    if (!ok) r.status = 'invalid';
  }
  return r;
}

function standardizeDateRow(row) {
  const r = { ...row };
  if (typeof r.date === 'string') {
    let v = r.date.trim();
    // Try DD/MM/YYYY or MM/DD/YYYY
    const m1 = v.match(/^(\d{1,2})[\/](\d{1,2})[\/](\d{4})$/);
    if (m1) {
      const [_, a, b, y] = m1;
      const dd = parseInt(a,10), mm = parseInt(b,10);
      const dayFirst = dd > 12 || (dd <= 12 && mm <= 12 ? dd >= mm : true);
      const day = dayFirst ? dd : mm;
      const mon = dayFirst ? mm : dd;
      v = `${y}-${String(mon).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    } else {
      const m2 = v.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
      if (m2) {
        const [_, y, m, d] = m2;
        v = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      }
    }
    r.date = v;
  }
  return r;
}

function sanitizeNumericRow(row) {
  const r = { ...row };
  Object.keys(r).forEach(k => {
    const val = r[k];
    if (typeof val === 'string') {
      // Remove spaces, currency, and thousands separators
      if (/[0-9]/.test(val)) {
        r[k] = val.replace(/[\s,€$]/g, '');
      }
    }
  });
  return r;
}

function convertScientificRow(row) {
  const r = { ...row };
  Object.keys(r).forEach(k => {
    const val = r[k];
    if (typeof val === 'string' && /\d+(?:\.\d+)?e[+\-]?\d+/i.test(val)) {
      const num = Number(val);
      if (!Number.isNaN(num)) r[k] = String(Math.trunc(num));
    }
  });
  return r;
}

function collapseInternalWhitespaceRow(row) {
  const r = { ...row };
  Object.keys(r).forEach(k => {
    if (typeof r[k] === 'string') r[k] = r[k].replace(/\s+/g, ' ');
  });
  return r;
}

function removeSpecialCharsRow(row) {
  const r = { ...row };
  Object.keys(r).forEach(k => {
    if (typeof r[k] === 'string') r[k] = r[k].replace(/[^\w\s@+.-]/g, '');
  });
  return r;
}

function caseTransformRow(row, mode) {
  const r = { ...row };
  Object.keys(r).forEach(k => {
    if (typeof r[k] === 'string') {
      const s = r[k];
      if (mode === 'lower') r[k] = s.toLowerCase();
      else if (mode === 'upper') r[k] = s.toUpperCase();
      else if (mode === 'title') r[k] = s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    }
  });
  return r;
}

function dedupeRows(rows, mode, keep) {
  if (mode === 'none') return rows;
  const keyFn = (r) => {
    if (mode === 'exact') return JSON.stringify(r);
    const digits = (r.mobile ?? '').toString().replace(/\D+/g, '');
    return digits.startsWith('2547') ? digits : digits.startsWith('7') ? `254${digits}` : digits;
  };
  const map = new Map();
  rows.forEach((r, idx) => {
    const key = keyFn(r);
    const entry = map.get(key);
    if (!entry) {
      map.set(key, { r, idx });
    } else {
      if (keep === 'last') map.set(key, { r, idx });
      if (keep === 'highestPackage') {
        const curVal = Number((entry.r.package ?? '0').toString().replace(/[^\d.]/g,'')) || 0;
        const nextVal = Number((r.package ?? '0').toString().replace(/[^\d.]/g,'')) || 0;
        if (nextVal > curVal) map.set(key, { r, idx });
      }
    }
  });
  // keep === 'first' means do nothing
  return Array.from(map.values()).map(v => v.r);
}

// Simple CSV parsing for demo
function parseCsvBasic(text) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n').filter(l => l.length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = splitCsvLine(lines[0]);
  const rows = lines.slice(1).map(line => {
    const cells = splitCsvLine(line);
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = cells[idx] ?? ''; });
    return obj;
  });
  return { headers, rows };
}

function splitCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i+1] === '"') { cur += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map(s => s.trim());
}

}
