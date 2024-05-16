import { Flex, Layout } from 'antd';
import Config from './Config';



const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const { Header, Footer, Content } = Layout;

    const HeaderStyle: React.CSSProperties = {
        position: 'sticky',
        zIndex: 100,
        display: 'flex',
        fontSize: '2vw',
        justifyContent: 'center',
        borderBottomStyle: 'inset',
        backgroundColor: '#11A7D9',

    };

    const contentStyle: React.CSSProperties = {
        minHeight: "800px",
        // maxWidth: '90vw',
        margin: 32,
        height: '89vh',
        padding: '10px',
        transition: 'all 0.5s ease 0s',
        overflowY: 'auto',
    };
    return (
        <Flex>
            <Config>
                <Layout>
                    <Header style={HeaderStyle}>Welcome to Dine-Hub</Header>
                    <Layout>
                        <Content style={contentStyle}>{children}</Content>
                    </Layout>
                    {/* <Footer>footer</Footer> */}
                </Layout>
            </Config>
        </Flex>
    )

}

export default AppLayout;