import React from 'react';
import logo from '../../../../assets/img/icons/common/tweetDeck.png'

const styles = {
    logoStyle : {
        marginTop: '40px'
    }
}

class Header extends React.Component {
    render() {
        return (
            <>
                <div className="header">
                    <img style={styles.logoStyle} src={logo} className="header-logo"/>
                </div>    
            </>
         );
    }
}

export default Header;