const SUPABASE_URL = "";
const SUPABASE_ANON_KEY = "";

const CRM_STATUSES = [
  "new",
  "message_sent",
  "interested",
  "price_sent",
  "meeting",
  "customer",
  "not_interested",
  "blocked",
];

const STATUS_LABELS = {
  new: "Yeni",
  message_sent: "Mesaj göndərildi",
  interested: "Maraqlanır",
  price_sent: "Qiymət göndərildi",
  meeting: "Görüş",
  customer: "Müştəri",
  not_interested: "Maraqlanmır",
  blocked: "Bloklanıb",
};

const DEFAULT_WHATSAPP_MESSAGE =
  "Salam. Biznesiniz üçün menyu, xidmətlər, əlaqə və WhatsApp sifariş bölməsi olan sadə və müasir veb sayt hazırlayıram. İstəsəniz nümunə göndərə bilərəm.";

let supabaseClient = null;
let categories = [];
let leads = [];
let filteredLeads = [];
let selectedLeadIds = new Set();
let currentMode = "user";

const $ = (id) => document.getElementById(id);

function crmReady(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

function showToast(message, type = "success") {
  const container = $("toastContainer") || document.body.appendChild(Object.assign(document.createElement("div"), { id: "toastContainer" }));
  container.className = "fixed top-4 right-4 z-[100] space-y-2";
  const toast = document.createElement("div");
  const palette = type === "error" ? "bg-red-600" : type === "warning" ? "bg-amber-600" : "bg-emerald-600";
  toast.className = `${palette} text-white px-4 py-3 rounded-xl shadow-lg max-w-sm animate-fade-in`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3600);
}

function setLoading(isLoading, text = "Yüklənir...") {
  const overlay = $("loadingOverlay");
  if (!overlay) return;
  overlay.classList.toggle("hidden", !isLoading);
  const label = $("loadingText");
  if (label) label.textContent = text;
}

function normalizePhone(value) {
  if (!value) return "";
  let phone = String(value).replace(/[^\d+]/g, "");
  if (phone.startsWith("+")) phone = phone.slice(1);
  if (phone.startsWith("0") && phone.length === 10) phone = `994${phone.slice(1)}`;
  return phone;
}

function normalizeLeadPayload(raw) {
  const phone = normalizePhone(raw.phone);
  const whatsapp = normalizePhone(raw.whatsapp_phone) || phone;
  const website = (raw.website || "").trim();
  return {
    business_name: (raw.business_name || "").trim(),
    category_id: raw.category_id || null,
    city: (raw.city || "").trim(),
    district: (raw.district || "").trim(),
    address: (raw.address || "").trim(),
    phone,
    whatsapp_phone: whatsapp,
    website,
    instagram: (raw.instagram || "").trim(),
    google_maps_url: (raw.google_maps_url || "").trim(),
    source: (raw.source || "").trim(),
    rating: raw.rating === "" || raw.rating == null ? null : Number(raw.rating),
    review_count: raw.review_count === "" || raw.review_count == null ? null : Number(raw.review_count),
    has_website: Boolean(website),
    status: raw.status || "new",
    notes: (raw.notes || "").trim(),
    last_contacted_at: raw.last_contacted_at || null,
  };
}

async function loadSupabaseScript() {
  if (window.supabase) return;
  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function initSupabase() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    showToast("Supabase URL və anon key backend_logic.js faylında doldurulmalıdır.", "warning");
    return null;
  }
  await loadSupabaseScript();
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseClient;
}

async function fetchCategories() {
  if (!supabaseClient) return [];
  const { data, error } = await supabaseClient.from("lead_categories").select("id,name,slug,created_at").order("name");
  if (error) throw error;
  categories = data || [];
  return categories;
}

