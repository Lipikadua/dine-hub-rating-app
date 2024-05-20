import React from 'react';
import { Modal, Button } from 'antd';

const ConfirmDeleteModal = ({ visible, onCancel, onConfirm }) => {
    return (
        <Modal
            open={visible}
            title="Confirm Deletion"
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="confirm" type="primary" danger onClick={onConfirm}>
                    Delete
                </Button>,
            ]}
        >
            <p>Are you sure you want to delete this restaurant?</p>
        </Modal>
    );
};

export default ConfirmDeleteModal;
