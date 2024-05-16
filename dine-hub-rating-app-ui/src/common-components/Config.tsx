import { ConfigProvider } from 'antd';
import React from 'react';

const Config = ({ children }: { children: React.ReactNode }) => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    // colorBgTextHover: "#F2F7F8",
                    colorText: '#002244',
                    colorBgSpotlight: '#1f6fbe',
                    colorLinkActive: '#F2F7F8',
                },
                components: {
                    Input: {
                        colorBorder: '#bfbfbf',
                        colorTextPlaceholder: '#8c8c8c',
                    },
                    Select: {
                        colorBorder: '#bfbfbf',
                        colorTextPlaceholder: '#8c8c8c',
                    },
                    Table: {
                        colorPrimary: primaryColor,
                        headerBg: backgroundColor,
                        headerSortActiveBg: backgroundColor,
                        headerSortHoverBg: backgroundColor,
                        bodySortBg: selectedColor,
                        rowSelectedBg: secondaryColor,
                        rowHoverBg: selectedColor,
                        fontSize: 15,
                    },
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
};

export default Config;

const primaryColor = '#002244';
const secondaryColor = '#11A7D9';
const selectedColor = '#F0FAFF';
const backgroundColor = '#F2F7F8';
