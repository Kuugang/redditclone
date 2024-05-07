function openModal(ref) {
    (ref.current).showModal();
}
function closeModal(ref) {
    (ref.current).close();
}
const handleDialogOutsideClick = (e, modalRef) => {
    if (e.target == modalRef.current) {
        closeModal(modalRef)
    }
}

export { openModal, closeModal, handleDialogOutsideClick };
