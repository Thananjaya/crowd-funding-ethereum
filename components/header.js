import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
    return(
        <Menu style={{marginTop: "10px"}}>
            <Link route="/">
                <a className="item">Crowd Funding</a>
            </Link>
            <Menu.Menu position="right">
            <Link route="/cf/new">
                <a className="item">+</a>
            </Link>
                
            </Menu.Menu>
        </Menu>

    )
}