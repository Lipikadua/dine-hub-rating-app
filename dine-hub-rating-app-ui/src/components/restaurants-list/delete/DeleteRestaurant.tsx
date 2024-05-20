import React, { useState } from 'react';

// Define API functions (editAPI, deleteAPI, moreAPI) here...

const ParentComponent = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [formData, setFormData] = useState({});

  const openModal = (formType) => {
    setActiveForm(formType);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveForm(null);
  };

  const handleFormSubmit = async (data, actionType) => {
    setFormData(data);

    try {
      if (actionType === 'edit') {
        await editAPI(data);
      } else if (actionType === 'delete') {
        await deleteAPI(data);
      } else if (actionType === 'more') {
        await moreAPI(data);
      }
      console.log('Form data submitted:', data);
    } catch (error) {
      console.error('API call failed:', error);
    }

    closeModal();
  };

  const renderForm = () => {
    return <FormComponent onSubmit={handleFormSubmit} actionType={activeForm} />;
  };

  return (
    <div>
      <button onClick={() => openModal('edit')}>Edit</button>
      <button onClick={() => openModal('delete')}>Delete</button>
      <button onClick={() => openModal('more')}>More</button>
      <ModalComponent
        isOpen={modalOpen}
        closeModal={closeModal}
        title="Form Modal"
        body={renderForm()}
      />
    </div>
  );
};

export default ParentComponent;
