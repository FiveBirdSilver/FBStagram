import { useEffect, useState } from "react";
import AppRouter from "./Router";
import {  onAuthStateChanged } from "firebase/auth";
import { authService } from "../myBase"
function App() {
  const [Load, setLoad] = useState(false); // 초기 값 
  const [UserObj, setUserObj] = useState(null); //onAuthStateChanged가 바뀐다면, 받을 user을 setUserobj에 넣음

  useEffect(() => { //페이지가 로드 되면, 로그인의 유무를 확인함
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj(user);
        
      } 
      setLoad(true)
    });
  },[]) // isLoggedIn은 단지 로그인의 true&false만 확인, UserObj은 로그인한 유저의 정보가 들어있음.
  
  return(
    <>
      {Load?
      <AppRouter propsLog={Boolean(UserObj)} UserObj={UserObj}/>
      :"Loading..."} 
      {/* //로드 되면 초기 값이 변하면서 Router.js로 props 값 넘김, 유저의 정보가 담긴 UserObj의 값을 Router.js로 넘김 */}
    </>
  );
}

export default App;