async function fetchLeads() {
  if (!supabaseClient) return [];
  const { data, error } = await supabaseClient
    .from("leads")
    .select("*, lead_categories(id,name,slug)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  leads = data || [];
  applyFilters();
  return leads;
}

async function createLead(raw) {
  const payload = normalizeLeadPayload(raw);
  if (!payload.business_name) throw new Error("Biznes adı vacibdir");
  await preventDuplicate(payload);
  const { data, error } = await supabaseClient.from("leads").insert(payload).select("*, lead_categories(id,name,slug)").single();
  if (error) throw error;
  await addInteraction(data.id, "note", "Lead yaradıldı");
  showToast("Lead əlavə edildi");
  await fetchLeads();
  return data;
}

async function updateLead(id, raw) {
  const oldLead = leads.find((lead) => lead.id === id);
  const payload = normalizeLeadPayload(raw);
  await preventDuplicate(payload, id);
  payload.updated_at = new Date().toISOString();
  const { data, error } = await supabaseClient.from("leads").update(payload).eq("id", id).select("*, lead_categories(id,name,slug)").single();
  if (error) throw error;
  if (oldLead && oldLead.status !== payload.status) await addInteraction(id, "status", `${STATUS_LABELS[oldLead.status] || oldLead.status} → ${STATUS_LABELS[payload.status] || payload.status}`);
  if (payload.notes && oldLead?.notes !== payload.notes) await addInteraction(id, "note", payload.notes);
  showToast("Lead yeniləndi");
  await fetchLeads();
  return data;
}

async function deleteLead(id) {
  const { error: interactionError } = await supabaseClient.from("lead_interactions").delete().eq("lead_id", id);
  if (interactionError) throw interactionError;
  const { error } = await supabaseClient.from("leads").delete().eq("id", id);
  if (error) throw error;
  selectedLeadIds.delete(id);
  showToast("Lead silindi");
  await fetchLeads();
}

async function updateLeadStatus(id, status) {
  const { error } = await supabaseClient.from("leads").update({ status, updated_at: new Date().toISOString(), last_contacted_at: status === "message_sent" ? new Date().toISOString() : undefined }).eq("id", id);
  if (error) throw error;
  await addInteraction(id, "status", `Status dəyişdi: ${STATUS_LABELS[status] || status}`);
  showToast("Status yeniləndi");
  await fetchLeads();
}

async function addInteraction(leadId, type, message) {
  if (!message) return;
  const { error } = await supabaseClient.from("lead_interactions").insert({ lead_id: leadId, type, message });
  if (error) throw error;
}

async function preventDuplicate(payload, ignoreId = null) {
  const checks = [];
  if (payload.phone) checks.push(`phone.eq.${payload.phone}`);
  if (payload.google_maps_url) checks.push(`google_maps_url.eq.${payload.google_maps_url}`);
  if (!checks.length) return;
  let query = supabaseClient.from("leads").select("id,business_name").or(checks.join(",")).limit(1);
  if (ignoreId) query = query.neq("id", ignoreId);
  const { data, error } = await query;
  if (error) throw error;
  if (data?.length) throw new Error(`Dublikat lead tapıldı: ${data[0].business_name}`);
}

function applyFilters() {
  const get = (id) => ($(id)?.value || "").trim().toLowerCase();
  const search = get("searchInput");
  filteredLeads = leads.filter((lead) => {
    const haystack = [lead.business_name, lead.phone, lead.address, lead.website, lead.instagram].join(" ").toLowerCase();
    return (!search || haystack.includes(search)) &&
      (!get("categoryFilter") || lead.category_id === $("categoryFilter").value) &&
      (!get("statusFilter") || lead.status === $("statusFilter").value) &&
      (!get("cityFilter") || (lead.city || "").toLowerCase().includes(get("cityFilter"))) &&
      (!get("districtFilter") || (lead.district || "").toLowerCase().includes(get("districtFilter"))) &&
      (!get("sourceFilter") || (lead.source || "").toLowerCase().includes(get("sourceFilter"))) &&
      (!get("websiteFilter") || String(Boolean(lead.has_website)) === $("websiteFilter").value);
  });
  renderAll();
}

function renderAll() {
  renderStats();
  renderTable();
  renderAnalytics();
}

function renderStats() {
  const stats = {
    total: leads.length,
    noWebsite: leads.filter((l) => !l.has_website).length,
    sent: leads.filter((l) => l.status === "message_sent").length,
    interested: leads.filter((l) => l.status === "interested").length,
    customers: leads.filter((l) => l.status === "customer").length,
  };
  Object.entries(stats).forEach(([key, value]) => { const el = $(`stat-${key}`); if (el) el.textContent = value; });
}

function categoryName(lead) {
  return lead.lead_categories?.name || categories.find((c) => c.id === lead.category_id)?.name || "-";
}

function statusBadge(status) {
  const colors = { new: "bg-slate-100 text-slate-700", message_sent: "bg-blue-100 text-blue-700", interested: "bg-emerald-100 text-emerald-700", price_sent: "bg-purple-100 text-purple-700", meeting: "bg-amber-100 text-amber-700", customer: "bg-green-100 text-green-700", not_interested: "bg-gray-100 text-gray-700", blocked: "bg-red-100 text-red-700" };
  return `<span class="px-2.5 py-1 rounded-full text-xs font-semibold ${colors[status] || colors.new}">${STATUS_LABELS[status] || status}</span>`;
}

function renderTable() {
  const body = $("leadTableBody");
  if (!body) return;
  if (!filteredLeads.length) {
    body.innerHTML = `<tr><td colspan="${currentMode === "admin" ? 9 : 8}" class="p-8 text-center text-slate-500">Lead tapılmadı.</td></tr>`;
    return;
  }
  body.innerHTML = filteredLeads.map((lead) => `
    <tr class="border-b border-slate-100 hover:bg-slate-50 ${!lead.has_website ? "bg-amber-50/70" : ""}">
      ${currentMode === "admin" ? `<td class="p-3"><input type="checkbox" class="lead-checkbox" data-id="${lead.id}" ${selectedLeadIds.has(lead.id) ? "checked" : ""}></td>` : ""}
      <td class="p-3 font-semibold text-slate-800">${escapeHtml(lead.business_name)}${!lead.has_website ? `<div class="text-xs text-amber-700">Website yoxdur - fürsət</div>` : ""}</td>
      <td class="p-3">${escapeHtml(categoryName(lead))}</td>
      <td class="p-3 whitespace-nowrap">${escapeHtml(lead.phone || "-")}</td>
      <td class="p-3 text-sm">${escapeHtml([lead.city, lead.district, lead.address].filter(Boolean).join(", ") || "-")}</td>
      <td class="p-3">${lead.website ? `<a class="text-blue-600 hover:underline" target="_blank" href="${safeUrl(lead.website)}">Aç</a>` : "-"}</td>
      <td class="p-3">${statusBadge(lead.status)}</td>
      <td class="p-3">${escapeHtml(lead.source || "-")}</td>
      <td class="p-3"><div class="flex flex-wrap gap-2">
        <button class="btn-light" onclick="openLeadModal('${lead.id}')">Edit</button>
        <button class="btn-light" onclick="openWhatsApp('${lead.id}')">WhatsApp</button>
        <button class="btn-light" onclick="quickStatus('${lead.id}','message_sent')">Mesaj</button>
        <button class="btn-light" onclick="openNotePrompt('${lead.id}')">Qeyd</button>
        <button class="btn-danger" onclick="confirmDeleteLead('${lead.id}')">Sil</button>
      </div></td>
    </tr>`).join("");
  document.querySelectorAll(".lead-checkbox").forEach((box) => box.addEventListener("change", (e) => {
    e.target.checked ? selectedLeadIds.add(e.target.dataset.id) : selectedLeadIds.delete(e.target.dataset.id);
  }));
}

function renderSelects() {
  const categoryOptions = `<option value="">Bütün kateqoriyalar</option>` + categories.map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join("");
  ["categoryFilter", "leadCategory"].forEach((id) => { if ($(id)) $(id).innerHTML = id === "leadCategory" ? `<option value="">Kateqoriya seçin</option>${categoryOptions.replace('<option value="">Bütün kateqoriyalar</option>', '')}` : categoryOptions; });
  const statusOptions = CRM_STATUSES.map((s) => `<option value="${s}">${STATUS_LABELS[s]}</option>`).join("");
  ["statusFilter", "leadStatus", "bulkStatus"].forEach((id) => { if ($(id)) $(id).innerHTML = (id === "statusFilter" ? `<option value="">Bütün statuslar</option>` : "") + statusOptions; });
}

function renderAnalytics() {
  if (currentMode !== "admin") return;
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  setList("analyticsCategory", groupCount(leads, categoryName));
  setList("analyticsStatus", groupCount(leads, (l) => STATUS_LABELS[l.status] || l.status));
  const noWeb = $("analyticsNoWebsite"); if (noWeb) noWeb.textContent = leads.filter((l) => !l.has_website).length;
  const contacted = $("analyticsContactedWeek"); if (contacted) contacted.textContent = leads.filter((l) => l.last_contacted_at && new Date(l.last_contacted_at) >= weekAgo).length;
  renderCategoryManager();
}

function groupCount(items, mapper) {
  return items.reduce((acc, item) => { const key = mapper(item) || "-"; acc[key] = (acc[key] || 0) + 1; return acc; }, {});
}
function setList(id, data) { const el = $(id); if (el) el.innerHTML = Object.entries(data).map(([k, v]) => `<li><span>${escapeHtml(k)}</span><b>${v}</b></li>`).join("") || `<li>Məlumat yoxdur</li>`; }
function renderCategoryManager() { const el = $("categoryList"); if (el) el.innerHTML = categories.map((c) => `<div class="flex items-center justify-between gap-2 rounded-lg border p-2"><span>${escapeHtml(c.name)}</span><div class="flex gap-2"><button class="btn-light" onclick="editCategory('${c.id}')">Edit</button><button class="btn-danger" onclick="deleteCategory('${c.id}')">Sil</button></div></div>`).join(""); }

function openLeadModal(id = null) {
  const lead = leads.find((l) => l.id === id) || {};
  $("leadId").value = lead.id || "";
  ["business_name", "city", "district", "address", "phone", "whatsapp_phone", "website", "instagram", "google_maps_url", "source", "rating", "review_count", "notes", "last_contacted_at"].forEach((name) => { const el = $(`lead_${name}`); if (el) el.value = lead[name] || ""; });
  $("leadCategory").value = lead.category_id || "";
  $("leadStatus").value = lead.status || "new";
  $("modalTitle").textContent = id ? "Lead redaktə et" : "Yeni lead";
  $("leadModal").classList.remove("hidden");
}
function closeLeadModal() { $("leadModal").classList.add("hidden"); }
function formDataToObject(form) { return Object.fromEntries(new FormData(form).entries()); }
async function handleLeadSubmit(e) { e.preventDefault(); setLoading(true, "Yadda saxlanılır..."); try { const id = $("leadId").value; id ? await updateLead(id, formDataToObject(e.target)) : await createLead(formDataToObject(e.target)); closeLeadModal(); e.target.reset(); } catch (err) { showToast(err.message, "error"); } finally { setLoading(false); } }
async function quickStatus(id, status) { setLoading(true, "Status yenilənir..."); try { await updateLeadStatus(id, status); } catch (e) { showToast(e.message, "error"); } finally { setLoading(false); } }
async function confirmDeleteLead(id) { if (!confirm("Lead silinsin?")) return; setLoading(true, "Silinir..."); try { await deleteLead(id); } catch (e) { showToast(e.message, "error"); } finally { setLoading(false); } }
async function openNotePrompt(id) { const message = prompt("Qeyd və ya mesaj yazın:"); if (!message) return; try { await addInteraction(id, "note", message); showToast("Qeyd əlavə edildi"); } catch (e) { showToast(e.message, "error"); } }
function openWhatsApp(id) { const lead = leads.find((l) => l.id === id); if (!lead?.whatsapp_phone) return showToast("WhatsApp nömrəsi yoxdur", "warning"); window.open(`https://wa.me/${lead.whatsapp_phone}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`, "_blank"); }

function exportCsv(rows = filteredLeads, filename = "leads.csv") {
  const headers = ["business_name","category_id","city","district","address","phone","whatsapp_phone","website","instagram","google_maps_url","source","rating","review_count","has_website","status","notes","last_contacted_at"];
  const csv = [headers.join(","), ...rows.map((row) => headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("CSV export edildi");
}
function parseCsv(text) { const lines = text.split(/\r?\n/).filter(Boolean); const headers = lines.shift().split(",").map((h) => h.trim().replace(/^"|"$/g, "")); return lines.map((line) => { const values = line.match(/("([^"]|"")*"|[^,]+)/g) || []; return Object.fromEntries(headers.map((h, i) => [h, (values[i] || "").trim().replace(/^"|"$/g, "").replace(/""/g, '"')])); }); }
async function importCsv(file) { if (!file) return; setLoading(true, "CSV import edilir..."); try { const text = await file.text(); const rows = parseCsv(text).map(normalizeLeadPayload); const { error } = await supabaseClient.from("leads").insert(rows); if (error) throw error; showToast(`${rows.length} lead import edildi`); await fetchLeads(); } catch (e) { showToast(e.message, "error"); } finally { setLoading(false); } }
async function addCategory() { const name = $("newCategoryName").value.trim(); if (!name) return; try { const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""); const { error } = await supabaseClient.from("lead_categories").insert({ name, slug }); if (error) throw error; $("newCategoryName").value = ""; await fetchCategories(); renderSelects(); renderAnalytics(); showToast("Kateqoriya əlavə edildi"); } catch (e) { showToast(e.message, "error"); } }
async function editCategory(id) { const cat = categories.find((c) => c.id === id); const name = prompt("Kateqoriya adı", cat?.name); if (!name) return; try { const { error } = await supabaseClient.from("lead_categories").update({ name, slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }).eq("id", id); if (error) throw error; await fetchCategories(); renderSelects(); renderAll(); showToast("Kateqoriya yeniləndi"); } catch (e) { showToast(e.message, "error"); } }
async function deleteCategory(id) { if (leads.some((l) => l.category_id === id)) return showToast("Bu kateqoriyada lead var, silmək olmaz", "warning"); if (!confirm("Kateqoriya silinsin?")) return; try { const { error } = await supabaseClient.from("lead_categories").delete().eq("id", id); if (error) throw error; await fetchCategories(); renderSelects(); renderAll(); showToast("Kateqoriya silindi"); } catch (e) { showToast(e.message, "error"); } }
async function bulkMark() { await Promise.all([...selectedLeadIds].map((id) => updateLeadStatus(id, $("bulkStatus").value || "message_sent"))); selectedLeadIds.clear(); await fetchLeads(); }
async function bulkDelete() { if (!confirm("Seçilmiş leadlər silinsin?")) return; for (const id of [...selectedLeadIds]) await deleteLead(id); selectedLeadIds.clear(); }
function bulkExport() { exportCsv(leads.filter((l) => selectedLeadIds.has(l.id)), "selected-leads.csv"); }
function escapeHtml(v) { return String(v ?? "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c])); }
function safeUrl(url) { return /^https?:\/\//i.test(url) ? url : `https://${url}`; }

async function bootCrm(mode = "user") {
  currentMode = mode;
  document.querySelectorAll(".filter-input").forEach((el) => el.addEventListener("input", applyFilters));
  $("leadForm")?.addEventListener("submit", handleLeadSubmit);
  setLoading(true);
  try {
    await initSupabase();
    if (supabaseClient) {
      await fetchCategories();
      renderSelects();
      await fetchLeads();
    }
  } catch (e) { showToast(e.message, "error"); }
  finally { setLoading(false); }
}

window.crmReady = crmReady;
window.bootCrm = bootCrm;
window.openLeadModal = openLeadModal;
window.closeLeadModal = closeLeadModal;
window.quickStatus = quickStatus;
window.confirmDeleteLead = confirmDeleteLead;
window.openNotePrompt = openNotePrompt;
window.openWhatsApp = openWhatsApp;
window.exportCsv = exportCsv;
window.importCsv = importCsv;
window.addCategory = addCategory;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;
window.bulkMark = bulkMark;
window.bulkDelete = bulkDelete;
window.bulkExport = bulkExport;
