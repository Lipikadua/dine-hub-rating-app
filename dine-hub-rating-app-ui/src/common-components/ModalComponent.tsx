const ModalComponent = ({ isOpen, title, closeModal, body }) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{title}</h2>
                {body}
                <button onClick={closeModal}>Close</button>
            </div>
        </div>
    );
};

export default ModalComponent;