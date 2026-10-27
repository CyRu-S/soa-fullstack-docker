import { useEffect, useState } from 'react';
import { courierApi } from './api.js';
import PickupForm from './components/PickupForm.jsx';
import PickupRegister from './components/PickupRegister.jsx';
import DeleteDialog from './components/DeleteDialog.jsx';

export default function App() {
  const [records, setRecords] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(true);
  const [notice, setNotice] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  async function loadRecords(signal) {
    setLoading(true);
    try {
      const result = await courierApi('/displayall', { signal });
      if (signal?.aborted) return false;
      if (!Array.isArray(result)) throw new Error('The courier service returned an unexpected response.');
      setRecords(result);
      setLoaded(true);
      return true;
    } catch (error) {
      if (signal?.aborted) return false;
      setRecords([]);
      setLoaded(false);
      setNotice({ message: error.message, error: true });
      return false;
    } finally { if (!signal?.aborted) setLoading(false); }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadRecords(controller.signal).finally(() => {
      if (!controller.signal.aborted) setBusy(false);
    });
    return () => controller.abort();
  }, []);

  async function refresh() {
    if (busy) return;
    setBusy(true);
    try { if (await loadRecords()) setNotice(null); }
    finally { setBusy(false); }
  }

  async function savePickup(payload) {
    if (busy) return false;
    const updating = editing !== null;
    setBusy(true);
    try {
      await courierApi(updating ? `/update/${encodeURIComponent(editing.id)}` : '/add', {
        method: updating ? 'PUT' : 'POST', body: JSON.stringify(payload),
      });
      setEditing(null);
      if (await loadRecords()) setNotice({ message: updating ? 'Pickup updated successfully.' : 'Pickup booked. Your parcel is on the list!' });
      else setNotice({ message: 'Your pickup was saved, but the register could not be refreshed. Please use Refresh.', error: true });
      return true;
    } catch (error) {
      setNotice({ message: error.message, error: true });
      return false;
    } finally { setBusy(false); }
  }

  async function deletePickup(record) {
    setDeleting(null);
    if (busy) return;
    setBusy(true);
    try {
      const result = await courierApi(`/delete/${encodeURIComponent(record.id)}`, { method: 'DELETE' });
      if (typeof result === 'string' && /not found/i.test(result)) throw new Error('This pickup no longer exists. Refresh the register to update the list.');
      if (editing?.id === record.id) setEditing(null);
      if (await loadRecords()) setNotice({ message: 'Pickup deleted successfully.' });
      else setNotice({ message: 'Pickup deleted, but the register could not be refreshed. Please use Refresh.', error: true });
    } catch (error) { setNotice({ message: error.message, error: true }); }
    finally { setBusy(false); }
  }

  const stats = [
    { id: 'total-count', label: 'Total pickups', count: records.length },
    { id: 'pending-count', label: 'Pending', count: records.filter((record) => !record.status).length, dot: 'pending-dot' },
    { id: 'collected-count', label: 'Picked up', count: records.filter((record) => record.status).length, dot: 'collected-dot' },
  ];

  return (
    <>
      <nav className="navbar topbar" aria-label="Main navigation">
        <div className="container app-container"><a className="navbar-brand brand" href="#"><span className="brand-icon" aria-hidden="true">▦</span> ParcelDesk</a><a className="nav-link active-link" href="#pickups">Courier pickups <span aria-hidden="true">↗</span></a></div>
      </nav>
      <main className="container app-container py-4 py-lg-5">
        <header className="page-heading"><div><p className="eyebrow">A LITTLE LESS LOGISTICS.</p><h1>Your pickups, in order.</h1><p className="text-secondary mb-0">Book a collection and keep every parcel on track.</p></div><span className="workspace-label">COURIER WORKSPACE</span></header>
        {notice && <div id="notice" className={`alert ${notice.error ? 'alert-danger' : 'alert-success'}`} role="status" aria-live="polite">{notice.message}</div>}
        <section className="row g-3 mb-4" aria-label="Pickup overview">{stats.map((stat) => (
          <div className="col-4" key={stat.id}><div className="stat-card"><span>{stat.dot && <i className={`status-dot ${stat.dot}`} aria-hidden="true" />} {stat.label}</span><strong id={stat.id}>{loaded ? stat.count : '—'}</strong></div></div>
        ))}</section>
        <div className="row g-4 align-items-start">
          <PickupForm key={editing?.id ?? 'new'} record={editing} busy={busy} onSave={savePickup} onCancel={() => setEditing(null)} />
          <PickupRegister records={records} loaded={loaded} loading={loading} busy={busy} onRefresh={refresh} onEdit={setEditing} onDelete={setDeleting} />
        </div>
        <footer className="page-footer"><span>ParcelDesk</span><span>One place for every pickup.</span></footer>
      </main>
      <DeleteDialog record={deleting} onConfirm={deletePickup} onCancel={() => setDeleting(null)} />
    </>
  );
}
