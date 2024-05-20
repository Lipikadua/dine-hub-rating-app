import React, { useState, useEffect } from 'react';
import { Table, Button, Drawer, Modal, message, Rate, Space, Card } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined, StarFilled, PlusOutlined } from '@ant-design/icons';
import FormComponent from '../../common-components/FormComponent';
import ConfirmDeleteModal from '../../common-components/ConfirmDeleteModal';
import RateRestaurantComponent from './rate/RateRestaurant';
import { fetchRestaurants, saveRestaurant, editRestaurant, deleteRestaurant, addRating } from '../../utils/helpers/api';
import { Restaurants } from '../../utils/types';
import { ColumnsType } from 'antd/es/table';
// import { RequestBody } from '../../utils/types/enum';


const RestaurantList: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurants[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurants | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [rateModalOpen, setRateModalOpen] = useState(false);
    const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

    useEffect(() => {
        fetchRestaurants().then(setRestaurants);
    }, []);

    const openDrawer = (restaurant: Restaurants) => {
        setSelectedRestaurant(restaurant);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setSelectedRestaurant(null);
    };

    const openModal = (mode: 'add' | 'edit', restaurant: Restaurants | null = null) => {
        setFormMode(mode);
        setSelectedRestaurant(restaurant);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedRestaurant(null);
    };

    const openDeleteModal = (restaurant: Restaurants) => {
        setSelectedRestaurant(restaurant);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedRestaurant(null);
    };

    const openRateModal = (restaurant: Restaurants) => {
        setSelectedRestaurant(restaurant);
        setRateModalOpen(true);
    };

    const closeRateModal = () => {
        setRateModalOpen(false);
        setSelectedRestaurant(null);
    };

    const handleSave = async (data: Restaurants) => {
        try {
            if (formMode === 'add') {
                console.log('data from add', data)
                await saveRestaurant(data);
                message.success('Restaurant added successfully');
            } else {
                if (selectedRestaurant) {
                    await editRestaurant(selectedRestaurant.RestaurantId, data);
                    message.success('Restaurant updated successfully');
                }
            }
            fetchRestaurants().then(setRestaurants);
            closeModal();
        } catch (error) {
            message.error('Failed to save restaurant');
        }
    };

    const handleDelete = async () => {
        try {
            if (selectedRestaurant) {
                await deleteRestaurant(selectedRestaurant.RestaurantId);
                message.success('Restaurant deleted successfully');
                fetchRestaurants().then(setRestaurants);
                closeDeleteModal();
            }
        } catch (error) {
            message.error('Failed to delete restaurant');
        }
    };

    const handleRate = async (data: { UserName: string; Rating: number }) => {
        try {
            console.log('selectedRestaurant', selectedRestaurant)
            if (selectedRestaurant) {
                await addRating({ ...data, RestaurantId: selectedRestaurant.RestaurantId, });
                message.success('Rating added successfully');
                fetchRestaurants().then(setRestaurants);
                closeRateModal();
            }
        } catch (error) {
            message.error('Failed to add rating');
        }
    };
    const columns: ColumnsType<Restaurants> = [
        {
            title: 'S.No.', dataIndex: 'RestaurantId', key: 'RestaurantId', width: '3%',
            render: (_text, _record, index) => index + 1,
        },
        { title: 'Name', dataIndex: 'Name', key: 'Name', width: '15%', sorter: (a, b) => a.Name.localeCompare(b.Name) },
        { title: 'Description', dataIndex: 'Description', key: 'description', width: '17%' },
        { title: 'Address', dataIndex: 'Address', key: 'Address', width: '17%' },
        { title: 'Hours', dataIndex: 'Hours', key: 'Hours', width: '15%' },
        {
            title: 'Average Rating',
            dataIndex: 'AverageRating',
            key: 'AverageRating',
            width: '12%',
            render: (value) => <Rate disabled value={value} />
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            width: '60%',
            render: (_value, record) => (
                <Space style={{ fontWeight: 400 }} size="small">
                    <Button icon={<EyeOutlined />} onClick={() => openDrawer(record)} />View
                    <Button icon={<EditOutlined />} onClick={() => openModal('edit', record)} />Edit
                    <Button icon={<DeleteOutlined />} onClick={() => openDeleteModal(record)} />Delete
                    <Button icon={<StarFilled />} onClick={() => openRateModal(record)} />Rate it
                </Space>
            )
        }
    ];

    return (
        <>
            <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                <Button type="primary" onClick={() => openModal('add')} icon={<PlusOutlined />}>New Restaurant</Button>
            </div>
            <Table bordered={true} rowKey="RestaurantId" columns={columns} dataSource={restaurants} />
            <Drawer
                title="Restaurant Details"
                onClose={closeDrawer}
                open={drawerOpen}


            >
                {
                    selectedRestaurant &&
                    (
                        <Card>
                            <p><strong>Name:</strong> {selectedRestaurant.Name}</p>
                            <p><strong>Description:</strong> {selectedRestaurant.Description}</p>
                            <p><strong>Address:</strong> {selectedRestaurant.Address} </p>
                            <p><strong>Hours:</strong> {selectedRestaurant.Hours} </p>
                            <p><strong>Average Rating:</strong>  <Rate disabled value={selectedRestaurant.AverageRating} /></p>
                        </Card>
                    )
                }
            </Drawer>
            <Modal
                title={formMode === 'add' ? 'Add New Restaurant' : 'Edit Restaurant'}
                open={modalOpen}
                onCancel={closeModal}
                footer={null}
            >
                <FormComponent
                    initialValues={selectedRestaurant}
                    onSubmit={handleSave}
                    key={selectedRestaurant ? selectedRestaurant.RestaurantId : 'add'} // Ensures form updates on modal reopen
                />
            </Modal>
            <ConfirmDeleteModal
                visible={deleteModalOpen}
                onCancel={closeDeleteModal}
                onConfirm={handleDelete}
            />
            <RateRestaurantComponent
                visible={rateModalOpen}
                onCancel={closeRateModal}
                onSubmit={handleRate}
            />
        </>
    );
};

export default RestaurantList;





