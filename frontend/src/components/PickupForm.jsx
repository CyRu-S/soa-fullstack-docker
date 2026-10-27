import { useEffect, useRef, useState } from 'react';

export default function PickupForm({ record, busy, onSave, onCancel }) {
  const [values, setValues] = useState({
    senderName: record?.senderName ?? '',
    pickupAddress: record?.pickupAddress ?? '',
    parcelWeightKg: record?.parcelWeightKg ?? '',
    status: String(record?.status ?? false),
  });
  const [saving, setSaving] = useState(false);
  const formRef = useRef(null);
  const senderRef = useRef(null);

  useEffect(() => {
    if (record) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      senderRef.current.focus({ preventScroll: true });
    }
  }, [record]);

  function change(event) {
    event.target.setCustomValidity('');
    setValues((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    form.elements.pickupAddress.setCustomValidity(values.pickupAddress.trim() ? '' : 'Enter a pickup address.');
    if (!form.reportValidity()) return;
    setSaving(true);
    try {
      const saved = await onSave({
        senderName: values.senderName.trim(),
        pickupAddress: values.pickupAddress.trim(),
        parcelWeightKg: Number(values.parcelWeightKg),
        status: values.status === 'true',
      });
      if (saved && !record) setValues({ senderName: '', pickupAddress: '', parcelWeightKg: '', status: 'false' });
    } finally { setSaving(false); }
  }

  return (
    <section className="col-lg-4" aria-labelledby="form-title">
      <div className="panel form-panel">
        <div className="section-number">01 / BOOK A COLLECTION</div>
        <h2 id="form-title">{record ? `Edit pickup #${record.id}` : 'New pickup'}</h2>
        <p className="panel-description">Tell us where your parcel starts.</p>
        <form id="pickup-form" ref={formRef} onSubmit={submit}>
          <fieldset id="editor-fields" disabled={busy}>
            <div className="mb-3">
              <label className="form-label" htmlFor="sender">Sender name</label>
              <input ref={senderRef} className="form-control" id="sender" name="senderName" placeholder="Your Name" autoComplete="name" required maxLength={100} pattern="[A-Za-z ]*[A-Za-z][A-Za-z ]*" title="Enter a name using only letters and spaces. Numbers and symbols are not allowed." value={values.senderName} onChange={change} />
              <div className="form-text">Letters and spaces only. No numbers or symbols.</div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="address">Pickup address</label>
              <textarea className="form-control" id="address" name="pickupAddress" placeholder="House number, street, city and postal code" autoComplete="street-address" rows={3} required maxLength={500} value={values.pickupAddress} onChange={change} />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="weight">Parcel weight <span className="text-secondary fw-normal">(kg)</span></label>
              <input className="form-control" id="weight" name="parcelWeightKg" type="number" min="0.01" max="1000" step="0.01" placeholder="0.00" required value={values.parcelWeightKg} onChange={change} />
              <div className="form-text">Between 0.01 and 1,000 kg.</div>
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="status">Pickup status</label>
              <select className="form-select" id="status" name="status" value={values.status} onChange={change}>
                <option value="false">Pending collection</option><option value="true">Picked up</option>
              </select>
            </div>
            <button id="save-button" className="btn btn-primary w-100" type="submit">
              {saving ? (record ? 'Saving changes…' : 'Booking pickup…') : (record ? 'Save changes' : 'Book pickup')}
              {!saving && <span aria-hidden="true">→</span>}
            </button>
            {record && <button id="cancel-edit" className="btn btn-light w-100 mt-2" type="button" onClick={onCancel}>Cancel editing</button>}
          </fieldset>
        </form>
        <p className="form-footnote">A pickup ID is created automatically when you book.</p>
      </div>
    </section>
  );
}
