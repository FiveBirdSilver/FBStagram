import React from "react";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc, onSnapshot } from "firebase/firestore";
import { dbService, storageService } from "../myBase";
import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import styles from "../css/profile.module.css";
import userimg from "../image/user.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons"
import {faSignOutAlt, faHome} from "@fortawesome/free-solid-svg-icons";
import Profilefiled from "./Profilefiled";

function Profile({ UserObj }) {
    const [editname, seteditname] = useState(UserObj.displayName);
    const [Attachment, setAttachment] = useState(); // 업로드한 파일의 이미지 url이 담겨있음
    const [addprofile, setaddprofile] = useState(false);

    const addbtn = () => {
        setaddprofile(prev => !prev);
    }

    const FileUpload = (event) => {
        const { files } = event.target;
        const theFile = files[0]; // 기본적으로 많은 파일을 원하는 만큼 가질수 있는데, input을 하나만 받을 것이기 때문에 [0]
        const reader = new FileReader(); // 파일의 내용을 일고 사용자의 컴퓨터에 저장하는 것을 가능케 해주는 API
        reader.onloadend = (finishedEvent) => { // 파일이 업로드 하면 이미지를 가공하거나 확인하는 작업을 위해 event를 Listening 하고 있어햐 함.
            console.log(finishedEvent); // 파일이 로드 되는 것이 끝나면, 즉 파일을 전부 읽었을 경우
            const { currentTarget: { result } } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }


    let auth = getAuth();
    const onLogOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            window.location.reload();
            alert("로그아웃 되었습니다. 로그인 후 다시 이용해 주세요")
        })

    }

    const getMyInfo = async () => {
        const q = query(collection(dbService, "fbstagram"), where("creatorID", "==", UserObj.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        
        });
    }

    useEffect(() => {
        getMyInfo();

    }, [UserObj])

    const Change = (event) => {
        const { value } = event.target;
        seteditname(value);
    }
    const Submit = async (e) => {
        e.preventDefault();
        const fileRef = ref(storageService, `${UserObj.uid}/${uuidv4()}`);
        const uploadfile = await uploadString(fileRef, Attachment, "data_url");
        let PhotoUrl = await getDownloadURL(uploadfile.ref) // 업로드한 사진을 다운받기 위함

        await updateProfile(UserObj, { displayName: editname, photoURL: PhotoUrl })
        window.location.reload();

    }

    const user = auth.currentUser;
    if (user !== null) {
        user.providerData.forEach((UserObj) => { //구글 , 깃 허브로 부터 정보 가져오기
        });
    }
    return (
        
        <div className={styles.contain}>
            <div className={styles.titlenlogout}>
                <p className={styles.title}>MY FBStagram</p>
                <Link to={"/Home"}><button className={styles.profilebtn}><FontAwesomeIcon icon={faHome}
                  style={{ color: 'white', fontSize: '20px'}}/></button></Link>               
                <Link to={"/"}><button className={styles.profilebtn} onClick={onLogOut}><FontAwesomeIcon icon={faSignOutAlt}
                  style={{ color: 'white', fontSize: '20px'}}/></button></Link>
            </div>
            <div className={styles.myprofile}>
                <div className={styles.myprofilephoto}>
                    {UserObj.photoURL ? <img src={UserObj.photoURL} style={{borderRadius:'50%'}}/> : 
                    <img src={userimg} />}
                    
                    <div className={styles.emailnname}>
                        <h4>Email : {UserObj.email}</h4>
                        {UserObj.displayName 
                            ?
                            <div>
                                <h4>Name : {UserObj.displayName}</h4>
                            </div>
                            : <div>
                                {addprofile ? 
                                    <form onSubmit={Submit}>
                                            <input className={styles.input}style={{backgroundColor:"transparent"}} type="file" accept="image/*" onChange={FileUpload} />
                                            <input className={styles.input}type="text" placeholder="이름을 입력하세요" value={editname} onChange={Change} />
                                        <input className={styles.input}style={{width:'100%'}} type="submit" value="프로필 업데이트" />
                                    </form>
                                    : <div className={styles.namenphoto} >
                                        <h3>이름 및 사진 추가하기</h3>
                                        <button className={styles.profilebtn} onClick={addbtn}><FontAwesomeIcon icon={faPlusSquare}
                                            style={{ color: 'white', fontSize: '20px', paddingLeft: '10px' }} /></button>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
            <Profilefiled UserObj={UserObj}/>            
        </div>
    )

}
export default Profile;