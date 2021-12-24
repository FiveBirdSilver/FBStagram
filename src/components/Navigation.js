import React from "react";
import {Link} from "react-router-dom";

function Navigation({UserObj}) { // 로그인이 되었을 때, 메인 페이지와 프로필 페이지의 경로를 제공해줌
    return(
   
        <ul>
            {/* <li><Link to="/">Home</Link></li>
            {UserObj.displayName 
            ? 
             <li><Link to="/profile">{UserObj.displayName}의 프로필 </Link></li>
            :
             <li><Link to="/profile">프로필에 정보를 추가해보세요 😊</Link></li>
            } */}

        </ul>
      
        
    )

}
export default Navigation;