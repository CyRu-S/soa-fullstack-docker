import { useEffect, useRef } from 'react';

export default function DeleteDialog({ record, onConfirm, onCancel }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (record && !dialog.open) {
      dialog.returnValue = 'cancel';
      dialog.showModal();
    }
    return () => { if (dialog.open) dialog.close(); };
  }, [record]);

  return (
    <dialog id="delete-dialog" ref={dialogRef} aria-labelledby="delete-title" aria-describedby="delete-description" onClose={(event) => {
      if (event.currentTarget.returnValue === 'delete' && record) onConfirm(record);
      else onCancel();
    }}>
      <form method="dialog">
        <h2 id="delete-title">Delete this pickup?</h2>
        <p id="delete-description">{record ? `Pickup #${record.id} for ${record.senderName} will be permanently removed.` : 'This record will be permanently removed.'}</p>
        <div className="d-flex justify-content-end gap-2"><button className="btn btn-light" value="cancel" autoFocus>Keep pickup</button><button className="btn btn-danger" value="delete">Delete pickup</button></div>
      </form>
    </dialog>
  );
}
