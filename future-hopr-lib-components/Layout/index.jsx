// Packages
import React from 'react';
import styled from '@emotion/styled'

// Components
import NavBar from '../Navbar/navBar.jsx'
import Footer from './footer';
import { PropaneSharp } from '@mui/icons-material';


const SLayout = styled.div`
`

const Content = styled.div`
  margin-top: 60px;
  ${props => props.tallerNavBarOnMobile &&  `
    @media screen and (max-width: 520px) {
        margin-top: 0px;
    }
  `}
`

const Layout = ({ className = '', children, setShowSetup, itemsNavbarRight, tallerNavBarOnMobile}) => {
    return (
        <SLayout className="Layout">
            {/* <NavBar
                rightButtons={rightNavBarButtons}
            /> */}
            <NavBar
                mainLogo="/assets/icons/logo.svg"
                mainLogoAlt="hopr logo"
                itemsNavbarRight={itemsNavbarRight}
                tallerNavBarOnMobile={tallerNavBarOnMobile}
            />
            <Content 
                className="Content"
                tallerNavBarOnMobile={tallerNavBarOnMobile}
            >
                {children}
            </Content>
            <Footer />
        </SLayout>
    );
};

export default Layout;