import { useState } from 'react';

export default function PickupRegister({ records, loaded, loading, busy, onRefresh, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const query = search.trim().toLowerCase();
  const visible = records.filter((record) =>
    `${record.senderName} ${record.pickupAddress} ${record.id}`.toLowerCase().includes(query)
    && (filter === 'all' || String(record.status) === filter));

  return (
    <section id="pickups" className="col-lg-8" aria-labelledby="list-title" aria-busy={loading}>
      <div className="panel list-panel">
        <div className="list-heading">
          <div><div className="section-number">02 / YOUR COLLECTIONS</div><h2 id="list-title">Pickup register</h2></div>
          <button id="refresh-button" className="btn btn-outline-secondary btn-sm" type="button" disabled={busy} onClick={onRefresh}>↻ Refresh</button>
        </div>
        <div className="list-toolbar">
          <label className="visually-hidden" htmlFor="search">Search pickups</label>
          <input id="search" className="form-control" type="search" placeholder="Search by name, address or ID…" value={search} onChange={(event) => setSearch(event.target.value)} />
          <label className="visually-hidden" htmlFor="filter">Filter by pickup status</label>
          <select id="filter" className="form-select" value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">All statuses</option><option value="false">Pending</option><option value="true">Picked up</option>
          </select>
        </div>
        {loading || !loaded || visible.length === 0 ? (
          <div id="list-state" className="list-state" role="status" aria-live="polite">
            {loading ? 'Loading your pickups…' : !loaded ? <><strong>Pickups could not be loaded.</strong><span>Use Refresh to try again.</span></>
              : records.length ? <><strong>No matching pickups</strong><span>Try another search or change the status filter.</span></>
                : <><strong>Your next pickup starts here.</strong><span>Book your first collection using the form.</span></>}
          </div>
        ) : (
          <div id="table-container" className="table-responsive">
            <table className="table align-middle mb-0">
              <caption className="visually-hidden">Courier pickup records and available actions</caption>
              <thead><tr><th scope="col">Sender / pickup address</th><th scope="col">Weight</th><th scope="col">Status</th><th scope="col" className="text-end">Actions</th></tr></thead>
              <tbody id="pickup-rows">{visible.map((record) => (
                <tr key={record.id}>
                  <td><div className="sender-name">{record.senderName}<span className="pickup-id">#{record.id}</span></div><div className="pickup-address">{record.pickupAddress}</div></td>
                  <td className="text-nowrap">{Number(record.parcelWeightKg).toLocaleString(undefined, { maximumFractionDigits: 2 })} kg</td>
                  <td><span className={`status-badge ${record.status ? 'collected' : ''}`}>{record.status ? 'Picked up' : 'Pending'}</span></td>
                  <td className="text-end text-nowrap">
                    <button className="row-action" aria-label={`Edit pickup ${record.id}`} disabled={busy} onClick={() => onEdit(record)}>Edit</button>
                    <button className="row-action delete" aria-label={`Delete pickup ${record.id}`} disabled={busy} onClick={() => onDelete(record)}>Delete</button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        <div className="register-footer"><span id="record-count">{loading ? 'Connecting to your pickup register' : loaded ? `Showing ${visible.length} of ${records.length} pickup${records.length === 1 ? '' : 's'}` : 'Pickup register unavailable'}</span><span>Small parcels. Simple plans.</span></div>
      </div>
    </section>
  );
}
