import React, { useEffect, useState } from "react";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup
} from "firebase/auth";
import styles from "../css/Auth.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

function Auth() {
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [Error, setError] = useState("");
    const [Account, setAccount] = useState(true); // 계정의 유무 확인

    const onchange = (event) => {
        const { name, value } = event.target;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    }
    const onsubmit = async (event) => {
        event.preventDefault();
        const auth = getAuth();
        try {
            if (Account) { // 계정이 있으면 기존 계정으로 로그인, 없으면 새로 만들기
                await signInWithEmailAndPassword(auth, Email, Password)
            } else 
                await createUserWithEmailAndPassword(auth, Email, Password)
        } catch (Error) {
            const str = Error.message.substring(10);
            const str2 = str.replace("auth/","Reason : ")
            setError(str2);

        }
    }
    const SocialLogin = async (event) => {
        const { name } = event.target;
        let auth = getAuth();

        if (name === "google") {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider)
                .then((result) => {
                    // 구글 API를 사용.
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    const user = result.user;
                })
        } else if (name === "github") {
            const provider = new GithubAuthProvider();
            signInWithPopup(auth, provider)
                .then((result) => {
                    // Github API 사용.
                    const credential = GithubAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    const user = result.user;
                })
        }
    }
    const toggleAccount = () => setAccount((prev) => !prev);
    return (
        <div className={styles.contain}>
            <h1>FBStagram</h1>
            <form onSubmit={onsubmit}>
                <input className={styles.input} name="email" type="email" value={Email} placeholder="이메일" onChange={onchange} />
                <input className={styles.input} name="password" type="password" value={Password} placeholder="비밀번호" 
                minLength="6" 
                onChange={onchange} />
                <input className={styles.submit} type="submit" value={Account ? "로그인" : "가입하기"} />
            </form>
            <p>{Error}</p>
            <span className={styles.span}>또는</span>
           
                <div className={styles.socialbtn}><FontAwesomeIcon icon={faGoogle} style={{color:'1778F2', fontSize:'20px'}}
                /><button onClick={SocialLogin} name="google">Google으로 로그인</button></div>
                <div className={styles.socialbtn}><FontAwesomeIcon icon={faGithub} style={{color:'1778F2', fontSize:'20px'}}
                /><button onClick={SocialLogin} name="github">Github으로 로그인</button></div>
                <div className={styles.join}>
                <span  className={styles.span} onClick={toggleAccount}>
                {Account ? <div className={styles.joinbtn}>계정이 없으신가요? <span  className={styles.span}>가입하기</span> </div>: null}
                </span> </div> {/* 구글과 깃허브를 이용한 소셜 로그인 마련*/}
                <h3>FiveBirdSilver ⓒ 2021 All rights reserved.</h3>
        </div>

    )
}
export default Auth;

