import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { Restaurants } from '../utils/types';

interface FormComponentProps {
    initialValues: Restaurants | null;
    onSubmit: (values: any) => void;
}

const FormComponent: React.FC<FormComponentProps> = ({ initialValues, onSubmit }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }, [initialValues]);

    const handleFinish = (values: any) => {
        onSubmit(values);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={initialValues || {}} // Ensure the form initializes correctly
            onFinish={handleFinish}
        >
            <Form.Item
                label="Name"
                name="Name"
                rules={[{ required: true, message: 'Please input the name!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Description"
                name="Description"
                rules={[{ required: true, message: 'Please input the description!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Address"
                name="Address"
                rules={[{ required: true, message: 'Please input the address!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Hours"
                name="Hours"
                rules={[{ required: true, message: 'Please input the hours!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default FormComponent;
