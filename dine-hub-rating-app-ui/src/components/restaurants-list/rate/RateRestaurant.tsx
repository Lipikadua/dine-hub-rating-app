
import { Modal, Form, Input, Button, Rate } from 'antd';

interface RatingProps {
    UserName: string
    Rating: number

}
interface FormComponentProps {
    visible: boolean
    onCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    onSubmit: (values: RatingProps) => void;
}

const RateRestaurantComponent: React.FC<FormComponentProps> = ({ visible, onCancel, onSubmit }) => {
    const [form] = Form.useForm();

    const handleFinish = (values: RatingProps) => {
        console.log('values from RateRestaurant', values) //remove
        onSubmit(values);
    };

    return (
        <Modal
            title="Rate Restaurant"
            open={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form
                form={form}
                onFinish={handleFinish}
            >
                <Form.Item
                    label="UserName"
                    name="UserName"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Rating"
                    name="Rating"
                    rules={[{ required: true, message: 'Please input your rating!' }]}
                >
                    <Rate />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RateRestaurantComponent;
