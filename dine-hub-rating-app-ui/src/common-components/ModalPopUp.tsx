import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { ChildModal } from '../utils/types';

const ModalPopUp: React.FC<ChildModal> = ({ modalOpen, title, closeModal, body }) => {
    // const [modal2Open, setModalOpen] = useState(false);
    console.log('modalOpen from child', modalOpen)

    // const handleOk = () => {
    //     setModalOpen(false)
    // }
    return (

        <Modal
            title={title}
            centered
            open={modalOpen || false}
            // onOk={handleOk}
            onCancel={closeModal}
            destroyOnClose
        >

            <p>{body}</p>
        </Modal>
    );
};

export default ModalPopUp;