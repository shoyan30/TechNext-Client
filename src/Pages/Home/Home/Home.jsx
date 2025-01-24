import React, { useEffect, useState } from 'react';

import SocialFeed from '../SocialFeed/SocialFeed';

const Home = () => {

     const [menu, setMenu] = useState([])
    useEffect( () =>{
        fetch('menu.json')
        .then(res =>res.json())
        .then(data => console.log(data))
    }, [])
    return (
        <div>
            <SocialFeed></SocialFeed>
            
        </div>
    );
};

export default Home;