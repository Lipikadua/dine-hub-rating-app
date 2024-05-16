// import React, { useState } from 'react';
// import type { TableProps } from 'antd';
// import { Form, Input, InputNumber, Popconfirm, Space, Table, Typography } from 'antd';
// import { EditOutlined, EyeOutlined } from '@ant-design/icons';

// interface Item {
//     key: string;
//     name: string;
//     age: number;
//     address: string;
// }

// const originData: Item[] = [];
// for (let i = 0; i < 100; i++) {
//     originData.push({
//         key: i.toString(),
//         name: `Edward ${i}`,
//         age: 32,
//         address: `London Park no. ${i}`,
//     });
// }
// interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
//     editing: boolean;
//     dataIndex: string;
//     title: any;
//     inputType: 'number' | 'text';
//     record: Item;
//     index: number;
// }

// const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
//     editing,
//     dataIndex,
//     title,
//     inputType,
//     record,
//     index,
//     children,
//     ...restProps
// }) => {
//     const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

//     return (
//         <td {...restProps}>
//             {editing ? (
//                 <Form.Item
//                     name={dataIndex}
//                     style={{ margin: 0 }}
//                     rules={[
//                         {
//                             required: true,
//                             message: `Please Input ${title}!`,
//                         },
//                     ]}
//                 >
//                     {inputNode}
//                 </Form.Item>
//             ) : (
//                 children
//             )}
//         </td>
//     );
// };

// const App: React.FC = () => {
//     const [form] = Form.useForm();
//     const [data, setData] = useState(originData);
//     const [editingKey, setEditingKey] = useState('');

//     const isEditing = (record: Item) => record.key === editingKey;

//     const edit = (record: Partial<Item> & { key: React.Key }) => {
//         form.setFieldsValue({ name: '', age: '', address: '', ...record });
//         setEditingKey(record.key);
//     };

//     const cancel = () => {
//         setEditingKey('');
//     };

//     const save = async (key: React.Key) => {
//         try {
//             const row = (await form.validateFields()) as Item;

//             const newData = [...data];
//             const index = newData.findIndex((item) => key === item.key);
//             if (index > -1) {
//                 const item = newData[index];
//                 newData.splice(index, 1, {
//                     ...item,
//                     ...row,
//                 });
//                 setData(newData);
//                 setEditingKey('');
//             } else {
//                 newData.push(row);
//                 setData(newData);
//                 setEditingKey('');
//             }
//         } catch (errInfo) {
//             console.log('Validate Failed:', errInfo);
//         }
//     };

//     const columns = [
//         {
//             title: 'Name',
//             dataIndex: 'name',
//             width: '15%',
//             editable: true,
//         },
//         {
//             title: 'Description ',
//             dataIndex: 'description',
//             width: '20%',
//             editable: true,
//         },
//         {
//             title: 'address',
//             dataIndex: 'address',
//             width: '15%',
//             editable: true,
//         },
//         {
//             title: 'Hour',
//             dataIndex: 'hour',
//             width: '15%',
//             editable: true,
//         },
//         {
//             title: 'Average Rating',
//             dataIndex: 'avgRating',
//             width: '20%',
//             editable: false,
//         },
//         {
//             title: '',
//             width: '60%',
//             dataIndex: 'action',
//             render: (_: any, record: Item) => {
//                 const editable = isEditing(record);
//                 return (

//                     <Space style={{ color: '#11A7D9', fontWeight: 400 }} size="middle">
//                         {editable ? (
//                             <span>
//                                 <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 16 }}>
//                                     Save
//                                 </Typography.Link>
//                                 <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
//                                     <a>Cancel</a>
//                                 </Popconfirm>
//                             </span>
//                         ) : (
//                             <Typography.Link disabled={editingKey !== ''} style={{ width: 30, marginRight: 16 }} onClick={() => edit(record)}>
//                                 <EditOutlined />  Edit
//                             </Typography.Link>
//                         )}
//                         <a onClick={() => navigate(`${ROUTES.DOCUMENT_VIEW.replace(':id', Id)}`)}>
//                             <EyeOutlined /> View
//                         </a>
//                         <a onClick={() => navigate(`${ROUTES.DOCUMENT_VIEW.replace(':id', Id)}`)}>
//                             <EyeOutlined /> Delete
//                         </a>
//                     </Space>

//                 );


//             },

//         },
//     ];

//     const mergedColumns: TableProps['columns'] = columns.map((col) => {
//         if (!col.editable) {
//             return col;
//         }
//         return {
//             ...col,
//             onCell: (record: Item) => ({
//                 record,
//                 inputType: col.dataIndex === 'age' ? 'number' : 'text',
//                 dataIndex: col.dataIndex,
//                 title: col.title,
//                 editing: isEditing(record),
//             }),
//         };
//     });

//     return (
//         <Form form={form} component={false}>
//             <Table
//                 components={{
//                     body: {
//                         cell: EditableCell,
//                     },
//                 }}
//                 bordered
//                 dataSource={data}
//                 columns={mergedColumns}
//                 rowClassName="editable-row"
//                 pagination={{
//                     onChange: cancel,
//                 }}
//             />
//         </Form>
//     );
// };

// export default App;


// src/components/RestaurantsList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RestaurantsList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get(`https://39tia1oajk.execute-api.us-east-1.amazonaws.com/dev/restaurants`);
                setRestaurants(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Restaurants</h1>
            <ul>
                {restaurants.map((restaurant) => (
                    <li key={restaurant.restaurantId}>
                        {restaurant.name} - Average Rating: {restaurant.avgRating}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RestaurantsList;
