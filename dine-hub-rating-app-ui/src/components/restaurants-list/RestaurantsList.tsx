import React, { useState, useEffect, Children } from 'react';
import type { TableProps } from 'antd';
import { Form, Space, Table, Rate } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { ColumnsType } from 'antd/es/table';

interface Restaurants {
    RestaurantId: string,
    Address: string,
    Description: string,
    Name: string,
    Hour: string
    AverageRating: number
}

const RestaurantsList: React.FC = () => {
    const [data, setData] = useState<Restaurants[]>([]);


    const [loading, setLoading] = useState(true);

    const fetchRestaurants = async () => {
        try {
            const response = await axios.get(`https://39tia1oajk.execute-api.us-east-1.amazonaws.com/dev/restaurants`);
            setData(response.data.data)
            setLoading(false);

        } catch (error) {
            console.error('Error fetching restaurants:', error);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchRestaurants();

    }, []);




    if (loading) {
        return <div>Loading...</div>;
    }
    console.log('data before load data', data)



    const columns: ColumnsType<Restaurants> = [
        {
            title: 'Name',
            dataIndex: 'Name',
            width: '15%',
            sorter: (a, b) => a.Name.localeCompare(b.Name),
        },
        {
            title: 'Description ',
            dataIndex: 'Description',
            width: '20%',
        },
        {
            title: 'Address',
            dataIndex: 'Address',
            width: '20%',

        },
        {
            title: 'Hour',
            dataIndex: 'Hour',
            width: '15%',

        },
        {
            title: 'Average Rating',
            dataIndex: 'AverageRating',
            width: '15%',
            render: (value) => {

                return (
                    <Rate disabled value={value} />)
            }
        }
        ,
        {
            title: '',
            width: '60%',
            dataIndex: 'action',
            render: () => {
                return (

                    <Space style={{ fontWeight: 400 }} size="middle">
                        <a onClick={() => { }}>
                            <EditOutlined /> Edit
                        </a>
                        <a onClick={() => { }}>
                            <EyeOutlined /> View
                        </a>
                        <a onClick={() => { }}>
                            <DeleteOutlined /> Delete
                        </a>
                    </Space>

                );


            },

        },
    ];

    const tableColumns = columns.map((item) => ({ ...item, ellipsis: false }));

    return (
        <>
            <Table rowKey={(record) => record.RestaurantId}
                bordered
                dataSource={data}
                columns={tableColumns}
            />

        </>
    );
};

export default RestaurantsList;

