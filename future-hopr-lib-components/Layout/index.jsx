// Packages
import React from 'react';
import styled from '@emotion/styled'

// Components
//import NavBar from './navbar';
import NavBar from '../Navbar/navBar.jsx'
import Footer from './footer';


const SLayout = styled.div`
`

const Content = styled.div`
  margin-top: 60px;
`

const Layout = ({ className = '', children, setShowSetup, itemsNavbarRight}) => {
    return (
        <SLayout className="Layout">
            {/* <NavBar
                rightButtons={rightNavBarButtons}
            /> */}
            <NavBar
                mainLogo="/assets/icons/logo.svg"
                mainLogoAlt="hopr logo"
                itemsNavbarRight={itemsNavbarRight}
            />
            <Content className="Content">
                {children}
            </Content>
            <Footer />
        </SLayout>
    );
};

export default Layout;